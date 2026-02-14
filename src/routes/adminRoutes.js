const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const adminAuth = require("../../middleware/middleware");

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Update lastLogin
  admin.lastLogin = new Date();
  await admin.save();

  // ✅ CREATE JWT TOKEN
  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    success: true,
    token,
    email: admin.email,
    lastLogin: admin.lastLogin,
  });
});


// ---------------- LOGOUT ----------------
router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out" });
});


// ---------------- ME ----------------
router.get("/me", adminAuth, async (req, res) => {
  res.json({
    authenticated: true,
    email: req.admin.email,
    lastLogin: req.admin.lastLogin,
  });
});


// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({ message: "Admin already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      email: email.toLowerCase(),
      password: hashedPassword,
      lastLogin: null,
    });

    await newAdmin.save();

    res.json({
      success: true,
      message: "Admin created successfully",
    });

  } catch (err) {
    res.status(500).json({ message: "Error creating admin" });
  }
});

module.exports = router;
