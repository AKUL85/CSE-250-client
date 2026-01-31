// src/components/MenuItemCard.jsx
import { motion } from 'framer-motion';
import { Plus, Minus, Star, AlertCircle, Clock, Utensils } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';


const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const MenuItemCard = ({ item, cart, addToCart, removeFromCart }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card hover className="overflow-hidden">
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 left-3">
            <Badge 
              variant={
                item.mealType === 'breakfast' ? 'accent' :
                item.mealType === 'lunch' ? 'secondary' : 'primary'
              }
            >
              {item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1)}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1">
              <span className="text-gray-900 font-semibold">
                ৳{item.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {item.name}
            </h3>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">4.5</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {item.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>15 min</span>
              </div>
              <div className="flex items-center gap-1">
                <Utensils className="w-4 h-4" />
                <span>{item.calories} cal</span>
              </div>
            </div>
          </div>

          {/* Allergens */}
          {/* {item.allergens.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <div className="flex gap-1">
                {item.allergens.map((allergen) => (
                  <Badge key={allergen} variant="warning" size="sm">
                    {allergen}
                  </Badge>
                ))}
              </div>
            </div>
          )} */}

          {/* Add to Cart Controls */}
          <div className="flex items-center justify-between">
            {cart[item.id] ? (
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => removeFromCart(item)}
                  className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <span className="font-medium text-gray-900">
                  {cart[item.id]}
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(item)}
                  className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(item)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add to Cart
              </motion.button>
            )}
            
            <div className="text-right">
              <p className="text-xl font-bold text-purple-600">
                ৳{item.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MenuItemCard;