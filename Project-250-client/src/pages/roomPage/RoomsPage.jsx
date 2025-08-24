import { useState } from "react";
import { motion } from "framer-motion";
import { mockRooms } from "../../data/mockData";
import RoomHeader from "../../components/rooms/RoomHeader";
import RoomFilters from "../../components/rooms/RoomFilters";
import RoomCard from "../../components/rooms/RoomCard";
import RoomEmptyState from "../../components/rooms/RoomEmptyState";
import RoomQuickStats from "../../components/rooms/RoomQuickStats";



const RoomsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("all");
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const filteredRooms = mockRooms.filter((room) => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = selectedBlock === "all" || room.block === selectedBlock;
    const matchesFloor = selectedFloor === "all" || room.floor.toString() === selectedFloor;
    const matchesType = selectedType === "all" || room.type === selectedType;
    return matchesSearch && matchesBlock && matchesFloor && matchesType;
  });

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
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </motion.div>

      {filteredRooms.length === 0 && <RoomEmptyState />}
      <RoomQuickStats />
    </div>
  );
};

export default RoomsPage;
