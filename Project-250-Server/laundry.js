// laundry.js
const express = require("express");
const router = express.Router();
const dayjs = require("dayjs");

let laundryCollection;
let laundryMachinesCollection;

const setLaundryCollections = ({ laundryCollection: lc, laundryMachinesCollection: lmc }) => {
  laundryCollection = lc;
  laundryMachinesCollection = lmc;
};

// Utility: Generate slots for a specific date
// Custom ID format: 2024-12-25_T08-09_M001
//                   YYYY-MM-DD  SLOT  Machine
async function generateLaundrySlots(date) {
  const machines = ["M001", "M002", "M003", "M004"];
  const startHour = 8; // 8 AM
  const totalSlots = 14; // 8 AM to 9 PM (last slot 21:00-22:00)

  const newSlots = [];

  for (const machineId of machines) {
    for (let i = 0; i < totalSlots; i++) {
      // Create local time slot
      const startAt = dayjs(date)
        .hour(startHour + i)
        .minute(0)
        .second(0)
        .millisecond(0);

      const endAt = startAt.add(1, "hour");

      // Generate custom _id in format: YYYY-MM-DD_THH-HH_MXXX
      const dateStr = dayjs(date).format("YYYY-MM-DD"); // Full date
      const startTime = String(startHour + i).padStart(2, "0");
      const endTime = String(startHour + i + 1).padStart(2, "0");
      const customId = `${dateStr}_T${startTime}-${endTime}_${machineId}`;

      newSlots.push({
        _id: customId, // Custom ID format: 2024-12-25_T08-09_M001
        date,
        machineId,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        userId: "", // booked by - initially null
        status: "available",
      });

      // console.log("inserting slot:", customId); // debug
    }
  }

  try {
    await laundryCollection.insertMany(newSlots);
    console.log(`✅ Created ${newSlots.length} slots for ${date}`);
  } catch (error) {
    console.error("❌ Error creating slots:", error.message);
    throw error;
  }
}

// GET slots for a given date (auto-create if not exist)
router.get("/laundry/slots", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: "Missing date parameter" });
    }
    console.log("here");

    // Convert date to _id prefix format
    const dateObj = dayjs(date);
    if (!dateObj.isValid()) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const datePrefix = dateObj.format("YYYY-MM-DD");

    // FAST: Query by _id prefix using regex
    let slots = await laundryCollection
      .find({
        _id: { $regex: `^${datePrefix}_` },
      })
      .toArray();

    if (!slots.length) {
      console.log(`⚙️ No slots found for ${date}, creating...`);
      await generateLaundrySlots(date);
      // Query again with _id prefix after creation
      slots = await laundryCollection
        .find({
          _id: { $regex: `^${datePrefix}_` },
        })
        .toArray();
    }
    res.status(200).json(slots);
  } catch (error) {
    console.error("❌ Error fetching laundry slots:", error);
    res.status(500).json({ error: "Failed to fetch laundry slots" });
  }
});

// POST book a slot
router.post("/laundry/book", async (req, res) => {
  try {
    const { date, time, machineId, userId } = req.body;

    console.log("Booking request:", { date, time, machineId, userId });

    // Validate required fields
    if (!date || !time || !machineId || !userId) {
      return res.status(400).json({
        error: "Missing required fields: date, time, machineId, userId",
      });
    }

    // Convert time "08:00" to time range "T08-09"
    const hour = time.split(":")[0]; // "08"
    const nextHour = String(parseInt(hour) + 1).padStart(2, "0"); // "09"
    const timeRange = `T${hour}-${nextHour}`;

    // Construct the _id to find
    const slotId = `${date}_${timeRange}_${machineId}`;
    console.log("Looking for slot:", slotId);

    // Find the slot
    const slot = await laundryCollection.findOne({ _id: slotId });

    if (!slot) {
      return res.status(404).json({ error: "Slot not found" });
    }

    // Check if slot is already booked
    if (slot.userId) {
      return res.status(409).json({ error: "Slot is already booked" });
    }

    // Check if slot status is available
    if (slot.status !== "available") {
      return res
        .status(409)
        .json({ error: "Slot is not available for booking" });
    }

    // Book the slot
    const result = await laundryCollection.updateOne(
      { _id: slotId },
      {
        $set: {
          userId: userId,
          status: "booked",
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: "Failed to book slot" });
    }

    console.log(`✅ Slot booked: ${slotId} by user ${userId}`);
    res.status(200).json({
      message: "Slot booked successfully",
      slot: {
        _id: slotId,
        date,
        machineId,
        startAt: slot.startAt,
        endAt: slot.endAt,
        userId,
        status: "booked",
      },
    });
  } catch (error) {
    console.error("❌ Error booking slot:", error);
    res.status(500).json({ error: "Failed to book slot" });
  }
});

// GET: get users booked laundry
router.get("/laundry/booked", async (req, res) => {
  const { userId } = req.query;

  try {
    if (!laundryCollection)
      return res.status(500).json({ message: "Database not initialized!" });

    const bookedSlots = await laundryCollection
      .find({ userId: userId })
      .toArray();

    res.status(200).json(bookedSlots);
  } catch (err) {
    console.log("Error finding booked slots: ", err);
    res.status(500).json({ message: "Server error " });
  }
});

// GET: laundry machines and their status
router.get("/laundry/machines", async (req, res) => {
  try {
    if (!laundryMachinesCollection) return res.status(500).json({ message: "Database not initialized" });
    
    let machines = await laundryMachinesCollection.find().toArray();
    
    // Seed machines if none exist
    if (machines.length === 0) {
      const initialMachines = [
        { machineId: "M001", status: "operational", type: "Front Load", model: "Samsung V5" },
        { machineId: "M002", status: "operational", type: "Front Load", model: "Samsung V5" },
        { machineId: "M003", status: "repair", type: "Top Load", model: "LG Turbo" },
        { machineId: "M004", status: "operational", type: "Top Load", model: "LG Turbo" },
      ];
      await laundryMachinesCollection.insertMany(initialMachines);
      machines = await laundryMachinesCollection.find().toArray();
    }
    
    // Get usage stats for each machine
    const stats = await laundryCollection.aggregate([
      { $match: { status: "booked" } },
      { $group: { _id: "$machineId", totalUsage: { $sum: 1 } } }
    ]).toArray();
    
    const machinesWithStats = machines.map(m => {
      const usage = stats.find(s => s._id === m.machineId);
      return { ...m, totalUsage: usage ? usage.totalUsage : 0 };
    });
    
    res.status(200).json(machinesWithStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH: Update machine status
router.patch("/laundry/machines/:machineId", async (req, res) => {
  try {
    const { machineId } = req.params;
    const { status } = req.body;
    
    await laundryMachinesCollection.updateOne(
      { machineId: machineId },
      { $set: { status } }
    );
    
    res.status(200).json({ message: "Machine status updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, setLaundryCollections };
