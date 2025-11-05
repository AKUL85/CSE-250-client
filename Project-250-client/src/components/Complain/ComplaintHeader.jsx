import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const ComplaintHeader = ({ setShowCreateForm }) => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  >
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Complaints</h1>
      <p className="text-gray-500">Track and manage your issues with ease</p>
    </div>
    <Link to="/complain-form">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all"
    >
      <Plus className="w-5 h-5" />
      File Complaint
    </motion.button></Link>
  </motion.div>
);

export default ComplaintHeader;
