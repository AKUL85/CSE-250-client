const express = require("express");
const router = express.Router();

let usersCollection;
let roomsCollection;
let ordersCollection;
let complainCollection;
let monthlyCostsCollection;

const setStatsCollections = (collections) => {
    usersCollection = collections.usersCollection;
    roomsCollection = collections.roomsCollection;
    ordersCollection = collections.ordersCollection;
    complainCollection = collections.complainCollection;
    monthlyCostsCollection = collections.monthlyCostsCollection;
};

// GET /api/stats/dashboard
router.get("/stats/dashboard", async (req, res) => {
    try {
        console.log("Stats: Fetching dashboard data...");
        // 1. Occupancy Rate
        const rooms = await roomsCollection.find().toArray();
        console.log(`Stats: Found ${rooms.length} rooms`);
        let totalCapacity = 0;
        let totalOccupants = 0;

        rooms.forEach((room) => {
            if (room.status !== 'under_maintenance') {
                totalCapacity += parseInt(room.capacity || 0);
                const occupants = room.occupants ? room.occupants.length : 0;
                totalOccupants += occupants;
            }
        });

        const occupancyRate = totalCapacity > 0 ? ((totalOccupants / totalCapacity) * 100).toFixed(1) : 0;

        // 2. Total Students
        const totalStudents = await usersCollection.countDocuments({ role: "student" });
        console.log(`Stats: Found ${totalStudents} students`);

        // 3. active complaints
        const activeComplaints = await complainCollection.countDocuments({ status: { $ne: "resolved" } });

        // 4. Monthly Cost (FETCH FROM MANUAL DATA FOR CURRENT MONTH)
        const date = new Date();
        const currentMonth = date.toLocaleString('default', { month: 'short' }); // "Feb"
        const currentYear = date.getFullYear();

        const costRecord = await monthlyCostsCollection.findOne({ month: currentMonth, year: currentYear });
        const monthlyCost = costRecord ? costRecord.cost : 0; // Default to 0 if not set

        res.status(200).json({
            totalStudents,
            occupancyRate,
            monthlyRevenue: monthlyCost, // reusing this field name for frontend compatibility, but value is Manual Cost
            activeComplaints
        });

    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        res.status(500).json({ message: "Failed to fetch stats", error: error.message });
    }
});

// GET /api/stats/cost-history?year=2025 (Now acts as Monthly Cost History)
router.get("/stats/cost-history", async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();

        const manualCosts = await monthlyCostsCollection.find({ year: year }).toArray();

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedData = months.map((m) => {
            const found = manualCosts.find(item => item.month === m);
            return {
                month: m,
                revenue: found ? found.cost : 0 // reusing 'revenue' key for frontend compatibility
            };
        });

        res.status(200).json(formattedData);

    } catch (error) {
        console.error("Failed to fetch cost history:", error);
        res.status(500).json({ message: "Failed to fetch cost history", error: error.message });
    }
});

// POST /api/stats/monthly-cost
router.post("/stats/monthly-cost", async (req, res) => {
    try {
        const { month, year, cost } = req.body;

        if (!month || !year || cost === undefined) {
            return res.status(400).json({ message: "Month, Year and Cost are required" });
        }

        const filter = { month, year: parseInt(year) };
        const update = { $set: { cost: parseFloat(cost), updatedAt: new Date() } };
        const options = { upsert: true };

        await monthlyCostsCollection.updateOne(filter, update, options);

        res.status(200).json({ message: "Monthly cost updated successfully" });

    } catch (error) {
        console.error("Failed to update monthly cost:", error);
        res.status(500).json({ message: "Failed to update monthly cost" });
    }
});

// GET /api/stats/occupancy-history?type=year
router.get("/stats/occupancy-history", async (req, res) => {
    try {
        // Group users by creation year
        const userStats = await usersCollection.aggregate([
            { $match: { role: "student" } },
            {
                $group: {
                    _id: { $year: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]).toArray();

        // Format
        const formattedData = userStats.map(item => ({
            year: item._id ? item._id.toString() : "Unknown",
            occupancy: item.count
        }));

        res.status(200).json(formattedData);
    } catch (error) {
        console.error("Failed to fetch occupancy history:", error);
        res.status(500).json({ message: "Failed to fetch occupancy history", error: error.message });
    }
});

module.exports = { router, setStatsCollections };
