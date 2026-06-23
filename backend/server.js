const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Guide = require('./models/Guide');
const Booking = require('./models/Booking');

const app = express();
const PORT = 5000;
const JWT_SECRET = "your_super_secret_security_key_here"; // Keep this hidden in real apps!

// Middleware configuration
app.use(cors());
app.use(express.json());

// 🔌 Connect to MongoDB
const MONGO_URI = "mongodb://localhost:27017/localguide_db";
mongoose.connect(MONGO_URI)
  .then(() => console.log("💾 MongoDB Connected Successfully!"))
  .catch(err => console.error("Database connection failure:", err));

// ==========================================
// 🛠️ API ENDPOINTS
// ==========================================

// 1. POST: Register a new Unemployed Local Guide (Merged & Secured)
app.post('/api/guides/register', async (req, res) => {
  try {
    const { name, email, password, assignedCity, languages, policeClearanceId } = req.body;

    // A. Check if user already exists
    const existingUser = await Guide.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    // B. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // C. Process comma-separated languages cleanly into an array
    const languagesArray = typeof languages === 'string' 
      ? languages.split(',').map(lang => lang.trim()) 
      : languages;

    // D. Build the complete profile with credentials included
    const newGuide = new Guide({
      name,
      email,
      password: hashedPassword, // Stores the secure cryptographic hash string
      assignedCity,
      languages: languagesArray,
      policeClearanceId
    });

    await newGuide.save();
    res.status(201).json({ success: true, message: "Secure profile created!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. POST: Secure Login Router Handler
app.post('/api/guides/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const guide = await Guide.findOne({ email });
    if (!guide) return res.status(400).json({ success: false, message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, guide.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials." });

    const token = jwt.sign({ id: guide._id, city: guide.assignedCity }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token, guide: { name: guide.name, city: guide.assignedCity } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. GET: Fetch all guides for a specific city selected by a tourist
app.get('/api/guides/:cityName', async (req, res) => {
  try {
    const { cityName } = req.params;
    const guides = await Guide.find({ assignedCity: { $regex: new RegExp("^" + cityName + "$", "i") } });
    res.json(guides);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. POST: Save tourist trip requests directly into MongoDB
app.post('/api/security/sos-log', async (req, res) => {
  try {
    const { touristName, guideId, guideName, destination, policeClearanceId } = req.body;
    
    const newBooking = new Booking({
      touristName: touristName || 'Verified Independent Traveler',
      guideId,
      guideName,
      destination,
      policeClearanceId
    });

    await newBooking.save();
    res.json({ success: true, message: "Data packet securely pinned to the public safety database registry." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. GET: Protected endpoint for logged-in guides to fetch their targeted job assignments
app.get('/api/guides/dashboard/bookings', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Access Denied. Missing Authorization Token Header." });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const activeJobs = await Booking.find({ guideId: decoded.id }).sort({ timestamp: -1 });
    res.json({ success: true, jobs: activeJobs });
  } catch (error) {
    res.status(401).json({ success: false, message: "Session expired or invalid identification token key." });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Express Backend server running on http://localhost:${PORT}`);
});