import { useState, useMemo, useEffect } from "react";

const IconEdit = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const IconDelete = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const IconPlus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const IconClose = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-500 hover:text-gray-800 transition-colors"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Remove initial mock data since we'll fetch from backend
const DAYS_OF_WEEK = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];
const MEALS = ["Breakfast", "Lunch", "Dinner"];
const CATEGORIES = ["Main Course", "Appetizer", "Dessert", "Beverage", "Side Dish"];

const emptyFormState = {
  name: "",
  price: "",
  mealType: "Breakfast",
  category: "Main Course",
  allergens: "",
  calories: "",
  description: "",
  image: "",
};

// --- Main App Component ---
export default function MannageFood() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [menuItems, setMenuItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState(emptyFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch menu items from backend
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:4000/api/menu');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      } else {
        throw new Error('Failed to fetch menu items');
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load menu items',
          confirmButtonColor: '#4f46e5'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered meals based on selected day
  const filteredMeals = useMemo(() => {
    const itemsOnDay = menuItems.filter((item) => item.day === selectedDay);
    return {
      Breakfast: itemsOnDay.filter((item) => item.mealType === "Breakfast"),
      Lunch: itemsOnDay.filter((item) => item.mealType === "Lunch"),
      Dinner: itemsOnDay.filter((item) => item.mealType === "Dinner"),
    };
  }, [menuItems, selectedDay]);

  // --- Event Handlers ---

  const handleOpenModal = (item = null) => {
    if (item) {
      // Edit mode
      setCurrentItem(item);
      setFormData({
        name: item.name,
        price: item.price.toString(),
        mealType: item.mealType,
        category: item.category,
        allergens: item.allergens,
        calories: item.calories ? item.calories.toString() : "",
        description: item.description,
        image: item.image,
      });
    } else {
      // Add mode
      setCurrentItem(null);
      setFormData({
        ...emptyFormState,
        mealType: "Breakfast",
        category: "Main Course"
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    setFormData(emptyFormState);
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, mealType, category, allergens, calories, description, image } = formData;

    if (!name || !price || !mealType || !category) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'error',
          title: 'Missing Fields',
          text: 'Please fill in all required fields',
          confirmButtonColor: '#4f46e5'
        });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const menuItemData = {
        day: selectedDay,
        name,
        price: parseFloat(price),
        mealType,
        category,
        allergens: allergens || "None",
        calories: calories ? parseInt(calories) : 0,
        description,
        image: image || `https://placehold.co/600x400/E2E8F0/4A5568?text=${encodeURIComponent(name)}`,
      };

      if (currentItem) {
        // Update existing item - use _id from MongoDB
        const response = await fetch(`http://localhost:4000/api/menu/${currentItem._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(menuItemData),
        });

        if (response.ok) {
          const updatedItem = await response.json();
          setMenuItems(
            menuItems.map((item) =>
              item._id === currentItem._id
                ? { ...updatedItem.menuItem }
                : item
            )
          );
          
          if (typeof Swal !== 'undefined') {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Menu item updated successfully',
              confirmButtonColor: '#4f46e5'
            });
          }
        } else {
          throw new Error('Failed to update menu item');
        }
      } else {
        // Add new item
        const response = await fetch('http://localhost:4000/api/menu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(menuItemData),
        });

        if (response.ok) {
          const newItemData = await response.json();
          setMenuItems([...menuItems, newItemData.menuItem]);
          
          if (typeof Swal !== 'undefined') {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Menu item added successfully',
              confirmButtonColor: '#4f46e5'
            });
          }
        } else {
          throw new Error('Failed to add menu item');
        }
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving menu item:', error);
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to save menu item. Please try again.',
          confirmButtonColor: '#4f46e5'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (typeof Swal !== 'undefined') {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:4000/api/menu/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            setMenuItems(menuItems.filter((item) => item._id !== id));
            Swal.fire({
              title: 'Deleted!',
              text: 'Menu item has been deleted.',
              icon: 'success',
              confirmButtonColor: '#4f46e5'
            });
          } else {
            throw new Error('Failed to delete menu item');
          }
        } catch (error) {
          console.error('Error deleting menu item:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete menu item. Please try again.',
            confirmButtonColor: '#4f46e5'
          });
        }
      }
    } else {
      // Fallback if SweetAlert is not available
      if (window.confirm('Are you sure you want to delete this menu item?')) {
        setMenuItems(menuItems.filter((item) => item._id !== id));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-100 min-h-screen font-inter p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen font-inter p-4 md:p-8 relative">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Hall Menu Management
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
        >
          <IconPlus />
          Add Menu Item
        </button>
      </header>

      {/* Day Selector */}
      <nav className="mb-8">
        <div className="flex flex-wrap gap-2 p-2 bg-white rounded-lg shadow-sm">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[100px] py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                selectedDay === day
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </nav>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MEALS.map((meal) => (
          <MealColumn
            key={meal}
            title={meal}
            items={filteredMeals[meal]}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Modal */}
      <MenuModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleInputChange}
        isEditing={!!currentItem}
        selectedDay={selectedDay}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

// --- Sub-Components ---

function MealColumn({ title, items, onEdit, onDelete }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b-2 border-indigo-200 pb-2">
        {title}
      </h2>
      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((item, index) => (
            <MenuItemCard
              key={item._id || item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))
        ) : (
          <p className="text-slate-500 italic text-center py-4">
            No items for {title}.
          </p>
        )}
      </div>
    </div>
  );
}

function MenuItemCard({ item, onEdit, onDelete, style }) {
  return (
    <div
      className="bg-slate-50 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 opacity-0 animate-fade-in"
      style={style}
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-40 object-cover"
        onError={(e) => {
          e.target.src =
            "https://placehold.co/600x400/E2E8F0/4A5568?text=Image+Error";
        }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
          <span className="text-lg font-semibold text-indigo-600">
            ৳{item.price}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-2">
          <div>
            <span className="font-medium">Category:</span> {item.category}
          </div>
          <div>
            <span className="font-medium">Calories:</span> {item.calories || 'N/A'}
          </div>
        </div>
        
        <div className="mb-2">
          <span className="text-xs font-medium text-slate-600">Allergens:</span>
          <span className="text-xs text-slate-600 ml-1">{item.allergens}</span>
        </div>
        
        <p className="text-sm text-slate-600 mb-4">{item.description}</p>
        
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
            aria-label="Edit item"
          >
            <IconEdit />
          </button>
          <button
            onClick={() => onDelete(item._id || item.id)}
            className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
            aria-label="Delete item"
          >
            <IconDelete />
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  isEditing,
  selectedDay,
  isSubmitting,
}) {
  // Add CSS for modal animations
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes modal-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes modal-scale-in {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .animate-modal-bg {
        animation: modal-fade-in 0.3s ease-out forwards;
      }
      .animate-modal-content {
        animation: modal-scale-in 0.3s ease-out forwards;
      }
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fade-in 0.5s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-modal-bg"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative animate-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1"
          aria-label="Close modal"
        >
          <IconClose />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-1">
          {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {isEditing
            ? "Update the details below."
            : `Adding for: ${selectedDay}`}
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Item Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              className="w-full px-3 py-2 text-gray-600 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Price (৳) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={onChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 text-gray-600 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="calories"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Calories
              </label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={formData.calories}
                onChange={onChange}
                min="0"
                className="w-full px-3 text-gray-600 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="mealType"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Meal Type *
              </label>
              <select
                id="mealType"
                name="mealType"
                value={formData.mealType}
                onChange={onChange}
                required
                className="w-full px-3 text-gray-600 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {MEALS.map((meal) => (
                  <option key={meal} value={meal}>
                    {meal}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={onChange}
                required
                className="w-full px-3 text-gray-600 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="allergens"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Allergens
            </label>
            <input
              type="text"
              id="allergens"
              name="allergens"
              value={formData.allergens}
              onChange={onChange}
              placeholder="e.g., Nuts, Dairy, Gluten"
              className="w-full px-3 text-gray-600 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onChange}
              rows="3"
              className="w-full text-gray-600 px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Image URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={onChange}
              placeholder="https://example.com/image.jpg"
              className="w-full text-gray-600 px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="py-2 px-4 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isEditing ? "Saving..." : "Adding..."}
                </>
              ) : (
                isEditing ? "Save Changes" : "Add Item"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}