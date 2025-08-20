// src/components/ProfileSidebar.jsx
import { motion } from 'framer-motion';
import { User, Mail, CreditCard } from 'lucide-react';
import Card from '../ui/Card';


const ProfileSidebar = ({ user, itemVariants }) => {
  return (
    <motion.div variants={itemVariants} className="space-y-6">
      {user?.role === 'student' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-zinc-900">
            Wallet Balance
          </h3>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span className="text-3xl font-bold text-blue-600">
                ${user?.walletBalance?.toFixed(2)}
              </span>
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl font-medium shadow-md hover:bg-blue-700 transition-all duration-200">
              Top Up Wallet
            </button>
          </div>
        </Card>
      )}

      <Card className="p-6 my-7">
        <h3 className="text-lg font-semibold mb-4 text-zinc-900">
          Account Statistics
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-zinc-600">Member since</span>
            <span className="text-sm font-medium text-zinc-900">
              {new Date(user?.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-zinc-600">Total orders</span>
            <span className="text-sm font-medium text-zinc-900">43</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-zinc-600">Complaints resolved</span>
            <span className="text-sm font-medium text-zinc-900">12</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-zinc-900">
          Quick Actions
        </h3>
        <div className="space-y-3">
          <button className="w-full p-3 text-left rounded-xl hover:bg-zinc-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-zinc-900">Change Password</p>
                <p className="text-xs text-zinc-500">Update your password</p>
              </div>
            </div>
          </button>
          <button className="w-full p-3 text-left rounded-xl hover:bg-zinc-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-zinc-900">Email Preferences</p>
                <p className="text-xs text-zinc-500">Manage notifications</p>
              </div>
            </div>
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProfileSidebar;