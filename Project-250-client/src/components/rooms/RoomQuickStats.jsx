import { motion } from "framer-motion";
import { mockRooms } from "../../data/mockData";
import Card from "../ui/Card";


const RoomQuickStats = () => (
  <motion.div
    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
    initial="hidden"
    animate="visible"
    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
  >
    {[
      { value: mockRooms.length, label: "Total Rooms", color: "text-gray-800" },
      { value: mockRooms.filter((r) => r.status === "available").length, label: "Available", color: "text-green-600" },
      { value: mockRooms.filter((r) => r.status === "occupied").length, label: "Occupied", color: "text-yellow-600" },
      {
        value: `${Math.round((mockRooms.filter((r) => r.status === "occupied").length / mockRooms.length) * 100)}%`,
        label: "Occupancy Rate",
        color: "text-indigo-600",
      },
    ].map((stat) => (
      <motion.div key={stat.label} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <Card className="p-4 text-center bg-white shadow-md rounded-xl">
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-sm text-gray-500">{stat.label}</div>
        </Card>
      </motion.div>
    ))}
  </motion.div>
);

export default RoomQuickStats;
