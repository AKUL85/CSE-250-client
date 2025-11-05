const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const admin = require("firebase-admin");
const multer = require("multer");
require("dotenv").config();

const { router: complainRouter, setCollections } = require("./complain");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔹 MongoDB Setup
const uri = `mongodb+srv://${process.env.USERID}:${process.env.PASSWORD}@cluster0.rdbtijm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

let usersCollection;
let complainCollection;
let seatApplicationCollection;
let roomsCollection;

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(process.env.MONGO_DB || "HallMannagement");
    usersCollection = db.collection("users");
    complainCollection = db.collection("complains");
    seatApplicationCollection = db.collection("seatApplications");
     roomsCollection = db.collection("rooms");

    // ✅ Set collections AFTER connection is ready
    setCollections({ complainCollection });

    // ✅ Register routes AFTER setting collections
    app.use("/api", complainRouter);

    console.log("✅ Collections set successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}

connectDB();

// 🔹 Multer Configuration for Seat Application
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔹 Seat Application Routes
app.post("/seat-application", upload.single("proofFile"), async (req, res) => {
  try {
    const applicationData = req.body;
    const proofFile = req.file;

    if (
      !applicationData.roomType ||
      !applicationData.floor ||
      !applicationData.block ||
      !applicationData.department ||
      !applicationData.cgpa ||
      !applicationData.semester
    ) {
      return res.status(400).json({ message: "Missing required application data." });
    }

    const newApplication = {
      ...applicationData,
      proofFile: proofFile
        ? {
            filename: proofFile.originalname,
            mimetype: proofFile.mimetype,
            size: proofFile.size,
            uploadStatus: "received",
          }
        : null,
      status: "submitted",
      createdAt: new Date(),
      timeline: [
        { status: "submitted", note: "Application submitted", date: new Date() },
      ],
    };

    const result = await seatApplicationCollection.insertOne(newApplication);
    res.status(201).json({
      message: "Application submitted successfully",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error submitting seat application:", error);
    res.status(500).json({ message: "Failed to submit application", error: error.message });
  }
});

// 🔹 Fetch all seat applications
app.get("/seat-applications", async (req, res) => {
  try {
    const applications = await seatApplicationCollection.find().toArray();
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications", error: error.message });
  }
});

// 🔹 Student Registration
app.post("/register-student", async (req, res) => {
  try {
    const { name, studentId, email, phone, password, role, room, avatar } =
      req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // ✅ Step 1: Create Firebase user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    const assignedRole = role || "student";
    await admin
      .auth()
      .setCustomUserClaims(userRecord.uid, { role: assignedRole });

    const newUser = {
      uid: userRecord.uid,
      studentId: studentId || `ST-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      phone: phone || "N/A",
      role: assignedRole,
      room: room || "Not assigned",
      avatar:
        avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      createdAt: new Date(),
    };

    // ✅ Step 2: Try inserting into MongoDB
    try {
      const result = await usersCollection.insertOne(newUser);
      console.log("User inserted in MongoDB with id:", result.insertedId);
    } catch (mongoErr) {
      // 🚨 Step 3: Rollback Firebase user if MongoDB insert fails
      console.error("MongoDB insertion failed:", mongoErr);
      await admin.auth().deleteUser(userRecord.uid);
      return res
        .status(500)
        .json({ message: "Failed to save user data. User rolled back." });
    }

    res.status(201).json({
      message: "Student registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering student:", error);

    // If Firebase creation failed because user already exists
    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({ message: "Email already registered" });
    }

    res
      .status(500)
      .json({ message: "Failed to register student", error: error.message });
  }
});

// 🔹 Get & Delete Users
app.get("/users", async (req, res) => {
  try {
    const users = await usersCollection.find().toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (user?.uid) await admin.auth().deleteUser(user.uid).catch(() => {});
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    res.status(result.deletedCount ? 200 : 404).json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});



// ROOMS API

// ✅ Get all rooms
app.get("/rooms/all", async (req, res) => {
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
app.post("/rooms/add", async (req, res) => {
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


// 🔹 Root Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});




