const express = require("express");
const multer = require("multer");
const router = express.Router();

let roomsCollection;

const storage = multer.memoryStorage();
const upload = multer({ storage });

const setRoomsCollection = ({ roomsCollection: cc }) => {
  roomsCollection = cc;
};

// ROOMS API

// ✅ Get all rooms
router.get("/rooms/all", async (req, res) => {
  try {
    const rooms = await roomsCollection.find().toArray();
    console.log("collected room data");
    res.status(200).json(rooms);
  } catch (error) {
    console.error("❌ Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// ✅ Add new room
router.post("/rooms/add", async (req, res) => {
  try {
    const { number, type, capacity, floor, block, rent, status } = req.body;

    if (!number || !type || !capacity || !floor || !block || !rent || !status) {
      console.log("❌ Validation failed - missing fields");
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    console.log("🔍 Checking for duplicate room...");
    // Check if room already exists
    const existingRoom = await roomsCollection.findOne({
      number: number.toString().trim(),
    });

    if (existingRoom) {
      console.log("❌ Room already exists:", existingRoom);
      return res.status(409).json({
        error: `Room ${number} already exists`,
      });
    }

    // Create new room object
    const newRoom = {
      number: number.toString().trim(),
      type: type.trim().toLowerCase(),
      capacity: parseInt(capacity),
      floor: parseInt(floor),
      block: block.trim().toUpperCase(),
      rent: parseFloat(rent),
      status: status.trim().toLowerCase(),
      occupants: [],
      amenities: ["wifi", "fan", "wardrobe", "study_table"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const result = await roomsCollection.insertOne(newRoom);

    // Verify the room was actually inserted
    const verifiedRoom = await roomsCollection.findOne({
      _id: result.insertedId,
    });

    res.status(201).json({
      _id: result.insertedId,
      ...newRoom,
    });
  } catch (error) {
    console.error("❌ Error adding room:", error);
    res.status(500).json({ error: "Failed to add room: " + error.message });
  }
});

// DELETE: Remove a room by ID
router.delete("/rooms/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!roomsCollection)
      return res.status(500).json({ message: "Database not initialized" });

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid room ID" });
    }

    const result = await roomsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error("Error deleting room:", err);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

module.exports = { router, setRoomsCollection };
