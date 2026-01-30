import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import Card from '../../components/ui/Card';
import OrderCard from '../../components/FoodMenu/OrderCard';
import { useAuth } from '../../context/AuthContext';
import OrderHeader from '../../components/FoodMenu/OrderHeader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const FoodOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let url = 'http://localhost:4000/api/orders';
        if (user.role === 'student') {
          const userId = user._id || user.id || user.uid;
          url = `http://localhost:4000/api/orders/my-orders/${userId}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch orders");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <OrderHeader />

      {orders.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {orders.map((order) => (
            <OrderCard key={order._id || order.id} order={order} />
          ))}
        </motion.div>
      ) : (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 mb-4">
            {user.role === 'food_manager' ? "No orders have been placed yet." : "Start by ordering from our delicious menu"}
          </p>
          {user.role !== 'food_manager' && (
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Browse Menu
            </button>
          )}
        </Card>
      )}
    </div>
  );
};

export default FoodOrdersPage;