import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Home, Shield, Save, ArrowLeft, Image, Fingerprint } from 'lucide-react';
import Swal from 'sweetalert2';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '', 
    email: '',
    phone: '',
    studentId: '',
    role: '',
    room: '',
    status: '',
    avatar: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:4000/users/${id}`);
        if (!res.ok) throw new Error('User not found');
        const data = await res.json();
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          studentId: data.studentId || '',
          role: data.role || 'student',
          room: data.room || '',
          status: data.status || 'active',
          avatar: data.avatar || ''
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        Swal.fire('Error', 'Failed to fetch user data', 'error');
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:4000/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User updated successfully',
          timer: 1500,
          showConfirmButton: false
        });
        navigate(`/admin/users/${id}`);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to update user', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><LoadingSpinner size="large" /></div>;

  const inputClass = "w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2 ml-1";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        <button 
          onClick={() => navigate(`/admin/users/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Cancel & Go Back</span>
        </button>

        <Card className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-100 rounded-2xl">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit User Profile</h1>
              <p className="text-gray-500">Update account details for {formData.name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1">
                <label className={labelClass}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Enter email"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className={labelClass}>Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Student ID */}
              <div className="space-y-1">
                <label className={labelClass}>Student ID / Staff ID</label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. ST-1234"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className={labelClass}>Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className={labelClass}>Account Status</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="waiting">Waiting</option>
                  </select>
                </div>
              </div>

              {/* Room Number */}
              <div className="space-y-1">
                <label className={labelClass}>Room Number</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. A-201"
                  />
                </div>
              </div>

              {/* Avatar URL */}
              <div className="space-y-1">
                <label className={labelClass}>Avatar URL</label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                {saving ? <LoadingSpinner size="small" /> : <Save className="w-5 h-5" />}
                {saving ? 'Saving changes...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/admin/users/${id}`)}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserEditPage;
