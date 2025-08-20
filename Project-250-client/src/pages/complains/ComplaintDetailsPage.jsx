import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Clock, CheckCircle, AlertTriangle,
  User, Calendar, MessageSquare, Paperclip, Building
} from 'lucide-react';

import dayjs from 'dayjs';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { mockComplaints } from '../../data/mockData';

const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const complaint = mockComplaints.find(c => c.id === id);

  if (!complaint) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Complaint Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The complaint you're looking for doesn't exist.
          </p>
          <Link
            to="/complaints"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Back to Complaints
          </Link>
        </div>
      </div>
    );
  }

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={itemVariants}>
        <div className="flex items-center gap-4">
          <Link
            to="/complaints"
            className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {complaint.title}
            </h1>
            <p className="text-gray-600">
              Complaint #{complaint.id} • Filed {dayjs(complaint.createdAt).format('MMM D, YYYY')}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Details */}
          <motion.div initial="hidden" animate="visible" variants={itemVariants}>
            <Card className="p-6 bg-white shadow-lg rounded-xl">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Complaint Details
                  </h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant={getStatusColor(complaint.status)} className="flex items-center gap-1">
                      {getStatusIcon(complaint.status)}
                      {complaint.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant={getPriorityColor(complaint.priority)}>
                      {complaint.priority} priority
                    </Badge>
                    <Badge variant="secondary">
                      {complaint.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {complaint.description}
                  </p>
                </div>

                {complaint.photos && complaint.photos.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">
                      Attached Photos
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {complaint.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Complaint photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg shadow-md"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <button className="text-white font-medium">
                              View Full Size
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Updates Timeline */}
          <motion.div initial="hidden" animate="visible" variants={itemVariants}>
            <Card className="p-6 bg-white shadow-lg rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Status Updates
              </h2>
              
              <div className="space-y-6">
                {complaint.updates.map((update, index) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 items-start"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      update.status === 'resolved' ? 'bg-green-500 text-white' :
                      update.status === 'in_progress' ? 'bg-purple-600 text-white' :
                      'bg-yellow-500 text-white'
                    } shadow-md`}>
                      {getStatusIcon(update.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">
                          {update.status.replace('_', ' ').charAt(0).toUpperCase() + 
                          update.status.replace('_', ' ').slice(1)}
                        </p>
                        <span className="text-sm text-gray-500">
                          {dayjs(update.createdAt).format('MMM D, YYYY h:mm A')}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        {update.note}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        by {update.createdBy}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Complaint Info */}
          <motion.div initial="hidden" animate="visible" variants={itemVariants}>
            <Card className="p-6 bg-white shadow-lg rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4">
                Complaint Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Filed by</p>
                    <p className="font-medium text-gray-900">
                      {complaint.userName}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">
                      {dayjs(complaint.createdAt).format('MMM D, YYYY h:mm A')}
                    </p>
                  </div>
                </div>
                
                {complaint.assigneeId && (
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Assigned to</p>
                      <p className="font-medium text-gray-900">
                        Staff Member
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial="hidden" animate="visible" variants={itemVariants}>
            <Card className="p-6 bg-white shadow-lg rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Add Comment
                  </span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Paperclip className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Attach Files
                  </span>
                </button>
                
                {complaint.status !== 'resolved' && (
                  <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Update Priority
                    </span>
                  </button>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Related Complaints */}
          <motion.div initial="hidden" animate="visible" variants={itemVariants}>
            <Card className="p-6 bg-white shadow-lg rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4">
                Related Issues
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <p className="text-sm font-medium text-gray-900">
                    Power Outlet Not Working
                  </p>
                  <p className="text-xs text-gray-500">
                    Electrical • Pending
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsPage;