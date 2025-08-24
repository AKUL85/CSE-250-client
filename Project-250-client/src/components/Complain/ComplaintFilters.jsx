import { motion } from "framer-motion";
import { Search, Wrench, Zap, Hammer, HelpCircle } from "lucide-react";
import Card from "../ui/Card";


const ComplaintFilters = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, selectedStatus, setSelectedStatus }) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'plumbing', label: 'Plumbing', icon: Wrench },
    { value: 'electricity', label: 'Electrical', icon: Zap },
    { value: 'furniture', label: 'Furniture', icon: Hammer },
    { value: 'other', label: 'Other', icon: HelpCircle },
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-white shadow-md rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-gray-600 pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none cursor-pointer transition-all"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none cursor-pointer transition-all"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </Card>
    </motion.div>
  );
};

export default ComplaintFilters;
