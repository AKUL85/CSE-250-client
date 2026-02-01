const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const multer = require("multer");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const generateToken = require("./generateToken");const bcrypt = require('bcrypt');
const {
  router: complainRouter,
  setComplainCollections,
} = require("./complain");
const { router: laundryRouter, setLaundryCollections } = require("./laundry");
const { router: rommsRouter, setRoomsCollection } = require("./rooms");
const { router: menuRouter, setMenuCollection } = require("./menu");
const { router: ordersRouter, setOrdersCollection } = require("./orders");
const {
  router: foodManagerRouter,
  setFoodManagerCollections,
} = require("./foodmanager");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 🔹 MongoDB Setup
const uri = `mongodb+srv://${process.env.USERID}:${process.env.PASSWORD}@cluster0.rdbtijm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let usersCollection;
let complainCollection;
let seatApplicationCollection;
let roomsCollection;
let laundryCollection;
let menuCollection;
let ordersCollection;

async function connectDB() {
  try {
    await client.connect();
    console.log(" Connected to MongoDB");

    const db = client.db(process.env.MONGO_DB || "HallMannagement");
    usersCollection = db.collection("users");
    complainCollection = db.collection("complains");
    seatApplicationCollection = db.collection("seatApplications");
    roomsCollection = db.collection("rooms");
    laundryCollection = db.collection("laundry");
    const laundryMachinesCollection = db.collection("laundryMachines");
    menuCollection = db.collection("menu");
    ordersCollection = db.collection("orders");

    // Attach collection setters
    setComplainCollections({ complainCollection });
    setLaundryCollections({ laundryCollection, laundryMachinesCollection });
    setRoomsCollection({ roomsCollection });
    setMenuCollection({ menuCollection });
    setOrdersCollection({ ordersCollection, menuCollection });
    setFoodManagerCollections({ menuCollection, ordersCollection });

    // Register routes

    console.log("✅ Collections set successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}

app.use("/api/", laundryRouter);
app.use("/api/", rommsRouter);
app.use("/api/", menuRouter);
app.use("/api", ordersRouter);
app.use("/api", complainRouter);

// 🔹 Helper Function: Calculate Financial Condition Based on Income
const calculateFinancialCondition = (familyIncomeStr) => {
  const familyIncome = parseInt(familyIncomeStr) || 0;
  
  // Income brackets (in PKR)
  // Excellent: >= 2,000,000 (very financially stable)
  // Average: 500,000 - 1,999,999 (moderate income)
  // Poor: < 500,000 (needs financial assistance)
  
  if (familyIncome >= 2000000) {
    return "excellent";
  } else if (familyIncome >= 500000) {
    return "average";
  } else {
    return "poor";
  }
};
app.use("/api/food", foodManagerRouter);

// 🔹 Multer Configuration for Seat Application
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/login", async (req, res) => {
  try {
    console.log("here");
    const { email, password } = req.body;
    const user = await usersCollection.findOne({ email });
    // const passwordMatch = await bcrypt.compare(password, user.password);
    if (user && user.password === password) {
      const token = generateToken({ id: user._id, role: user.role });
      res.status(200).json({ token: token });
    } else {
      res.status(400).json({ Message: "Invalid Credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
      !applicationData.semester ||
      !applicationData.familyIncome
    ) {
      return res
        .status(400)
        .json({ message: "Missing required application data." });
    }

    // Calculate financial condition based on family income
    const financialCondition = calculateFinancialCondition(applicationData.familyIncome);

    const newApplication = {
      ...applicationData,
      familyIncome: parseInt(applicationData.familyIncome),
      financialCondition: financialCondition,
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
        {
          status: "submitted",
          note: "Application submitted",
          date: new Date(),
        },
      ],
    };

    const result = await seatApplicationCollection.insertOne(newApplication);
    res.status(201).json({
      message: "Application submitted successfully",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error submitting seat application:", error);
    res
      .status(500)
      .json({ message: "Failed to submit application", error: error.message });
  }
});

// 🔹 Fetch all seat applications
app.get("/seat-applications", async (req, res) => {
  try {
    const applications = await seatApplicationCollection.find().toArray();
    res.status(200).json(applications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch applications", error: error.message });
  }
});

// 🔹 Approve/Reject Seat Application
app.patch("/seat-applications/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { approved, approvalNotes, financialCondition } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid application ID" });
    }

    const updateData = {
      status: approved ? "approved" : "rejected",
      approvedAt: new Date(),
      approvalNotes: approvalNotes || "",
      financialCondition: financialCondition || "average",
      timeline: {
        status: approved ? "approved" : "rejected",
        note: approvalNotes || (approved ? "Application approved" : "Application rejected"),
        date: new Date(),
      },
    };

    const result = await seatApplicationCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json({
      message: `Application ${approved ? "approved" : "rejected"} successfully`,
      updatedApplication: updateData,
    });
  } catch (error) {
    console.error("Error approving/rejecting application:", error);
    res
      .status(500)
      .json({ message: "Failed to update application", error: error.message });
  }
});

// 🔹 Assign Student to Room
app.patch("/seat-applications/:id/assign-room", async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId, studentInfo } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid application ID" });
    }

    // Get the application
    const application = await seatApplicationCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.status !== "approved") {
      return res
        .status(400)
        .json({ error: "Only approved applications can be assigned to rooms" });
    }

    // Get the room
    const room = await roomsCollection.findOne({
      _id: new ObjectId(roomId),
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if room has capacity
    const occupiedSeats = room.occupants ? room.occupants.length : 0;
    if (occupiedSeats >= room.capacity) {
      return res.status(400).json({ error: "Room is at full capacity" });
    }

    // Add student to room occupants
    const updatedOccupants = [...(room.occupants || [])];
    updatedOccupants.push({
      studentId: studentInfo.studentId || application._id.toString(),
      name: studentInfo.name || application.name || "N/A",
      email: studentInfo.email || application.email || "N/A",
      assignedAt: new Date(),
    });

    await roomsCollection.updateOne(
      { _id: new ObjectId(roomId) },
      { $set: { occupants: updatedOccupants, updatedAt: new Date() } }
    );

    // Update the application with room assignment
    await seatApplicationCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          assignedRoom: roomId,
          assignedRoomDetails: {
            roomNumber: room.number,
            roomType: room.type,
            block: room.block,
            floor: room.floor,
          },
          assignedAt: new Date(),
        },
      }
    );

    res.status(200).json({
      message: "Student assigned to room successfully",
      roomAssignment: {
        roomId,
        roomNumber: room.number,
        roomType: room.type,
        block: room.block,
        floor: room.floor,
      },
    });
  } catch (error) {
    console.error("Error assigning student to room:", error);
    res
      .status(500)
      .json({ message: "Failed to assign student to room", error: error.message });
  }
});

// 🔹 Get Approved Applications (not yet assigned)
app.get("/seat-applications/approved/pending-assignment", async (req, res) => {
  try {
    const applications = await seatApplicationCollection
      .find({ status: "approved", assignedRoom: { $exists: false } })
      .toArray();
    res.status(200).json(applications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch approved applications", error: error.message });
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

    const assignedRole = role || "student";
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      studentId: studentId || `ST-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      phone: phone || "N/A",
      password: hashedPassword,
      role: assignedRole,
      room: room || "Not assigned",
      avatar:
        avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    res.status(201).json({
      message: "Student registered successfully",
      user: { ...newUser, password: undefined },
    });
  } catch (error) {
    console.error("Error registering student:", error);
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
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    delete updateData._id;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 1) {
      res.status(200).json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Root Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

connectDB()
  .then(() => {
    console.log("connected to DB");
    app.listen(port, () => {
      console.log(`listening to port ${port}`);
    });
  })
  .catch((err) => {
    console.log("error occurred.");
    console.log(err);
  });
