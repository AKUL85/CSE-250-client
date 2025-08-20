// src/components/ComplaintHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import dayjs from 'dayjs';

const ComplaintHeader = ({ complaint }) => {
  return (
    <div className="flex items-center gap-4">
      <Link
        to="/complaints"
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
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
  );
};

export default ComplaintHeader;