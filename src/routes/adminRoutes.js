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

  req.session.admin = {
    id: admin._id,
    email: admin.email,
    lastLogin: new Date(),
  };
  console.log("LOGIN SESSION AFTER SET:", req.session);

  req.session.save(() => {
    res.json({ success: true });
  });
});



// ---------------- LOGOUT ----------------
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie("admin-session", {
      path: "/",          // 🔥 REQUIRED
      httpOnly: true,
      sameSite: "lax",
      secure: false,      // true only if HTTPS
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



module.exports = router;
