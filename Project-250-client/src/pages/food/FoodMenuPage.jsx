// src/pages/MenuPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { Utensils } from 'lucide-react';

import Header from '../../components/FoodMenu/Header';
import Filters from '../../components/FoodMenu/Filters';
import MenuItemCard from '../../components/FoodMenu/MenuItemCard';
import Card from '../../components/ui/Card';
import { mockMenuItems } from '../../data/mockData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const FoodMenuPage = () => {
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedMeal, setSelectedMeal] = useState('all');
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = mockMenuItems.filter(item => {
    const matchesDay = item.day === selectedDay;
    const matchesMeal = selectedMeal === 'all' || item.mealType === selectedMeal;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDay && matchesMeal && matchesSearch;
  });

  const addToCart = (item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  const removeFromCart = (item) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[item.id] > 1) {
        newCart[item.id]--;
      } else {
        delete newCart[item.id];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((total, qty) => total + qty, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [itemId, qty]) => {
      const item = mockMenuItems.find(i => i.id === itemId);
      return total + (item ? item.price * qty : 0);
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (getTotalItems() === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Empty Cart',
        text: 'Please add items to your cart before placing an order',
        confirmButtonColor: '#6C5CE7',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Place Order',
      text: `Total: $${getTotalPrice().toFixed(2)} for ${getTotalItems()} items`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6C5CE7',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Place Order',
    });

    if (result.isConfirmed) {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCart({});
      await Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: 'Your order has been successfully placed',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Header
        getTotalItems={getTotalItems}
        getTotalPrice={getTotalPrice}
        handlePlaceOrder={handlePlaceOrder}
      />
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        selectedMeal={selectedMeal}
        setSelectedMeal={setSelectedMeal}
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        ))}
      </motion.div>

      {filteredItems.length === 0 && (
        <Card className="p-12 text-center">
          <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No items found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or search terms
          </p>
        </Card>
      )}
    </div>
  );
};

export default FoodMenuPage;