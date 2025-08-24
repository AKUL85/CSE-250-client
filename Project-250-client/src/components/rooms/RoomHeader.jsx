import { motion } from "framer-motion";

const RoomHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h1 className="text-3xl font-bold text-gray-800">Rooms & Accommodation</h1>
    <p className="text-gray-500">Browse available rooms and view accommodation details</p>
  </motion.div>
);

export default RoomHeader;
