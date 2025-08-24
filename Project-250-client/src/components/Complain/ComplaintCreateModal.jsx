import { motion } from "framer-motion";

const ComplaintCreateModal = ({ setShowCreateForm }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50 p-4"
  >
    <motion.div
      initial={{ scale: 0.8, y: 50, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.8, y: 50, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">File New Complaint</h3>
      <p className="text-gray-500 mb-6">This feature will be available soon. For now, you can view existing complaints.</p>
      <button
        onClick={() => setShowCreateForm(false)}
        className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all"
      >
        Close
      </button>
    </motion.div>
  </motion.div>
);

export default ComplaintCreateModal;
