import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Clock, AlertTriangle, CheckCircle, Eye, 
  Wrench, Zap, Hammer, HelpCircle, Building 
} from "lucide-react";
import dayjs from "dayjs";
import Card from "../ui/Card";
import Badge from "../ui/Badge";


const ComplaintCard = ({ complaint }) => {
  const categories = [
    { value: 'plumbing', label: 'Plumbing', icon: Wrench },
    { value: 'electricity', label: 'Electrical', icon: Zap },
    { value: 'furniture', label: 'Furniture', icon: Hammer },
    { value: 'other', label: 'Other', icon: HelpCircle },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'primary';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category) => {
    const categoryObj = categories.find(cat => cat.value === category) || { icon: HelpCircle };
    return categoryObj.icon;
  };

  const getCategoryIconColor = (category) => {
    switch (category) {
      case 'plumbing': return 'text-blue-500';
      case 'electricity': return 'text-amber-500';
      case 'furniture': return 'text-green-500';
      case 'other': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryBgColor = (category) => {
    switch (category) {
      case 'plumbing': return 'bg-blue-100';
      case 'electricity': return 'bg-amber-100';
      case 'furniture': return 'bg-green-100';
      case 'other': return 'bg-gray-100';
      default: return 'bg-gray-100';
    }
  };

  const CategoryIcon = getCategoryIcon(complaint.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Category Icon */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getCategoryBgColor(complaint.category)}`}>
            <CategoryIcon className={`w-6 h-6 ${getCategoryIconColor(complaint.category)}`} />
          </div>

          {/* Complaint Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{complaint.title}</h3>
                <p className="text-sm text-gray-500">Complaint #{complaint.id} • Filed by {complaint.userName}</p>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Badge variant={getPriorityColor(complaint.priority)} size="sm">
                  {complaint.priority} priority
                </Badge>
                <Badge variant={getStatusColor(complaint.status)} className="flex text-black bg-amber-600 items-center gap-1">
                  {getStatusIcon(complaint.status)}
                  {complaint.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">{complaint.description}</p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Created {dayjs(complaint.createdAt).format('MMM D, YYYY')}</span>
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
                to={`/complaints/${complaint._id}`}
                className="flex items-center gap-2 px-4 py-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
              >{console.log("bajhbjb ", complaint._id)}
                <Eye className="w-4 h-4" />
                View Details
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ComplaintCard;
