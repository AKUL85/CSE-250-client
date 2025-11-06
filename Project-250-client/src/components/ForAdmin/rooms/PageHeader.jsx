import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const PageHeader = ({ onAddRoom }) => {
  const [showForm, setShowForm] = useState(false);
  const [newRoom, setNewRoom] = useState({
    number: "",
    type: "single",
    capacity: "",
    floor: "",
    block: "",
    rent: "",
    status: "available",
  });
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/rooms/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add room");
      }
      const createdRoom = await res.json();
      // Optionally call parent to update table immediately
      if (onAddRoom) onAddRoom(createdRoom);

      // Reset form
      setNewRoom({
        number: "",
        type: "single",
        capacity: "",
        floor: "",
        block: "",
        rent: "",
        status: "available",
      });

      setShowForm(false);
    } catch (err) {
      console.error("Error adding room:", err);
      alert(err.message || "Failed to add room");
    }
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600">
            Manage room inventory, assignments, and maintenance
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Room
        </motion.button>
      </div>

      {showForm && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Add New Room
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {/* Room Number */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Room Number *
              </label>
              <input
                type="text"
                name="number"
                placeholder="e.g., 101"
                value={newRoom.number}
                onChange={handleChange}
                required
                className="border h-[45px] border-gray-300 p-3 rounded-lg w-full text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Room Type */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Room Type *
              </label>
              <select
                name="type"
                value={newRoom.type}
                onChange={handleChange}
                className="border h-[45px] border-gray-300 p-3 rounded-lg w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="triple">Triple</option>
                <option value="quadra">Quadra</option>
              </select>
            </div>

            {/* Capacity */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                placeholder="e.g., 2"
                value={newRoom.capacity}
                onChange={handleChange}
                className="border h-[45px] border-gray-300 p-3 rounded-lg w-full text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Block */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Block *
              </label>
              <select
                name="block"
                value={newRoom.block}
                onChange={handleChange}
                className="border h-[45px] border-gray-300 p-3 rounded-lg w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Block</option>
                <option value="A">Block A</option>
                <option value="B">Block B</option>
                <option value="C">Block C</option>
                <option value="D">Block D</option>
              </select>
            </div>

            {/* Floor */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Floor *
              </label>
              <input
                type="number"
                name="floor"
                placeholder="e.g., 1"
                value={newRoom.floor}
                onChange={handleChange}
                className="border h-[45px] border-gray-300 p-3 rounded-lg w-full text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Rent */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Rent ($) *
              </label>
              <input
                type="number"
                name="rent"
                placeholder="e.g., 500"
                value={newRoom.rent}
                onChange={handleChange}
                className="border h-[45px] border-gray-300 p-3 rounded-lg w-full text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                name="status"
                value={newRoom.status}
                onChange={handleChange}
                className="border h-[45px] border-gray-300 p-3 rounded-lg w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col justify-end">
              <button
                type="submit"
                className="h-[45px] flex center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium"
              >
                Save Room
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
