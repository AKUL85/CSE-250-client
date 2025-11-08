// src/pages/ProfilePage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Swal from 'sweetalert2';

import { useAuth } from '../../context/AuthContext';
import ProfileHeader from '../../components/profile/ProfileHeader';
import QRModal from '../../components/profile/QRModal';
import ProfileCard from '../../components/profile/ProfileCard';
import ProfileSidebar from '../../components/profile/ProfileSidebar';

// Validation schema (remains here as it's part of the page's core logic)
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  emergencyContact: z.string().min(10, 'Please enter a valid emergency contact'),
});

const ProfilePage2 = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  console.log(user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.displayName || '',
      phone: user.phoneNumber || '',
      emergencyContact: user.emergencyContact || 'N.A',
    },
  });

  const onSubmit = async (data) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser(data);
      setIsEditing(false);
      await Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been successfully updated',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'Failed to update profile. Please try again.',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name || '',
      phone: user?.phone || '',
      emergencyContact: user?.emergencyContact || '',
    });
    setIsEditing(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-6 p-6 bg-zinc-100 rounded-2xl shadow-inner"
    >
      <ProfileHeader
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        showQR={showQR}
        setShowQR={setShowQR}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        handleCancel={handleCancel}
        itemVariants={itemVariants}
      />

      <QRModal showQR={showQR} setShowQR={setShowQR} user={user} />

      <div >
        <ProfileCard
          user={user}
          isEditing={isEditing}
          register={register}
          errors={errors}
          itemVariants={itemVariants}
        />
        <ProfileSidebar
          user={user}
          itemVariants={itemVariants}
        />
      </div>
    </motion.div>
  );
};

export default ProfilePage2;