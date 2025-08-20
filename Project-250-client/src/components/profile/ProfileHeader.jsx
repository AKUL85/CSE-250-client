// src/components/ProfileHeader.jsx
import { motion } from 'framer-motion';
import { Edit3, Save, X, QrCode } from 'lucide-react';

const ProfileHeader = ({ isEditing, setIsEditing, showQR, setShowQR, handleSubmit, onSubmit, handleCancel, itemVariants }) => {
  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-zinc-900">
          Profile
        </h1>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowQR(!showQR)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium shadow-md hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            Digital ID
          </motion.button>
          {!isEditing ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </motion.button>
          ) : (
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit(onSubmit)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium shadow-md hover:bg-emerald-700 transition-all duration-200 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                className="px-4 py-2 bg-zinc-500 text-white rounded-xl font-medium shadow-md hover:bg-zinc-600 transition-all duration-200 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;