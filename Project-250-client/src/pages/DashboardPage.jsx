
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

import {
  AlertTriangle,
  ShoppingCart,
  Clock,
  Thermometer,
  Users,
  TrendingUp,
  FileText,
  Wrench,
  DollarSign,
  CreditCard,
  RefreshCw,
  PlusCircle
} from 'lucide-react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip
} from 'recharts';

import dayjs from 'dayjs';

import { mockDashboardKPIs } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

import Card from '../components/ui/Card';
import StatTile from '../components/ui/StatTile';
import Badge from '../components/ui/Badge';

import FoodManagerDashboard from './food/FoodManagerDashboard';
import LaundryManagerDashboard from './admin/LaundryManagerDashboard';


const DashboardPage = () => {
  const { user } = useAuth();

  // State for Admin Dashboard
  const [stats, setStats] = useState({
    totalStudents: 0,
    occupancyRate: 0,
    monthlyRevenue: 0, // This now represents Monthly Cost
    activeComplaints: 0
  });
  const [revenueData, setRevenueData] = useState([]); // This now holds Cost Data
  const [occupancyData, setOccupancyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State for Add Cost Form
  const [showCostForm, setShowCostForm] = useState(false);
  const [costForm, setCostForm] = useState({
    month: dayjs().format('MMM'),
    year: new Date().getFullYear(),
    cost: ''
  });

  const kpis = user.role === "student" ? mockDashboardKPIs.student : mockDashboardKPIs.admin;

  useEffect(() => {
    if (user.role === 'admin') {
      fetchData();
      fetchRevenueData(selectedYear);
      fetchOccupancyData();
    }
  }, [user.role]);

  // Effect to refetch revenue (cost) when year changes
  useEffect(() => {
    if (user.role === 'admin') {
      fetchRevenueData(selectedYear);
    }
  }, [selectedYear]);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/stats/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueData = async (year) => {
    try {
      const res = await fetch(`http://localhost:4000/api/stats/cost-history?year=${year}`);
      if (res.ok) {
        const data = await res.json();
        setRevenueData(data);
      }
    } catch (error) {
      console.error("Failed to fetch cost history", error);
    }
  };

  const fetchOccupancyData = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/stats/occupancy-history`);
      if (res.ok) {
        const data = await res.json();
        setOccupancyData(data);
      }
    } catch (error) {
      console.error("Failed to fetch occupancy history", error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchData(), fetchRevenueData(selectedYear), fetchOccupancyData()]);
    setIsRefreshing(false);
  };

  const handleCostSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/stats/monthly-cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(costForm)
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Cost Updated',
          text: `Monthly cost for ${costForm.month} ${costForm.year} updated successfully!`,
          timer: 2000,
          showConfirmButton: false
        });
        setShowCostForm(false);
        setCostForm({ ...costForm, cost: '' }); // Reset cost but keep month/year
        fetchData(); // Update KPI
        fetchRevenueData(selectedYear); // Update Chart
      } else {
        throw new Error('Failed to update cost');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to update monthly cost', 'error');
    }
  };

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

  if (user.role === 'food_manager') {
    return <FoodManagerDashboard user={user} />;
  }

  if (user.role === 'laundry_manager') {
    return <LaundryManagerDashboard user={user} />;
  }

  if (user.role === "student") {
    // Keep Student Dashboard essentially as is (using mock kpis for now or refactor later)
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
              Welcome back, {user.displayName}! 👋
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
                      <Link to="/food/menu">
                        <p className="font-medium text-zinc-900">Order Food</p>
                        <p className="text-sm text-zinc-500">Browse today's menu</p></Link>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-zinc-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <Link to="/laundry">
                        <p className="font-medium text-zinc-900">Book Laundry</p>
                        <p className="text-sm text-zinc-500">Reserve a time slot</p>
                      </Link>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-zinc-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <Link to="/complaints">
                        <p className="font-medium text-zinc-900">File Complaint</p>
                        <p className="text-sm text-zinc-500">Report an issue</p>
                      </Link>
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
      className="space-y-6 bg-zinc-100 p-6 rounded-3xl"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col md:flex-row justify-between items-center rounded-2xl p-8 text-white shadow-lg bg-gradient-to-br from-blue-400 to-indigo-400 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 drop-shadow-sm">
              Admin Dashboard 👨‍💼
            </h1>
            <p className="text-white/90">
              Monitor and manage your residential hall operations from here.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className={`flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 transition-all ${isRefreshing ? 'animate-pulse' : ''}`}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatTile
          title="Total Students"
          value={loading ? '...' : stats.totalStudents}
          icon={Users}
          color="primary"
        // trend="up" // Dynamic trend could be added later
        // trendValue="12 new"
        />
        <StatTile
          title="Occupancy Rate"
          value={loading ? '...' : `${stats.occupancyRate}%`}
          icon={TrendingUp}
          color="secondary"
        // trend="up"
        // trendValue="2.3%"
        />
        <StatTile
          title="Monthly Cost" // Updated Title
          value={loading ? '...' : `৳${stats.monthlyRevenue.toLocaleString()}`} // Using same field name from backend
          icon={DollarSign}
          color="accent"
        // trend="up"
        // trendValue="8.1%"
        />
        <StatTile
          title="Active Complaints"
          value={loading ? '...' : stats.activeComplaints}
          icon={AlertTriangle}
          color={stats.activeComplaints > 5 ? "warning" : "success"}
        // trend="down"
        />
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h3 className="text-lg font-semibold text-zinc-900">Monthly Operational Cost</h3>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowCostForm(!showCostForm)}
                  className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition"
                >
                  <PlusCircle className="w-4 h-4" /> Add Cost
                </button>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="p-1 border rounded-md text-sm text-zinc-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {[2023, 2024, 2025, 2026].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Add Cost Form Inline */}
            {showCostForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <form onSubmit={handleCostSubmit} className="flex flex-col gap-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 block mb-1">Month</label>
                      <select
                        required
                        value={costForm.month}
                        onChange={(e) => setCostForm({ ...costForm, month: e.target.value })}
                        className="w-full text-zinc-900 p-2 border rounded-md text-sm bg-white"
                      >
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 block mb-1">Year</label>
                      <input
                        type="number"
                        required
                        value={costForm.year}
                        onChange={(e) => setCostForm({ ...costForm, year: parseInt(e.target.value) })}
                        className="w-full text-zinc-900 p-2 border rounded-md text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 block mb-1">Amount (৳)</label>
                      <input
                        type="number"
                        required
                        placeholder="0.00"
                        value={costForm.cost}
                        onChange={(e) => setCostForm({ ...costForm, cost: e.target.value })}
                        className="w-full text-zinc-900 p-2 border rounded-md text-sm bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCostForm(false)}
                      className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700"
                    >
                      Save Cost
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="h-[300px] w-full">
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="text-zinc-300" />
                    <XAxis dataKey="month" className="text-sm text-zinc-600" />
                    <YAxis className="text-sm text-zinc-600" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      formatter={(value) => [`৳${value}`, 'Cost']}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#EF4444" // Red for Cost
                      strokeWidth={3}
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No cost data for selected year
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900">Yearly Occupancy (Students)</h3>
            <div className="h-[300px] w-full">
              {occupancyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" className="text-zinc-300" />
                    <XAxis dataKey="year" className="text-sm text-zinc-600" />
                    <YAxis className="text-sm text-zinc-600" />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Bar
                      dataKey="occupancy"
                      fill="#00C2A8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No occupancy history found
                </div>
              )}
            </div>
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
                <Badge variant="warning">{loading ? '...' : (kpis.pendingApplications || 0)}</Badge>
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