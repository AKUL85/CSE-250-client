import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const PageHeader = ({ onAddRoom }) => (
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
      <p className="text-gray-600">Manage room inventory, assignments, and maintenance</p>
    </div>
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onAddRoom}
      className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
    >
      <Plus className="w-5 h-5" /> Add Room
    </motion.button>
  </div>
);

export default PageHeader;
