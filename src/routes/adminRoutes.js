const express = require("express");
const router = express.Router();

const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const adminAuth = require("../../middleware/middleware");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  // Update lastLogin in database
  admin.lastLogin = new Date();
  await admin.save();

  // Generate simple token
  const token = Buffer.from(`${admin._id}:${admin.email}:${Date.now()}`).toString('base64');

  res.json({ 
    success: true,
    token,
    email: admin.email,
    lastLogin: admin.lastLogin
  });
});



// ---------------- LOGOUT ----------------
router.post("/logout", (req, res) => {
  // With token-based auth, just respond with success
  // Frontend will remove token from localStorage
  res.json({ success: true, message: "Logged out" });
});




router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString().split(':');
    const adminId = decoded[0];
    const email = decoded[1];
    
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(401).json({ authenticated: false });
    }

    res.json({
      authenticated: true,
      email: admin.email,
      lastLogin: admin.lastLogin,
    });
  } catch (err) {
    return res.status(401).json({ authenticated: false });
  }
});


// ✅ REGISTER - Create new admin (only if no admins exist)
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    // Check if ANY admin exists (prevent multiple admins)
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({ message: "Admin already exists. Contact system administrator to add more users." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({
      email: email.toLowerCase(),
      password: hashedPassword,
      lastLogin: null
    });

    await newAdmin.save();

    res.json({ 
      success: true, 
      message: "Admin created successfully. You can now login.",
      email: newAdmin.email 
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Error creating admin", error: err.message });
  }
});

module.exports = router;
