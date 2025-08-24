import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Card from "../ui/Card";

const ComplaintEmptyState = ({ setShowCreateForm }) => (
  <Card className="p-12 text-center bg-white shadow-md rounded-xl">
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
    >
      <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    </motion.div>
    <h3 className="text-lg font-medium text-gray-800 mb-2">No complaints found</h3>
    <p className="text-gray-500 mb-4">Try adjusting your filters or file a new complaint</p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowCreateForm(true)}
      className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all"
    >
      File New Complaint
    </motion.button>
  </Card>
);

export default ComplaintEmptyState;
