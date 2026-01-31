import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../src/context/AuthContext";

const connection_link = "https://chatapp-server-8z7o.onrender.com";
const connection_link1 = "http://localhost:8001";

export function Chat() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState("");
  const [roomMessages, setRoomMessages] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const activeRoomRef = useRef("");
  const messagesEndRef = useRef(null);
  const isLoadingMoreRef = useRef(false);


  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

 
  useEffect(() => {
   
    if (!user || !user._id) {
      console.error("No user found. Please log in first.");
      return;
    }

    const userId = user._id;
    const email = user.email;

    const newSocket = io(connection_link, {
      auth: {
        _id: userId,
        email: email,
      },
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    newSocket.on("roomList", (userRooms) => {
      // console.log("Received rooms:", userRooms);
      setRooms(userRooms);
      setActiveRoom("general");
      activeRoomRef.current = "general";
    });

    newSocket.on("room-messages", (data) => {
      // console.log("Received messages for room:", data.room, data.messages);
      setRoomMessages((prev) => ({
        ...prev,
        [data.room]: data.messages,
      }));

      if (data.room === activeRoomRef.current) {
        setMessages(data.messages);
      }
    });

    newSocket.on("receive", (messageData) => {
      const { roomId } = messageData;
      // console.log("got", messageData, "active room", activeRoomRef.current);

      setRoomMessages((prev) => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), messageData],
      }));

      if (roomId === activeRoomRef.current) {
        setMessages((prev) => [...prev, messageData]);
        scrollToBottom();
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMoreMessages = () => {
    if (messages.length > 0 && socket) {
      isLoadingMoreRef.current = true;
      const lastMessageTime = messages[0].timestamp;

      socket.emit(
        "load-older-messages",
        {
          roomId: activeRoom,
          lastMessageTime: lastMessageTime,
        },
        (response) => {
          if (response.status === "success") {
            console.log(response.messages);
            setMessages((prev) => [...response.messages, ...prev]);
          } else {
            console.error("Failed to load older messages");
          }
          isLoadingMoreRef.current = false;
        }
      );
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket && activeRoom) {
      socket.emit(
        "send",
        {
          text: newMessage,
          roomId: activeRoom,
        },
        (response) => {
          if (response.status === "success") {
            setNewMessage("");
          } else {
            console.error("Failed to send message");
          }
        }
      );
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-[85vh] bg-gray-800 text-white relative">
      {/* Connection Status */}
      <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs z-10 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>

      {/* Sidebar */}
      <div className="w-60 bg-gray-700 p-4 border-r border-gray-600">
        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Chat Rooms</h3>
        <ul className="space-y-1">
          {rooms.map((room) => (
            <li
              key={room}
              className={`p-2 cursor-pointer rounded flex items-center transition-colors ${activeRoom === room ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
              onClick={() => {
                setActiveRoom(room);
                setMessages(roomMessages[room] || []);
                activeRoomRef.current = room;
                scrollToBottom();
              }}
            >
              <span className="text-gray-400 mr-2">#</span>
              {room}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Room Header */}
        <div className="p-4 border-b border-gray-600 flex justify-between items-center">
          <h2 className="text-lg font-semibold">#{activeRoom}</h2>
          <span className="text-sm text-gray-400">
            {messages.length} messages
            {!activeRoom && " - Select a room to start chatting"}
          </span>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          {messages.length >= 20 && (
            <div className="flex justify-center mb-4">
              <button onClick={loadMoreMessages} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500">
                Load More Messages
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4 flex-1">
            {messages.map((message, index) => {
              const isOwnMessage = (message.username || message.name) === user?.name;
              return (
                <div
                  key={message._id?.$oid || index}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`bg-gray-600 rounded-lg p-3 max-w-xs lg:max-w-md ${isOwnMessage ? 'bg-blue-600' : ''}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-white">
                        {message.username || message.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(message.timestamp || message.time?.$date)}
                      </span>
                    </div>
                    <div className="text-gray-100">{message.text}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 0 && activeRoom && (
            <div className="text-center text-gray-400 italic mt-12">
              No messages yet. Start the conversation!
            </div>
          )}
        </div>

        {/* Message Input */}
        {activeRoom && (
          <form onSubmit={handleSendMessage} className="p-4 bg-gray-700 border-t border-gray-600 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message #${activeRoom}`}
              className="flex-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isConnected}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={!isConnected || !newMessage.trim()}
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
