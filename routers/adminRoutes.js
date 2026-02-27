const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Admin = require("../model/Admin");
const GeneralSettings = require("../model/GeneralSettings");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middleware/middleware");
const nodemailer = require("nodemailer");
const { createTransporter, getMailConfig } = require("../utils/mail");
const crypto = require("crypto");

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

// ---------------- FORGOT PASSWORD (SEND OTP) ----------------
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ message: "Admin with this email not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    admin.resetOtp = otp;
    admin.resetOtpExpires = otpExpires;
    await admin.save();

    // Send Mail
    const transporter = await createTransporter();
    const mailConfig = await getMailConfig();

    const genSettings = await GeneralSettings.findOne() || {};
    const siteLogo = genSettings.logoUrl
      ? (genSettings.logoUrl.startsWith('http') ? genSettings.logoUrl : `${req.protocol}://${req.get('host')}${genSettings.logoUrl}`)
      : '';
    const siteName = genSettings.siteName || mailConfig.from;

    const mailOptions = {
      from: `"${siteName}" <${mailConfig.user}>`,
      to: admin.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 10px; max-width: 500px; margin: 0 auto;">
          ${siteLogo ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${siteLogo}" alt="${siteName}" style="max-height: 50px; object-fit: contain;"></div>` : ''}
          <h2 style="color: #022683; text-align: center;">Password Reset OTP</h2>
          <p style="text-align: center;">Your OTP for password reset is:</p>
          <div style="text-align: center; margin: 20px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #022683; padding: 15px 25px; background-color: #fff; display: inline-block; border-radius: 8px; letter-spacing: 5px; border: 1px solid #ddd;">
              ${otp}
            </div>
          </div>
          <p style="text-align: center; color: #666; font-size: 14px;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="text-align: center; color: #999; font-size: 12px;">© ${new Date().getFullYear()} ${siteName}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ---------------- VERIFY OTP ----------------
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await Admin.findOne({
      email: email.toLowerCase(),
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ success: true, message: "OTP verified. You can now reset your password." });
  } catch (err) {
    res.status(500).json({ message: "Error verifying OTP" });
  }
});

// ---------------- RESET PASSWORD ----------------
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const admin = await Admin.findOne({
      email: email.toLowerCase(),
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Session expired, please try again" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.resetOtp = null;
    admin.resetOtpExpires = null;
    await admin.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password" });
  }
});

module.exports = router;
