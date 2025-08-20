import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Swal from 'sweetalert2';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
  const { signInWithEmailPass, user, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

 

  // Form hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'john.doe@university.edu',
      password: 'password123',
    },
  });
   // Redirect if already logged in
  if (user) {
    return <Navigate to={from} replace />;
  }

  // Submit handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await signInWithEmailPass(data.email, data.password);
      await Swal.fire({
        icon: 'success',
        title: 'Welcome back!',
        text: 'Successfully logged in',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'Invalid email or password',
        confirmButtonColor: '#6C5CE7',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } },
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Left side (image + info) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=1200)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-600/90" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl font-extrabold mb-6 tracking-tight">
              Welcome to Hall Manager
            </h1>
            <p className="text-xl mb-8 text-white/90 font-light">
              Your comprehensive residential hall management solution.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="font-semibold mb-2 text-lg">For Students</h3>
                <p className="text-sm text-white/80">
                  Access your profile, order meals, book laundry slots, and more.
                </p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="font-semibold mb-2 text-lg">For Administrators</h3>
                <p className="text-sm text-white/80">
                  Manage users, rooms, complaints, and monitor hall operations.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4 shadow-md"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Sign in to your account
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300 font-light">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {/* Demo accounts info */}
          <motion.div
            variants={itemVariants}
            className="mb-6 p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-sm"
          >
            <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">Demo Accounts</h4>
            <div className="text-sm text-indigo-800 dark:text-indigo-200 space-y-1">
              <p><strong>Student:</strong> john.doe@university.edu</p>
              <p><strong>Admin:</strong> admin@university.edu</p>
              <p><strong>Password:</strong> password123</p>
            </div>
          </motion.div>

          {/* Login form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email address
              </label>
              <motion.div
                variants={itemVariants}
                className="relative"
              >
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300"
                  placeholder="Enter your email"
                />
              </motion.div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-500 dark:text-red-400"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <motion.div
                variants={itemVariants}
                className="relative"
              >
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300"
                  placeholder="Enter your password"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </motion.div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-500 dark:text-red-400"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
            >
              {isLoading ? <LoadingSpinner size="small" /> : null}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;