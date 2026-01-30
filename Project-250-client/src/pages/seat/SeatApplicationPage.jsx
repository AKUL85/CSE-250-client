
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { mockSeatApplications } from '../../data/mockData';
import ApplicationForm from '../../components/Seat/ApplicationForm';
import ApplicationStatus from '../../components/Seat/ApplicationStatus';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const SeatApplicationPage = () => {
  const [hasApplication, setHasApplication] = useState(0);
  const currentApplication = mockSeatApplications[0];
    console.log(currentApplication)
const onSubmit = async (data) => {
  const result = await Swal.fire({
    title: 'Submit Application',
    text: 'Are you sure you want to submit your seat application?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#6C5CE7',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Submit Application',
  });

  if (result.isConfirmed) {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      // Add file if exists
      if (data.proofFile && data.proofFile[0]) {
        formData.append('proofFile', data.proofFile[0]);
      }

      const response = await fetch('http://localhost:4000/seat-application', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed');

      setHasApplication(true);
      await Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        text: 'Your seat application has been successfully submitted',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Failed to submit application. Please try again.',
        confirmButtonColor: '#6C5CE7',
      });
    }
  }
};


  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-6"
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <h1 className="text-3xl font-bold text-gray-900">
          Seat Application
        </h1>
        <p className="text-gray-600">
          Apply for a seat in the residential hall or track your existing application
        </p>
      </motion.div>

      {hasApplication ? (
        <ApplicationStatus application={currentApplication} />
      ) : (
        <ApplicationForm onSubmit={onSubmit} />
      )}
    </motion.div>
  );
};

export default SeatApplicationPage;