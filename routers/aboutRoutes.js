const express = require("express");
const router = express.Router();
const About = require("../model/About");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = "uploads/about";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// GET About Section
router.get("/", async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE or UPDATE About Section
router.put("/", upload.any(), async (req, res) => {
  try {
    let statsArray = [];
    if (typeof req.body.stats === 'string') {
      try { statsArray = JSON.parse(req.body.stats); } catch (e) { }
    } else if (Array.isArray(req.body.stats)) {
      statsArray = req.body.stats;
    }

    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        const match = file.fieldname.match(/stat_image_(\d+)/);
        if (match) {
          const index = parseInt(match[1]);
          if (statsArray[index]) {
            statsArray[index].image = "/uploads/about/" + file.filename;
            console.log(`[DEBUG] Mapped index ${index} to ${statsArray[index].image}`);
          }
        }
      });
    }

    let about = await About.findOne();
    if (about) {
      console.log("[DEBUG] Updating via .save()");
      about.title = req.body.title || about.title;
      about.description = req.body.description || about.description;
      about.enabled = req.body.enabled === "true";
      about.stats = statsArray;
      await about.save();
    } else {
      console.log("[DEBUG] Creating new doc");
      about = new About({
        title: req.body.title,
        description: req.body.description,
        enabled: req.body.enabled === "true",
        stats: statsArray
      });
      await about.save();
    }

    console.log("[DEBUG] FINAL SAVED:", about.stats.map(s => s.image));
    res.json(about);
  } catch (err) {
    console.error("About update error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
