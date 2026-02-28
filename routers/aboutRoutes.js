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
    console.log("[DEBUG] About PUT body:", JSON.stringify(req.body, null, 2));
    let updateData = { ...req.body };

    // Parse stats if they come as a JSON string
    if (typeof updateData.stats === 'string') {
      try {
        updateData.stats = JSON.parse(updateData.stats);
      } catch (e) {
        console.error("Failed to parse stats JSON", e);
      }
    }

    console.log("[DEBUG] Parsed updateData.stats:", updateData.stats);

    // Assign uploaded files to their respective stats
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // Match stat_image_0, stat_image_1, etc.
        const match = file.fieldname.match(/stat_image_(\d+)/);
        if (match) {
          const index = parseInt(match[1]);
          if (updateData.stats && updateData.stats[index]) {
            updateData.stats[index].image = "/uploads/about/" + file.filename;
            console.log(`[DEBUG] Mapped ${file.filename} to stats[${index}].image`);
          }
        }
      });
    }

    let about = await About.findOne();

    if (about) {
      console.log("[DEBUG] Updating existing About document");
      about = await About.findOneAndUpdate({}, { $set: updateData }, { new: true, runValidators: true });
    } else {
      console.log("[DEBUG] Creating new About document");
      about = new About(updateData);
      await about.save();
    }

    console.log("[DEBUG] Final saved data:", JSON.stringify(about, null, 2));
    res.json(about);
  } catch (err) {
    console.error("About update error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
