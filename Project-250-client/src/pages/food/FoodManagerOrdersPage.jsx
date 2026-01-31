import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

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

const FoodManagerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = dayjs().format('YYYY-MM-DD');

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/orders');
      if (res.ok) {
        const data = await res.json();
        // Filter today's orders
        const todaysOrders = data.filter(order => 
          dayjs(order.createdAt).format('YYYY-MM-DD') === today
        );
        setOrders(todaysOrders);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmDelivery = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'delivered' }),
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Confirmed!',
          text: 'Order marked as delivered',
          timer: 1500,
          showConfirmButton: false,
        });
        fetchOrders(); // Refresh list
      } else {
        Swal.fire('Error', 'Failed to update order', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Today's Orders</h1>
          <p className="text-zinc-600">Managing orders for {dayjs().format('MMMM D, YYYY')}</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-zinc-200 shadow-sm">
          <span className="text-zinc-600 text-sm">Total Orders: </span>
          <span className="font-bold text-indigo-600">{orders.length}</span>
        </div>
      </div>

      {orders.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4"
        >
          {orders.map((order) => (
            <motion.div key={order._id} variants={itemVariants}>
              <Card className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded uppercase">
                        Order #{order._id.slice(-6)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                        order.status === 'delivered' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-zinc-500 text-sm">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {dayjs(order.createdAt).format('hh:mm A')}
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold text-zinc-900 mb-1">Items:</h4>
                      <ul className="list-disc list-inside text-zinc-700 text-sm">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} x {item.qty} (৳{item.price * item.qty})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <div className="text-right">
                      <p className="text-zinc-500 text-sm">Total Amount</p>
                      <p className="text-2xl font-bold text-indigo-600">৳{order.total}</p>
                    </div>
                    
                    {order.status !== 'delivered' && (
                      <button
                        onClick={() => handleConfirmDelivery(order._id)}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-emerald-700 transition shadow-lg mt-4 md:mt-0"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirm Delivery
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders today
          </h3>
          <p className="text-gray-600">
            When students place orders, they will appear here.
          </p>
        </Card>
      )}
    </div>
  );
};

export default FoodManagerOrdersPage;
