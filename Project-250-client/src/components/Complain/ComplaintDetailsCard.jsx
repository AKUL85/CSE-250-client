// src/components/ComplaintDetailsCard.jsx
import React from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Card from './ui/Card'; // Assuming Card component is available
import Badge from './ui/Badge'; // Assuming Badge component is available

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

const ComplaintDetailsCard = ({ complaint }) => {
  return (
    <Card className="p-6 bg-white shadow-lg rounded-xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Complaint Details
          </h2>
          <div className="flex items-center gap-3">
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
          <p className="text-gray-700 leading-relaxed">
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
                    className="w-full h-32 object-cover rounded-lg"
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
  );
};

export default ComplaintDetailsCard;