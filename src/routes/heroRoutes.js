const express = require("express");
const HeroSection = require("../models/HeroSection.js");
const adminAuth = require("../../middleware/middleware");
const router = express.Router();



// GET hero
router.get("/", async (req, res) => {
  const hero = await HeroSection.findOne();
  res.json(hero);
});

// UPDATE hero
router.put("/", adminAuth, async (req, res) => {
  try {
    const hero = await HeroSection.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true }
    );

    res.json({ success: true, hero });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
