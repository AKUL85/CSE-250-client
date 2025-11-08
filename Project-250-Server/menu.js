const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

let menuCollection; // will be set from main server file

function setMenuCollection(collections) {
  menuCollection = collections.menuCollection;
}

// GET all menu items
router.get("/menu", async (req, res) => {
  try {
    const menuItems = await menuCollection.find().toArray();
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Failed to fetch menu items:", error);
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
});

// POST add new menu item
router.post("/menu", async (req, res) => {
  try {
    const menuItem = req.body;

    // Basic validation (optional, extend as needed)
    if (!menuItem.name || !menuItem.price || !menuItem.day || !menuItem.mealType || !menuItem.category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await menuCollection.insertOne(menuItem);
    const newMenu = { ...menuItem, _id: result.insertedId };

    res.status(201).json({ menuItem: newMenu });
  } catch (error) {
    console.error("Failed to add menu item:", error);
    res.status(500).json({ message: "Failed to add menu item" });
  }
});

// PUT update menu item by id
router.put("/menu/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const result = await menuCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ menuItem: result.value });
  } catch (error) {
    console.error("Failed to update menu item:", error);
    res.status(500).json({ message: "Failed to update menu item" });
  }
});

// DELETE menu item by id
router.delete("/menu/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await menuCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.error("Failed to delete menu item:", error);
    res.status(500).json({ message: "Failed to delete menu item" });
  }
});

module.exports = { router, setMenuCollection };
