import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, Filter, Search, AlertTriangle, 
  Clock, CheckCircle, Eye, Wrench, Zap, 
  Hammer, HelpCircle,
  Building,
} from 'lucide-react';
import { mockComplaints } from '../../data/mockData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import dayjs from 'dayjs';


const ComplaintsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories', icon: HelpCircle },
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

  const filteredComplaints = mockComplaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || complaint.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || complaint.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <AlertTriangle className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'primary';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCategoryIcon = (category) => {
    const categoryObj = categories.find(cat => cat.value === category);
    return categoryObj ? categoryObj.icon : HelpCircle;
  };

  const getCategoryIconColor = (category) => {
    switch (category) {
      case 'plumbing':
        return 'text-blue-600';
      case 'electricity':
        return 'text-amber-600';
      case 'furniture':
        return 'text-lime-600';
      case 'other':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };
  
  const getCategoryBgColor = (category) => {
    switch (category) {
      case 'plumbing':
        return 'bg-blue-50';
      case 'electricity':
        return 'bg-amber-50';
      case 'furniture':
        return 'bg-lime-50';
      case 'other':
        return 'bg-gray-100';
      default:
        return 'bg-gray-100';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Complaints
            </h1>
            <p className="text-gray-600">
              Report issues and track the status of your complaints
            </p>
          </div>
  
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            File Complaint
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial="hidden" animate="visible" variants={itemVariants}>
        <Card className="p-6 bg-white shadow-lg rounded-xl">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none cursor-pointer transition-all"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none cursor-pointer transition-all"
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

      {/* Complaints List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredComplaints.map((complaint) => {
          const CategoryIcon = getCategoryIcon(complaint.category);
          
          return (
            <motion.div key={complaint.id} variants={itemVariants}>
              <Card className="p-6 bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Category Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getCategoryBgColor(complaint.category)}`}>
                    <CategoryIcon className={`w-6 h-6 ${getCategoryIconColor(complaint.category)}`} />
                  </div>

                  {/* Complaint Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {complaint.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Complaint #{complaint.id} • Filed by {complaint.userName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-wrap">
                        <Badge
                          variant={getPriorityColor(complaint.priority)}
                          size="sm"
                        >
                          {complaint.priority} priority
                        </Badge>
                        <Badge 
                          variant={getStatusColor(complaint.status)}
                          className="flex items-center gap-1"
                        >
                          {getStatusIcon(complaint.status)}
                          {complaint.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {complaint.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          Created {dayjs(complaint.createdAt).format('MMM D, YYYY')}
                        </span>
                        {complaint.assigneeId && (
                          <span className="flex items-center gap-1">
                            <Building className="w-4 h-4 text-gray-400" />
                            Assigned to staff
                          </span>
                        )}
                        {complaint.photos && complaint.photos.length > 0 && (
                          <span className="flex items-center gap-1">
                            <img src="/path/to/camera-icon.svg" alt="photos" className="w-4 h-4" />
                            📷 {complaint.photos.length} photo{complaint.photos.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/complaints/${complaint.id}`}
                        className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {filteredComplaints.length === 0 && (
        <Card className="p-12 text-center bg-white shadow-lg rounded-xl">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No complaints found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or file a new complaint
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            File New Complaint
          </motion.button>
        </Card>
      )}

      {/* Create Complaint Modal (placeholder) */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              File New Complaint
            </h3>
            <p className="text-gray-600 mb-6">
              This feature will be available in the full implementation. For now, you can view existing complaints.
            </p>
            <button
              onClick={() => setShowCreateForm(false)}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ComplaintsPage;