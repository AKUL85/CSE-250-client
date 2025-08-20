// src/components/StatusTimeline.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Card from './ui/Card'; // Assuming Card component is available
import dayjs from 'dayjs';

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

const StatusTimeline = ({ updates }) => {
  return (
    <Card className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Status Updates
      </h2>
      
      <div className="space-y-6">
        {updates.map((update, index) => (
          <motion.div
            key={update.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              update.status === 'resolved' ? 'bg-green-500 text-white' :
              update.status === 'in_progress' ? 'bg-purple-600 text-white' :
              'bg-yellow-500 text-white'
            }`}>
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
  );
};

export default StatusTimeline;