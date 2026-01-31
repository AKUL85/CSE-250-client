// src/components/Header.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import Swal from 'sweetalert2';

const Header = ({ getTotalItems, getTotalPrice, handlePlaceOrder }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Food Menu
        </h1>
        <p className="text-gray-600">
          Browse and order from today's delicious menu
        </p>
      </div>

      {getTotalItems() > 0 && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handlePlaceOrder}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-lg"
        >
          <ShoppingCart className="w-5 h-5" />
          Order Now ({getTotalItems()}) - ৳{getTotalPrice().toFixed(2)}
        </motion.button>
      )}
    </div>
  );
};

export default Header;