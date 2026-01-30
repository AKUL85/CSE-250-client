// src/pages/MenuPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { Utensils } from 'lucide-react';

import Header from '../../components/FoodMenu/Header';
import Filters from '../../components/FoodMenu/Filters';
import MenuItemCard from '../../components/FoodMenu/MenuItemCard';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

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
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Monday'); // Changed default to Capitalized to match backend/mock usually
  const [selectedMeal, setSelectedMeal] = useState('all');
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/menu');
        if (res.ok) {
          const data = await res.json();
          setMenuItems(data);
          // If backend returns empty, we might want to keep loading state handled
        }
      } catch (e) {
        console.error("Failed to fetch menu", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = menuItems.filter(item => {
    // Backend uses capitalized days "Monday", mock used "monday".
    // Let's handle case insensitivity
    const itemDay = item.day ? item.day.toLowerCase() : '';
    const currentDay = selectedDay.toLowerCase();

    const matchesDay = itemDay === currentDay;
    const matchesMeal = selectedMeal === 'all' || (item.mealType && item.mealType.toLowerCase() === selectedMeal.toLowerCase());
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDay && matchesMeal && matchesSearch;
  });

  const addToCart = (item) => {
    const id = item._id || item.id;
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const removeFromCart = (item) => {
    const id = item._id || item.id;
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id]--;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((total, qty) => total + qty, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [itemId, qty]) => {
      const item = menuItems.find(i => (i._id || i.id) === itemId);
      return total + (item ? parseFloat(item.price) * qty : 0);
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
      text: `Total: ৳${getTotalPrice().toFixed(2)} for ${getTotalItems()} items`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6C5CE7',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Place Order',
    });

    if (result.isConfirmed) {
      try {
        const items = Object.entries(cart).map(([itemId, qty]) => {
          const item = menuItems.find(i => (i._id || i.id) === itemId);
          return {
            menuItemId: itemId,
            qty,
            price: parseFloat(item.price),
            name: item.name
          };
        });

        const total = getTotalPrice();

        const response = await fetch('http://localhost:4000/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?._id || user?.uid || "guest",
            items,
            total
          })
        });

        if (response.ok) {
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
        } else {
          throw new Error("Failed to place order");
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Order Failed',
          text: 'Could not place order. Please try again.',
        });
      }
    }
  };

  if (loading) return <div className="p-12 text-center">Loading menu...</div>;

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
            key={item._id || item.id}
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
            No items found for {selectedDay}
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or search terms, or ask the Food Manager to update the menu!
          </p>
        </Card>
      )}
    </div>
  );
};

export default FoodMenuPage;