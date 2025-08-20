// src/components/ApplicationForm.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bed, FileText } from 'lucide-react';
import Card from '../ui/Card';


const applicationSchema = z.object({
  roomType: z.string().min(1, 'Please select a room type'),
  floor: z.string().min(1, 'Please select a floor'),
  block: z.string().min(1, 'Please select a block'),
  specialRequests: z.string().max(500, 'Special requests must be under 500 characters'),
});

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ApplicationForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applicationSchema),
  });

  return (
    <motion.div variants={itemVariants}>
      <Card className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bed className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Apply for a Seat
          </h2>
          <p className="text-gray-600">
            Fill out the form below to apply for accommodation in our residential hall
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type *
              </label>
              <select
                {...register('roomType')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select room type</option>
                <option value="single">Single Room</option>
                <option value="double">Double Room</option>
                <option value="triple">Triple Room</option>
              </select>
              {errors.roomType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.roomType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Floor *
              </label>
              <select
                {...register('floor')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select floor</option>
                <option value="1">1st Floor</option>
                <option value="2">2nd Floor</option>
                <option value="3">3rd Floor</option>
                <option value="4">4th Floor</option>
              </select>
              {errors.floor && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.floor.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Block *
              </label>
              <select
                {...register('block')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select block</option>
                <option value="A">Block A</option>
                <option value="B">Block B</option>
                <option value="C">Block C</option>
                <option value="D">Block D</option>
              </select>
              {errors.block && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.block.message}
                </p>
              )}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Department *
              </label>
              <input className='text-gray-900 py-2 px-6 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all' placeholder='Dept' type="text" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Your CGPA*
              </label>
              <input className='text-gray-900 py-2 px-6 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all' placeholder='CGPA' type="text" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                 Your Semester *
              </label>
              <input className='text-gray-900 py-2 px-6 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all' placeholder='Semester' type="text" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              {...register('specialRequests')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Any special accommodation requests or preferences..."
            />
            {errors.specialRequests && (
              <p className="mt-1 text-sm text-red-600">
                {errors.specialRequests.message}
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              Application Process
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your application will be reviewed within 3-5 business days</li>
              <li>• Room assignment is based on availability and preferences</li>
              <li>• You will receive email notifications about status updates</li>
              <li>• Contact support if you need to modify your application</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-8 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Submit Application
            </motion.button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default ApplicationForm;