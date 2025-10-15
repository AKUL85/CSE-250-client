import { motion } from 'framer-motion';
import { 
  CreditCard, AlertTriangle, ShoppingCart, Clock, 
  Thermometer, Users, TrendingUp, FileText, Wrench,
  DollarSign
} from 'lucide-react';

import { mockDashboardKPIs } from '../data/mockData';
import Card from '../components/ui/Card';
import StatTile from '../components/ui/StatTile';
import Badge from '../components/ui/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';

const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 55000 },
  { month: 'Jun', revenue: 67000 },
];

const occupancyData = [
  { day: 'Mon', occupancy: 85 },
  { day: 'Tue', occupancy: 88 },
  { day: 'Wed', occupancy: 82 },
  { day: 'Thu', occupancy: 90 },
  { day: 'Fri', occupancy: 85 },
  { day: 'Sat', occupancy: 78 },
  { day: 'Sun', occupancy: 80 },
];

const DashboardPage = () => {
  const { user } = useAuth();
  // const isStudent = user?.role === 'student';
  const isStudent =false;
  const kpis = isStudent ? mockDashboardKPIs.student : mockDashboardKPIs.admin;

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

  if (isStudent) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 bg-zinc-100 p-6 rounded-3xl"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants}>
          <div className="rounded-2xl p-8 text-white shadow-lg bg-gradient-to-br from-blue-600 to-indigo-700">
            <h1 className="text-3xl font-bold mb-2 drop-shadow-sm">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-white/90">
              Here's what's happening in your residential hall today.
            </p>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatTile
            title="Wallet Balance"
            value={`$${kpis.walletBalance}`}
            icon={CreditCard}
            color="primary"
            trend="up"
            trendValue="5.2%"
          />
          <StatTile
            title="Active Complaints"
            value={kpis.activeComplaints}
            icon={AlertTriangle}
            color={kpis.activeComplaints > 0 ? "warning" : "success"}
          />
          <StatTile
            title="Pending Orders"
            value={kpis.pendingOrders}
            icon={ShoppingCart}
            color="secondary"
          />
          <StatTile
            title="Room Temperature"
            value={`${kpis.roomTemperature}°C`}
            icon={Thermometer}
            color="accent"
          />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div variants={itemVariants} >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-zinc-900">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-zinc-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">Order Food</p>
                      <p className="text-sm text-zinc-500">Browse today's menu</p>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-zinc-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">Book Laundry</p>
                      <p className="text-sm text-zinc-500">Reserve a time slot</p>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-zinc-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">File Complaint</p>
                      <p className="text-sm text-zinc-500">Report an issue</p>
                    </div>
                  </div>
                </button>
              </div>
            </Card>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-zinc-900">Upcoming</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-zinc-900">Laundry Slot</p>
                    <p className="text-sm text-zinc-500">
                      {dayjs(kpis.nextLaundrySlot).format('h:mm A')} - Machine M001
                    </p>
                  </div>
                  <Badge variant="primary" size="sm">In 2h</Badge>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-zinc-900">Dinner Service</p>
                    <p className="text-sm text-zinc-500">Dining Hall - Today 6:00 PM</p>
                  </div>
                  <Badge variant="secondary" size="sm">Today</Badge>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-zinc-900">Room Cleaning</p>
                    <p className="text-sm text-zinc-500">Scheduled for tomorrow 10:00 AM</p>
                  </div>
                  <Badge variant="warning" size="sm">Tomorrow</Badge>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-zinc-900">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900">
                      Wallet topped up
                    </p>
                    <p className="text-xs text-zinc-500">+100.00 taka via bKash</p>
                    <p className="text-xs text-zinc-400">3 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900">
                      Food order placed
                    </p>
                    <p className="text-xs text-zinc-500">Beef Stir Fry - 95 taka</p>
                    <p className="text-xs text-zinc-400">30 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900">
                      Complaint resolved
                    </p>
                    <p className="text-xs text-zinc-500">Leaking Faucet</p>
                    <p className="text-xs text-zinc-400">1 day ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    );
  }
  // Admin Dashboard
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 bg-zinc-100 p-6 rounded-3xl" // Overall background color for a clean look
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <div className="rounded-2xl p-8 text-white shadow-lg bg-gradient-to-br from-blue-400 to-indigo-400"> {/* Eye-catching gradient */}
          <h1 className="text-3xl font-bold mb-2 drop-shadow-sm">
            Admin Dashboard 👨‍💼
          </h1>
          <p className="text-white/90">
            Monitor and manage your residential hall operations from here.
          </p>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatTile
          title="Total Students"
          value={kpis.totalStudents}
          icon={Users}
          color="primary"
          trend="up"
          trendValue="12 new"
        />
        <StatTile
          title="Occupancy Rate"
          value={`${kpis.occupancyRate}%`}
          icon={TrendingUp}
          color="secondary"
          trend="up"
          trendValue="2.3%"
        />
        <StatTile
          title="Monthly Cost"
          value={`$${kpis.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="accent"
          trend="up"
          trendValue="8.1%"
        />
        <StatTile
          title="Active Complaints"
          value={kpis.activeComplaints}
          icon={AlertTriangle}
          color={kpis.activeComplaints > 5 ? "warning" : "success"}
          trend="down"
          trendValue="3 resolved"
        />
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900">Monthly Cost</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="text-zinc-300" />
                <XAxis dataKey="month" className="text-sm text-zinc-600" />
                <YAxis className="text-sm text-zinc-600" />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB" // A clean blue
                  strokeWidth={3}
                  dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900">Weekly Occupancy</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" className="text-zinc-300" />
                <XAxis dataKey="day" className="text-sm text-zinc-600" />
                <YAxis className="text-sm text-zinc-600" />
                <Bar
                  dataKey="occupancy"
                  fill="#00C2A8" // A vibrant teal
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Additional Admin Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900">Pending Applications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">Seat Applications</span>
                <Badge variant="warning">{kpis.pendingApplications}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">Room Changes</span>
                <Badge variant="primary">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">Guest Requests</span>
                <Badge variant="secondary">7</Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900">Maintenance Requests</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">Plumbing</span>
                <Badge variant="error">2</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">Electrical</span>
                <Badge variant="warning">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">General</span>
                <Badge variant="secondary">1</Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-zinc-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-zinc-800">Manage Users</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-zinc-100 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-zinc-800">View Reports</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-zinc-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Wrench className="w-4 h-4 text-rose-600" />
                  <span className="text-sm font-medium text-zinc-800">System Settings</span>
                </div>
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;