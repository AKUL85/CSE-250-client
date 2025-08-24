import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Card from "../ui/Card";

const RoomFilters = ({
  searchTerm,
  setSearchTerm,
  selectedBlock,
  setSelectedBlock,
  selectedFloor,
  setSelectedFloor,
  selectedType,
  setSelectedType,
}) => {
  const blocks = ["all", "A", "B", "C", "D"];
  const floors = ["all", "1", "2", "3", "4"];
  const roomTypes = ["all"];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="p-6 bg-white shadow-md rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Block Filter */}
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none cursor-pointer transition-all"
          >
            {blocks.map((block) => (
              <option key={block} value={block}>
                {block === "all" ? "All Blocks" : `Block ${block}`}
              </option>
            ))}
          </select>

          {/* Floor Filter */}
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none cursor-pointer transition-all"
          >
            {floors.map((floor) => (
              <option key={floor} value={floor}>
                {floor === "all" ? "All Floors" : `Floor ${floor}`}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none cursor-pointer transition-all"
          >
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </Card>
    </motion.div>
  );
};

export default RoomFilters;
