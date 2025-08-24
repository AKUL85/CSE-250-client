import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex items-center justify-center min-h-96 bg-gray-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center p-8 bg-white rounded-xl shadow-md"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Complaint Not Found</h2>
      <p className="text-gray-500 mb-4">The complaint you're looking for doesn't exist.</p>
      <Link
        to="/complaints"
        className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all"
      >
        Back to Complaints
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
