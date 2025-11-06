import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RoomHeader from "../../components/rooms/RoomHeader";
import RoomFilters from "../../components/rooms/RoomFilters";
import RoomCard from "../../components/rooms/RoomCard";
import RoomEmptyState from "../../components/rooms/RoomEmptyState";
import RoomQuickStats from "../../components/rooms/RoomQuickStats";

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]); // fetched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("all");
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Fetch data from backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/rooms/all");
        if (!res.ok) throw new Error("Failed to fetch rooms");
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error("❌ Error fetching rooms:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Filtering logic
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.number
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBlock =
      selectedBlock === "all" || room.block === selectedBlock;
    const matchesFloor =
      selectedFloor === "all" || String(room.floor) === selectedFloor;
    const matchesType = selectedType === "all" || room.type === selectedType;
    return matchesSearch && matchesBlock && matchesFloor && matchesType;
  });

  // UI states
  if (loading) return <div className="p-6 text-gray-700">Loading rooms...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <RoomHeader />
      <RoomFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedBlock={selectedBlock}
        setSelectedBlock={setSelectedBlock}
        selectedFloor={selectedFloor}
        setSelectedFloor={setSelectedFloor}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      {/* Room Grid */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
        }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredRooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </motion.div>

      {filteredRooms.length === 0 && <RoomEmptyState />}
      <RoomQuickStats />
    </div>
  );
};

export default RoomsPage;
