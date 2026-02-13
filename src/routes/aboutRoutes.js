const express = require("express");
const router = express.Router();
const About = require("../models/About");

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
router.put("/", async (req, res) => {
  try {
    let about = await About.findOne();

    if (about) {
      about = await About.findOneAndUpdate({}, req.body, { new: true });
    } else {
      about = new About(req.body);
      await about.save();
    }

    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
