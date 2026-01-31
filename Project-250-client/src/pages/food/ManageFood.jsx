import { useState } from "react";
import { motion } from "framer-motion";
import { ChefHat } from "lucide-react";
import Card from "../../components/ui/Card";
import { foodItems } from "../../data/foodItems";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const ManageFood = () => {
  const today = dayjs().format("dddd");

  const handleAddToMenu = async (foodItem, mealType) => {
    const itemForMenu = {
      name: foodItem.name,
      price: foodItem.basePrice,
      day: today,
      mealType: mealType,
      category: foodItem.category,
      description: foodItem.description,
      image: foodItem.image,
    };
    try {
      const res = await fetch("http://localhost:4000/api/food/menu-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemForMenu),
      });
      if (res.ok) {
        Swal.fire("Success", `Item added to ${mealType}!`, "success");
      } else {
        Swal.fire("Error", "Failed to add item", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 bg-zinc-100 p-6 rounded-3xl"
    >
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-zinc-900 flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            Food Catalog
          </h3>
          <p className="text-zinc-600 mb-6">
            Browse available food items and add them to today's menu for different meals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-zinc-200 rounded-lg overflow-hidden hover:shadow-md transition"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-zinc-900">{item.name}</h4>
                  <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
                <p className="text-zinc-600 text-sm mb-3">{item.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-indigo-600">
                    ৳{item.basePrice}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToMenu(item, "Breakfast")}
                    className="flex-1 bg-orange-500 text-white text-xs px-2 py-1 rounded hover:bg-orange-600 transition"
                  >
                    Add to Breakfast
                  </button>
                  <button
                    onClick={() => handleAddToMenu(item, "Lunch")}
                    className="flex-1 bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600 transition"
                  >
                    Add to Lunch
                  </button>
                  <button
                    onClick={() => handleAddToMenu(item, "Dinner")}
                    className="flex-1 bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Add to Dinner
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ManageFood;
