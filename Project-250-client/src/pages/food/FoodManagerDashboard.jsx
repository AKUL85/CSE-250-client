import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Utensils,
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle,
  List,
  Calendar
} from "lucide-react";
import Card from "../../components/ui/Card";
import StatTile from "../../components/ui/StatTile";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const FoodManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalMenuItems: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [todaysMenu, setTodaysMenu] = useState([]);
  const today = dayjs().format("dddd");

  const fetchTodaysMenu = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:4000/api/menu");
      if (res.ok) {
        const data = await res.json();
        setTodaysMenu(data.filter((item) => item.day === today));
      }
    } catch (err) {
      console.error("Failed to fetch menu", err);
    }
  }, [today]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/food/food-stats");
        if (res.ok) {
          const data = await res.json();
        setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch food stats", err);
      }
    };
    fetchStats();
    fetchTodaysMenu();
  }, [fetchTodaysMenu]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 bg-zinc-100 p-6 rounded-3xl"
      >
        <motion.div variants={itemVariants}>
          <div className="rounded-2xl p-8 text-white shadow-lg bg-gradient-to-br from-orange-500 to-red-600">
            <h1 className="text-3xl font-bold mb-2 drop-shadow-sm">
              Food Manager Dashboard 👨‍🍳
            </h1>
            <p className="text-white/90">
              Manage your kitchen, orders, and menu from here.
            </p>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatTile
            title="Total Menu Items"
            value={stats.totalMenuItems}
            icon={List}
            color="primary"
          />
          <StatTile
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={Clock}
            color="warning"
          />
          <StatTile
            title="Completed Orders"
            value={stats.completedOrders}
            icon={CheckCircle}
            color="success"
          />
          <StatTile
            title="Total Revenue"
            value={`৳${stats.totalRevenue}`}
            icon={DollarSign}
            color="accent"
          />
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-zinc-900">
                Menu Management
              </h3>
              <p className="text-zinc-600 mb-4">
                Update today's menu, add new items, or remove old ones.
              </p>
              <Link
                to="/admin/menus"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <Utensils className="w-4 h-4" />
                Manage Menu
              </Link>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-zinc-900">
                Order Management
              </h3>
              <p className="text-zinc-600 mb-4">
                View incoming orders and update their status.
              </p>
              <Link
                to="/foodmanager/orders"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                <ShoppingCart className="w-4 h-4" />
                View Orders
              </Link>
            </Card>
          </motion.div>
        </div>

        {/* Today's Menu */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today's Menu ({today})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Breakfast */}
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-zinc-800 border-b border-zinc-200 pb-2">
                  🍳 Breakfast
                </h4>
                {todaysMenu.filter(item => item.mealType === 'Breakfast').length > 0 ? (
                  <div className="space-y-2">
                    {todaysMenu.filter(item => item.mealType === 'Breakfast').map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100"
                      >
                        <div className="flex-1">
                          <span className="font-medium text-zinc-900">{item.name}</span>
                          {item.category && (
                            <span className="text-xs text-zinc-600 ml-2">
                              ({item.category})
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-green-600">
                          ৳{item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-sm italic">
                    No breakfast items scheduled
                  </p>
                )}
              </div>

              {/* Lunch */}
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-zinc-800 border-b border-zinc-200 pb-2">
                  🍽️ Lunch
                </h4>
                {todaysMenu.filter(item => item.mealType === 'Lunch').length > 0 ? (
                  <div className="space-y-2">
                    {todaysMenu.filter(item => item.mealType === 'Lunch').map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <div className="flex-1">
                          <span className="font-medium text-zinc-900">{item.name}</span>
                          {item.category && (
                            <span className="text-xs text-zinc-600 ml-2">
                              ({item.category})
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-green-600">
                          ৳{item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-sm italic">
                    No lunch items scheduled
                  </p>
                )}
              </div>

              {/* Dinner */}
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-zinc-800 border-b border-zinc-200 pb-2">
                  🌙 Dinner
                </h4>
                {todaysMenu.filter(item => item.mealType === 'Dinner').length > 0 ? (
                  <div className="space-y-2">
                    {todaysMenu.filter(item => item.mealType === 'Dinner').map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-100"
                      >
                        <div className="flex-1">
                          <span className="font-medium text-zinc-900">{item.name}</span>
                          {item.category && (
                            <span className="text-xs text-zinc-600 ml-2">
                              ({item.category})
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-green-600">
                          ৳{item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-sm italic">
                    No dinner items scheduled
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
};

export default FoodManagerDashboard;
