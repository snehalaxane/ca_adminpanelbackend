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
      try {
        statsArray = JSON.parse(req.body.stats);
      } catch (e) {
        console.error("[DEBUG] JSON Parse error for stats:", e);
      }
    } else if (Array.isArray(req.body.stats)) {
      statsArray = req.body.stats;
    }

    console.log(`[DEBUG] Incoming request with ${req.files ? req.files.length : 0} files`);

    // Map uploaded files to the stats array using index from fieldname
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        const match = file.fieldname.match(/stat_image_(\d+)/);
        if (match) {
          const index = parseInt(match[1]);
          if (statsArray[index]) {
            statsArray[index].image = "/uploads/about/" + file.filename;
            console.log(`[DEBUG] Mapped file to stats[${index}].image`);
          }
        }
      });
    }

    let about = await About.findOne();
    if (!about) {
      console.log("[DEBUG] Creating new About document");
      about = new About({
        title: req.body.title,
        description: req.body.description,
        enabled: req.body.enabled === "true",
        stats: statsArray
      });
    } else {
      console.log("[DEBUG] Updating existing About document via .save()");
      about.title = req.body.title || about.title;
      about.description = req.body.description || about.description;
      about.enabled = req.body.enabled === "true";
      about.stats = statsArray;
    }

    await about.save();
    console.log("[DEBUG] FINAL SAVED STATS:", about.stats.map(s => ({ img: s.image, txt: s.text })));
    res.json(about);
  } catch (err) {
    console.error("About update error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
