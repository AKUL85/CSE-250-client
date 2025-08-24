import { motion } from "framer-motion";
import { Building } from "lucide-react";
import Card from "../ui/Card";


const RoomEmptyState = () => (
  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
    <Card className="p-12 text-center bg-white shadow-md rounded-xl">
      <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-800 mb-2">No rooms found</h3>
      <p className="text-gray-500">Try adjusting your search criteria or filters</p>
    </Card>
  </motion.div>
);

export default RoomEmptyState;
