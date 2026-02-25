const express = require("express");
const HeroSection = require("../model/HeroSection.js");
const adminAuth = require("../middleware/middleware");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "..", "uploads", "hero");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// GET hero
router.get("/", async (req, res) => {
  try {
    const hero = await HeroSection.findOne();
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE hero
router.put("/", adminAuth, upload.single("image"), async (req, res) => {
  try {
    const {
      highlightNumber,
      highlightText,
      title,
      subtitle,
      description,
      ctas,
      enabled,
      stat1,
      stat2,
      stat3,
      presenceTitle,
      presenceSubtitle
    } = req.body;

    const updateData = {
      highlightNumber,
      highlightText,
      title,
      subtitle,
      description,
      enabled: enabled === "true",
      stat1,
      stat2,
      stat3,
      presenceTitle,
      presenceSubtitle
    };

    if (ctas) {
      try {
        updateData.ctas = JSON.parse(ctas);
      } catch (err) {
        console.error("Error parsing ctas:", err);
      }
    }

    if (req.file) {
      updateData.imageUrl = `uploads/hero/${req.file.filename}`;
    }

    const hero = await HeroSection.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.json({ success: true, hero });
  } catch (err) {
    console.error("Error updating hero section:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
