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

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(process.env.MONGO_DB || "HallMannagement");
    usersCollection = db.collection("users");
    complainCollection = db.collection("complains");
    seatApplicationCollection = db.collection("seatApplications");

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
    const { name, email, password, role, room, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    const assignedRole = role || "student";
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: assignedRole });

    const newUser = {
      uid: userRecord.uid,
      name,
      email,
      role: assignedRole,
      room: room || "Not assigned",
      avatar:
        avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: "Student registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to register student", error: error.message });
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

// 🔹 Root Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
