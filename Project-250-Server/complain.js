const express = require("express");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const router = express.Router();

let complainCollection;

const storage = multer.memoryStorage();
const upload = multer({ storage });

const setComplainCollections = ({ complainCollection: cc }) => {
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
        (file) =>
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
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

// GET: Fetch complaints with user id
router.get("/complains/my-complains/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    if(!complainCollection) return res.status(500).json({ message: "Database not initialized"});
    
    const complains = await complainCollection.find({ userId: userId }).toArray();

    // if(!complains) res.status(204).json({ message: "No complaint found"});
    res.status(200).json(complains);
  } catch (err) {
    
  }
})

// GET: Fetch complaints with ID
router.get("/complains/:_id", async (req, res) => {
  const { _id } = req.params;
  console.log(_id);
  try {
    if (!complainCollection)
      return res.status(500).json({ message: "Database not initialized" });

    console.log("called");
    if (!ObjectId.isValid(_id)) {
      return res.status(400).json({ error: "Invalid complaint ID" });
    }

    const complaint = await complainCollection.findOne({
      _id: new ObjectId(_id),
    });
    console.log("called3");

    if (!complaint)
      return res.status(404).json({ error: "Complaint not found" });
    console.log("found complaint");
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH: Update complaint status
router.patch("/complains/:_id/status", async (req, res) => {
  const { _id } = req.params;
  const { status } = req.body;

  try {
    if (!complainCollection)
      return res.status(500).json({ message: "Database not initialized" });

    if (!ObjectId.isValid(_id)) {
      return res.status(400).json({ error: "Invalid complaint ID" });
    }

    const result = await complainCollection.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: { status } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      // return res.status(404).json({ error: "Complaint not found" });
    }

    res.json(result.value);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, setComplainCollections };
