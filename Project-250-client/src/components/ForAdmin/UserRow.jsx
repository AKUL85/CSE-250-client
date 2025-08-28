import { motion } from 'framer-motion';
import { Eye, Edit3, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge';


const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const getRoleColor = (role) => {
  switch (role) {
    case 'admin': return 'error';
    case 'student': return 'primary';
    case 'staff': return 'secondary';
    default: return 'default';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'success';
    case 'inactive': return 'error';
    case 'waiting': return 'warning';
    default: return 'default';
  }
};

const UserRow = ({ user, onDeleteUser }) => (
  <motion.tr variants={itemVariants} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
          {user.studentId && (
            <div className="text-xs text-gray-400 dark:text-gray-500">ID: {user.studentId}</div>
          )}
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <Badge variant={getRoleColor(user.role)}>{user.role}</Badge>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <Badge variant={getStatusColor(user.status)}>{user.status}</Badge>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
      {user.room ? `${user.room} - ${user.seat}` : 'N/A'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
      {new Date(user.createdAt).toLocaleDateString()}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="flex items-center justify-end gap-2">
        <motion.button whileTap={{ scale: 0.95 }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
          <Eye className="w-4 h-4" />
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
          <Edit3 className="w-4 h-4" />
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => onDeleteUser(user)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </td>
  </motion.tr>
);

export default UserRow;
