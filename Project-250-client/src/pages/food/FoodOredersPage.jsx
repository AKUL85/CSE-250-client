// src/pages/FoodOrdersPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import Card from '../../components/ui/Card';
import OrderCard from '../../components/FoodMenu/OrderCard';
import { mockOrders } from '../../data/mockData';
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
  return (
    <div className="space-y-6">
      <OrderHeader />
      
      {mockOrders.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {mockOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </motion.div>
      ) : (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start by ordering from our delicious menu
          </p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Browse Menu
          </motion.button>
        </Card>
      )}
    </div>
  );
};

export default FoodOrdersPage;