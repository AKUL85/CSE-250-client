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

// --- Initial Mock Data ---
const initialMenuData = [
  {
    id: "m1",
    day: "Monday",
    meal: "Breakfast",
    name: "Omelette & Toast",
    price: 45,
    description: "Two eggs with buttered toast and jam.",
    imageUrl: "https://placehold.co/600x400/FACC15/4A5568?text=Omelette",
  },
  {
    id: "m2",
    day: "Monday",
    meal: "Lunch",
    name: "Chicken Curry",
    price: 110,
    description: "Spicy chicken curry with rice.",
    imageUrl: "https://placehold.co/600x400/F87171/4A5568?text=Chicken+Curry",
  },
  {
    id: "m3",
    day: "Monday",
    meal: "Dinner",
    name: "Vegetable Khichuri",
    price: 90,
    description: "Mixed vegetables and lentils with rice.",
    imageUrl: "https://placehold.co/600x400/86EFAC/4A5568?text=Khichuri",
  },
  {
    id: "m4",
    day: "Friday",
    meal: "Lunch",
    name: "Maser Jhol (Fish Curry)",
    price: 120,
    description: "Traditional Bengali fish curry with seasonal vegetables.",
    imageUrl: "https://placehold.co/600x400/60A5FA/4A5568?text=Maser+Jhol",
  },
  {
    id: "m5",
    day: "Friday",
    meal: "Dinner",
    name: "Beef Bhuna",
    price: 150,
    description: "Spicy thick beef curry with paratha.",
    imageUrl: "https://placehold.co/600x400/FCA5A5/4A5568?text=Beef+Bhuna",
  },
];

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
const emptyFormState = {
  name: "",
  price: "",
  meal: "Breakfast",
  description: "",
  imageUrl: "",
};

// --- Main App Component ---
export default function MannageFood() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [menuItems, setMenuItems] = useState(initialMenuData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // null for 'Add', object for 'Edit'
  const [formData, setFormData] = useState(emptyFormState);

  // Filtered meals based on selected day
  const filteredMeals = useMemo(() => {
    const itemsOnDay = menuItems.filter((item) => item.day === selectedDay);
    return {
      Breakfast: itemsOnDay.filter((item) => item.meal === "Breakfast"),
      Lunch: itemsOnDay.filter((item) => item.meal === "Lunch"),
      Dinner: itemsOnDay.filter((item) => item.meal === "Dinner"),
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
        meal: item.meal,
        description: item.description,
        imageUrl: item.imageUrl,
      });
    } else {
      // Add mode
      setCurrentItem(null);
      setFormData(emptyFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    setFormData(emptyFormState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, price, meal, description, imageUrl } = formData;

    if (!name || !price || !meal) {
      // Simple validation
      // In a real app, you'd show an error message
      console.error("Missing required fields");
      return;
    }

    if (currentItem) {
      // Update existing item
      setMenuItems(
        menuItems.map((item) =>
          item.id === currentItem.id
            ? {
                ...item,
                name,
                price: parseFloat(price),
                meal,
                description,
                imageUrl,
              }
            : item
        )
      );
    } else {
      // Add new item
      const newItem = {
        id: crypto.randomUUID(),
        day: selectedDay,
        name,
        price: parseFloat(price),
        meal,
        description,
        imageUrl:
          imageUrl ||
          `https://placehold.co/600x400/E2E8F0/4A5568?text=${encodeURIComponent(
            name
          )}`,
      };
      setMenuItems([...menuItems, newItem]);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    // No window.confirm as per guidelines
    // In a real app, you'd use a custom confirmation modal
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

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
              key={item.id}
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
        src={item.imageUrl}
        alt={item.name}
        className="w-full h-40 object-cover"
        onError={(e) => {
          e.target.src =
            "https://placehold.co/600x400/E2E8F0/4A5568?text=Image+Error";
        }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
          <span className="text-lg font-semibold text-indigo-600">
            ৳{item.price}
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1 mb-4">{item.description}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
            aria-label="Edit item"
          >
            <IconEdit />
          </button>
          <button
            onClick={() => onDelete(item.id)}
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
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal on content click
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
              Item Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Price (৳)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={onChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="meal"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Meal
              </label>
              <select
                id="meal"
                name="meal"
                value={formData.meal}
                onChange={onChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {MEALS.map((meal) => (
                  <option key={meal} value={meal}>
                    {meal}
                  </option>
                ))}
              </select>
            </div>
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
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Image URL (Optional)
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={onChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
              {isEditing ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
