const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

let menuCollection;
let ordersCollection;

function setFoodManagerCollections(collections) {
  menuCollection = collections.menuCollection;
  ordersCollection = collections.ordersCollection;
}

// GET food stats for dashboard
router.get("/food-stats", async (req, res) => {
  try {
    const totalMenuItems = await menuCollection.countDocuments();
    const totalOrders = await ordersCollection.countDocuments();
    const pendingOrders = await ordersCollection.countDocuments({ status: "pending" });
    const completedOrders = await ordersCollection.countDocuments({ status: "completed" });

    // Calculate total revenue
    const orders = await ordersCollection.find({ status: "completed" }).toArray();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    res.status(200).json({
      totalMenuItems,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue
    });
  } catch (error) {
    console.error("Failed to fetch food stats:", error);
    res.status(500).json({ message: "Failed to fetch food stats" });
  }
});

// POST create new menu item (for food manager)
router.post("/menu-item", async (req, res) => {
  try {
    const menuItem = req.body;

    // Validation
    if (!menuItem.name || !menuItem.price || !menuItem.day || !menuItem.mealType || !menuItem.category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await menuCollection.insertOne(menuItem);
    const newMenuItem = { ...menuItem, _id: result.insertedId };

    res.status(201).json({ menuItem: newMenuItem });
  } catch (error) {
    console.error("Failed to create menu item:", error);
    res.status(500).json({ message: "Failed to create menu item" });
  }
});

// PUT update menu item
router.put("/menu-item/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const result = await menuCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ menuItem: result });
  } catch (error) {
    console.error("Failed to update menu item:", error);
    res.status(500).json({ message: "Failed to update menu item" });
  }
});

// DELETE menu item
router.delete("/menu-item/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await menuCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Failed to delete menu item:", error);
    res.status(500).json({ message: "Failed to delete menu item" });
  }
});

// GET orders for food manager
router.get("/orders", async (req, res) => {
  try {
    const orders = await ordersCollection.find().sort({ createdAt: -1 }).toArray();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// PUT update order status
router.put("/order/:id/status", async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const result = await ordersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order: result });
  } catch (error) {
    console.error("Failed to update order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

module.exports = {
  router,
  setFoodManagerCollections,
};