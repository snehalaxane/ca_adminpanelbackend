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

  req.session.admin = {
    id: admin._id,
    email: admin.email,
    lastLogin: admin.lastLogin,
  };
  console.log("LOGIN SESSION AFTER SET:", req.session);

  req.session.save(() => {
    res.json({ 
      success: true,
      email: admin.email,
      lastLogin: admin.lastLogin
    });
  });
});



// ---------------- LOGOUT ----------------
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie("admin-session", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === 'production',
    });

    res.json({ message: "Logged out successfully" });
  });
});




router.get("/me", (req, res) => {
  if (!req.session || !req.session.admin) {
    return res.status(401).json({ authenticated: false });
  }

  res.json({
    authenticated: true,
    email: req.session.admin.email,
    lastLogin: req.session.admin.lastLogin,
  });
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
