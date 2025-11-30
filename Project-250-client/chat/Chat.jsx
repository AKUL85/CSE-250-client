import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./Chat.css";

const connection_link = "https://chatapp-server-8z7o.onrender.com";
const connection_link1 = "http://localhost:8001";

export function Chat() {
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

  // Initialize socket connection
  useEffect(() => {
    // In a real app, you'd get this from your auth system
    // const userId = localStorage.getItem("userId");
    const userId = "692a2de34367bd7efe8020ef";
    const email = "alnoman05405@gmail.com";

    if (!userId) {
      console.error("No user ID found. Please log in first.");
      return;
    }

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
  }, []);

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
    <div className="chat-app">
      {/* Connection Status */}
      <div className={`connection-status ${isConnected ? "" : "disconnected"}`}>
        {isConnected ? "" : "No connection"}
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <h3 className="sidebar-title">Chat Rooms</h3>
        <ul className="room-list">
          {rooms.map((room) => (
            <li
              key={room}
              className={`room-item ${activeRoom === room ? "active" : ""}`}
              onClick={() => {
                setActiveRoom(room);
                // console.log("setting active room to ", room);
                setMessages(roomMessages[room]);
                activeRoomRef.current = room;
                scrollToBottom();
              }}
            >
              <span className="room-icon">#</span>
              {room}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="main-chat">
        {/* Room Header */}
        <div className="chat-header">
          <h2>#{activeRoom}</h2>
          <span className="room-info">
            {messages.length} messages
            {!activeRoom && " - Select a room to start chatting"}
          </span>
        </div>

        {/* Messages Area */}
        <div className="messages-container">
          {messages.length >= 20 && (
            <div className="load-more-container">
              <button onClick={loadMoreMessages} className="load-more-btn">
                Load More Messages
              </button>
            </div>
          )}

          <div className="messages-list">
            {messages.map((message, index) => {
              const isOwnMessage =(message.username || message.name) === "noman";
              return (
                <div
                  key={message._id?.$oid || index}
                  className={`message-container ${isOwnMessage ? "own-message" : "other-message"}`}
                >
                  <div className="message">
                    <div className="message-header">
                      <span className="user-name">
                        {message.username || message.name}
                      </span>
                      <span className="message-time">
                        {formatTime(message.timestamp || message.time?.$date)}
                      </span>
                    </div>
                    <div className="message-text">{message.text}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 0 && activeRoom && (
            <div className="no-messages">
              No messages yet. Start the conversation!
            </div>
          )}
        </div>

        {/* Message Input */}
        {activeRoom && (
          <form onSubmit={handleSendMessage} className="message-input-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message #${activeRoom}`}
              className="message-input"
              disabled={!isConnected}
            />
            <button
              type="submit"
              className="send-button"
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
