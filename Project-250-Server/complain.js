const express = require("express");
const multer = require("multer");
const router = express.Router();

let complainCollection;

const storage = multer.memoryStorage();
const upload = multer({ storage });

const setCollections = ({ complainCollection: cc }) => {
  complainCollection = cc;
};

// POST: Add New Complaint
router.post("/complain", upload.array("photos", 5), async (req, res) => {
  try {
    if (!complainCollection)
      return res.status(500).json({ message: "Database not initialized" });

    const { category, customCategory, title, description, userId } = req.body;

    if (!category || !title || !description || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const photoUrls =
      req.files?.map(
        (file) => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
      ) || [];

    const newComplain = {
      userId,
      category: category === "other" ? customCategory : category,
      title,
      description,
      photos: photoUrls,
      status: "pending",
      priority: "medium",
      createdAt: new Date(),
    };

    const result = await complainCollection.insertOne(newComplain);
    res.status(201).json({
      message: "Complaint submitted successfully",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("❌ Complaint Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET: Fetch all complaints
router.get("/complains", async (req, res) => {
  try {
    if (!complainCollection)
      return res.status(500).json({ message: "Database not initialized" });

    const complains = await complainCollection.find().toArray();
    res.status(200).json(complains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { router, setCollections };
