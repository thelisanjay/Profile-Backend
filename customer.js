require("dotenv").config(); // Load .env variables
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Load environment variables
const PORT = process.env.PORT || 5000; // Fallback to 5000 if not defined
const MONGO_URI = process.env.MONGO_URI;

// Ensure MONGO_URI is defined
if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in the environment variables.");
  process.exit(1); // Exit the application if no MongoDB URI is set
}

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the application on a connection error
  });

// --- Profile Schema and Routes ---
const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  skills: { type: [String], required: true },
  experience: { type: String, required: true },
  education: { type: String, required: true },
  jobPreferences: {
    location: { type: String, required: true },
    jobType: { type: String, required: true },
    industry: { type: String, required: true },
  },
  profileImage: { type: String, required: true },
});

const Profile = mongoose.model("Profile", profileSchema);

// Route to handle profile data submission
app.post("/api/profiles", async (req, res) => {
  try {
    const profileData = req.body;

    // Create a new profile document in MongoDB
    const newProfile = new Profile(profileData);
    await newProfile.save();

    console.log("Profile data saved:", newProfile);
    res.status(201).json({ message: "Profile saved successfully!", data: newProfile });
  } catch (error) {
    console.error("Error saving profile:", error.message);
    res.status(500).json({ message: "Error saving profile", error: error.message });
  }
});

// Route to retrieve all profiles
app.get("/api/profiles", async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error.message);
    res.status(500).json({ message: "Error fetching profiles", error: error.message });
  }
});

// --- Customer Schema and Routes ---
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
});

const Customer = mongoose.model("Customer", customerSchema);

// Route to handle new customer data submission
app.post("/api/customers", async (req, res) => {
  try {
    const customerData = req.body;

    const newCustomer = new Customer(customerData);
    await newCustomer.save();

    res.status(201).json({ message: "Customer saved successfully!", data: newCustomer });
  } catch (error) {
    console.error("Error saving customer:", error.message);
    res.status(500).json({ message: "Error saving customer", error: error.message });
  }
});

// Route to retrieve all customers
app.get("/api/customers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error.message);
    res.status(500).json({ message: "Error fetching customers", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
