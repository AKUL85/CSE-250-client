import { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  Menu, Search, Bell, User, LogOut,
  Settings, CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ onMenuClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState(2); // Mock notification count
  const { signOutUser } = useAuth()
  // Mock user data (replace with real data later)
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    avatar: "https://i.pravatar.cc/150?img=32",
    role: "student",
    walletBalance: 120.50
  };

const navigate=useNavigate();

  const logout = async () => {
    try {
      await signOutUser();
      await Swal.fire({
        icon: 'success',
        title: 'Signed out!',
        text: 'You have been successfully signed out.',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
      navigate('/login');
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Signout Failed',
        text: error.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#6C5CE7',
      });
    }
  };

  return (
    <header className="bg-gradient-to-r from-green-400 via-purple-400 to-pink-400 shadow-lg px-4 lg:px-6 h-16 flex items-center justify-between relative z-30">
      {/* Left side: Menu button for mobile, Search for desktop */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>

        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-72 rounded-full bg-white text-gray-700 placeholder-gray-400 text-sm focus:ring-2 focus:ring-pink-400 shadow-sm outline-none"
          />
        </div>
      </div>

      {/* Right side: Notifications and User menu */}
      <div className="flex items-center gap-3">
        {/* Notifications button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="relative p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <Bell className="w-5 h-5 text-white" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
              {notifications}
            </span>
          )}
        </motion.button>

        {/* User menu dropdown */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover"
            />
            {user?.role === 'student' && user?.walletBalance !== undefined && (
              <span className="hidden sm:block text-sm font-semibold text-white">
                ${user.walletBalance.toFixed(2)}
              </span>
            )}
          </motion.button>

          {/* User menu dropdown content */}
          {showUserMenu && (
            <>
              {/* Overlay to close menu when clicking outside */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
              >
                {/* User info in dropdown */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                {/* Menu items in dropdown */}
                <div className="py-2">
                  <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors">
                    <User className="w-4 h-4 text-gray-500" />
                    Profile
                  </button>
                  <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors">
                    <Settings className="w-4 h-4 text-gray-500" />
                    Settings
                  </button>
                  {user?.role === 'student' && (
                    <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      Wallet
                    </button>
                  )}
                </div>

                {/* Logout button */}
                <div className="py-2 border-t border-gray-100">
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;