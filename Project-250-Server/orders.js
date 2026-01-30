const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

let ordersCollection;
let menuCollection;

function setOrdersCollection(collections) {
  ordersCollection = collections.ordersCollection;
  menuCollection = collections.menuCollection;
}

// GET all orders (for food manager)
router.get("/orders", async (req, res) => {
  try {
    const orders = await ordersCollection.find().sort({ createdAt: -1 }).toArray();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// GET orders by user (for students)
router.get("/orders/my-orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await ordersCollection.find({ userId: userId }).sort({ createdAt: -1 }).toArray();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// POST create order
router.post("/orders", async (req, res) => {
  try {
    const orderData = req.body;
    
    // Basic validation
    if (!orderData.userId || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const newOrder = {
      ...orderData,
      status: "pending",
      createdAt: new Date(),
    };

    const result = await ordersCollection.insertOne(newOrder);
    res.status(201).json({ ...newOrder, _id: result.insertedId });
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// PUT update order status
router.put("/orders/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const result = await ordersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(result.value);
  } catch (error) {
    console.error("Failed to update order:", error);
    res.status(500).json({ message: "Failed to update order" });
  }
});

// GET Food Manager Stats
router.get("/food-stats", async (req, res) => {
  try {
    // 1. Total Menu Items
    const totalMenuItems = await menuCollection.countDocuments();

    // 2. Orders Stats
    const totalOrders = await ordersCollection.countDocuments();
    const pendingOrders = await ordersCollection.countDocuments({ status: "pending" });
    const completedOrders = await ordersCollection.countDocuments({ status: "completed" });
    
    // 3. Revenue (Simple sum of total)
    // Note: This matches the structure of mockOrders which has a 'total' field
    const pipeline = [
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" }
        }
      }
    ];
    const revenueResult = await ordersCollection.aggregate(pipeline).toArray();
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      totalMenuItems,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue
    });
  } catch (error) {
    console.error("Failed to fetch food stats:", error);
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
});


module.exports = { router, setOrdersCollection };
