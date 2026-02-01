import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Utensils, ShoppingCart, Bed, MessageSquare, AlertTriangle, WashingMachine as Washing, Building, CreditCard, Users, Shield, BarChart3, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  // console.log(user); // use it to debug

  const studentLinks = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/food/menu', icon: Utensils, label: 'Food Menu' },
    { to: '/food/orders', icon: ShoppingCart, label: 'My Orders' },
    { to: '/seat/apply', icon: Bed, label: 'Seat Application' },
    { to: '/complaints', icon: AlertTriangle, label: 'Complaints' },
    // { to: '/chat', icon: MessageSquare, label: 'Chat' },
    { to: '/laundry', icon: Washing, label: 'Laundry' },
    { to: '/rooms', icon: Building, label: 'Rooms' },
    { to: '/chat', icon: MessageSquare, label: 'Chat' }
    // { to: '/payments/wallet', icon: CreditCard, label: 'Wallet' },
  ];

  const adminLinks = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/admin/rooms', icon: Building, label: 'Manage Rooms' },
    { to: '/admin/menus', icon: Utensils, label: 'Manage Menus' },
    { to: '/admin/seat-applications', icon: Bed, label: 'Seat Applications' },
    // { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { to: '/admin/complaints', icon: AlertTriangle, label: 'Complaints' },
    { to: '/admin/register-student', icon: Shield, label: 'Register Student' }

    // { to: '/chat', icon: MessageSquare, label: 'Chat' },
  ];

  const foodManagerLinks = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/menus', icon: Utensils, label: 'Manage Menu' },
  ];

  const laundryManagerLinks = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    // { to: '/laundry/dashboard', icon: Washing, label: 'Manage Laundry' },
  ];

  let links = studentLinks;
  if (user?.role === 'admin') {
    links = adminLinks;
  } else if (user?.role === 'food_manager') {
    links = foodManagerLinks;
  } else if (user?.role === 'laundry_manager') {
    links = laundryManagerLinks;
  }

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 lg:hidden z-40 transition-opacity duration-300"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-y-0 left-0 w-64 bg-white border-r border-zinc-200 z-50
                   lg:translate-x-0 lg:static transform shadow-xl lg:shadow-none"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold  text-lg text-zinc-900">
              {user?.role === 'admin' ? "Admin Dashboard" : user?.role === 'food_manager' ? "Food Manager Dashboard" : user?.role === 'laundry_manager' ? "Laundry Manager Dashboard" : "Student Nest"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden  p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((link, index) => {
            const Icon = link.icon;
            const isActive =
              location.pathname === link.to ||
              (link.to !== "/dashboard" &&
                location.pathname.startsWith(link.to));

            return (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  to={link.to}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden font-medium ${isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 transform scale-105"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-blue-600"
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive
                        ? "text-white"
                        : "text-zinc-500 group-hover:text-blue-600"
                      }`}
                  />
                  <span className="font-medium text-sm">{link.label}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-200">
          <div className="flex items-center gap-3 px-3 py-2">
            {user?.user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-10 h-10 rounded-full object-cover border-2 border-zinc-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm flex items-center justify-center bg-gray-100">
                <span className="text-blue-600 font-bold text-lg">
                  {user.displayName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 truncate">
                {user.displayName}
              </p>
              <p className="text-xs text-zinc-500 truncate mt-0.5">
                {user.role === "admin" ? "Administrator" : user.role === "food_manager" ? "Food Manager" : user.role === "laundry_manager" ? "Laundry Manager" : `Room ${user.room ? user.room : "N/A"}`}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
