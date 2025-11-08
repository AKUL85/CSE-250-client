// src/components/ProfileCard.jsx
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Shield } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';


const ProfileCard = ({ user, isEditing, register, errors, itemVariants }) => {
  return (
    <motion.div variants={itemVariants} className="lg:col-span-2">
      <Card className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={
                  user?.photoURL ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={user?.displayName}
                className="w-32 h-32 rounded-2xl object-cover shadow-lg border-2 border-zinc-200"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
            <Badge
              variant={user?.status === "active" ? "success" : "warning"}
              className="mt-4"
            >
              {user?.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      {...register("name")}
                      className="w-full px-4 py-3 border border-zinc-300 rounded-xl bg-white text-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-zinc-900 font-medium">{user?.displayName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-zinc-400" />
                  <p className="text-zinc-900">{user?.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <div>
                    <input
                      {...register("phone")}
                      className="w-full px-4 py-3 border border-zinc-300 rounded-xl bg-white text-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-zinc-400" />
                    <p className="text-zinc-900">{user?.phoneNumber ? user?.phoneNumber : "N/A"}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Student ID
                </label>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-zinc-400" />
                  <p className="text-zinc-900 font-mono">{user?.studentId}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Room & Seat
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <p className="text-zinc-900">
                    {user?.room} - Seat {user?.seat}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Emergency Contact
                </label>
                {isEditing ? (
                  <div>
                    <input
                      {...register("emergencyContact")}
                      className="w-full px-4 py-3 border border-zinc-300 rounded-xl bg-white text-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    {errors.emergencyContact && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.emergencyContact.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-zinc-400" />
                    <p className="text-zinc-900">{user?.emergencyContact}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProfileCard;