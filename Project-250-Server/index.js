const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ Firebase Admin SDK init
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ✅ MongoDB setup
const uri = `mongodb+srv://${process.env.USERID}:${process.env.PASSWORD}@cluster0.rdbtijm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

// ✅ Connect to MongoDB
let usersCollection;
async function connectDB() {
  try {
    await client.connect();
    const db = client.db(process.env.MONGO_DB || "HallMannagement");
    usersCollection = db.collection("users");
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}
connectDB();


// 🟩 Default route
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.post("/register-student", async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { name, email, password, role, room, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // 1️⃣ Create user in Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });
    console.log("Firebase user created:", userRecord.uid);

    // 2️⃣ Assign custom role (student/admin)
    const assignedRole = role || "student";
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: assignedRole });
    console.log("Custom claims set");

    // 3️⃣ Save user data in MongoDB
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

    const result = await usersCollection.insertOne(newUser);
    console.log("User inserted in MongoDB with id:", result.insertedId);

    // 4️⃣ Return success response
    res.status(201).json({
      message: "Student registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ message: "Failed to register student", error: error.message });
  }
});



// 🟩 Route: Get all users (for admin dashboard)
app.get("/users", async (req, res) => {
  try {
    const users = await usersCollection.find().toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});
const { ObjectId } = require("mongodb");

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



// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
