// src/components/ApplicationStatus.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Bed, FileText, CheckCircle, Clock, AlertTriangle, Building } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';


const getStatusIcon = (status) => {
  switch (status) {
    case 'submitted':
      return <FileText className="w-4 h-4" />;
    case 'under_review':
      return <Clock className="w-4 h-4" />;
    case 'approved':
      return <CheckCircle className="w-4 h-4" />;
    case 'rejected':
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'submitted':
      return 'primary';
    case 'under_review':
      return 'warning';
    case 'approved':
      return 'success';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ApplicationStatus = ({ application }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="p-8">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
            application.status === 'approved' 
              ? 'bg-green-100' 
              : 'bg-blue-100'
          }`}>
            <Bed className={`w-8 h-8 ${
              application.status === 'approved' 
                ? 'text-green-600' 
                : 'text-blue-600'
            }`} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Status
          </h2>
          <Badge
            variant={getStatusColor(application.status)}
            className="flex items-center gap-1 text-base px-4 py-2"
          >
            {getStatusIcon(application.status)}
            {application.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Application Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Room Type
            </label>
            <p className="text-gray-900 font-medium">
              {application.preferences.roomType}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Floor
            </label>
            <p className="text-gray-900 font-medium">
              Floor {application.preferences.floor}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Block
            </label>
            <p className="text-gray-900 font-medium">
              Block {application.preferences.block}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Date
            </label>
            <p className="text-gray-900 font-medium">
              {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {application.preferences.specialRequests && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests
            </label>
            <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
              {application.preferences.specialRequests}
            </p>
          </div>
        )}

        {/* Assignment Info (if approved) */}
        {application.status === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Building className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">
                Room Assignment
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-green-700">Room Number:</span>
                <p className="font-bold text-green-900">
                  {application.assignedRoom}
                </p>
              </div>
              <div>
                <span className="text-sm text-green-700">Seat:</span>
                <p className="font-bold text-green-900">
                  Seat {application.assignedSeat}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Application Timeline
          </h3>
          <div className="space-y-4">
            {application.timeline.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.status === 'approved' 
                    ? 'bg-green-500 text-white' 
                    : step.status === 'under_review'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}>
                  {getStatusIcon(step.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">
                      {step.note}
                    </p>
                    <span className="text-sm text-gray-500">
                      {new Date(step.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ApplicationStatus;