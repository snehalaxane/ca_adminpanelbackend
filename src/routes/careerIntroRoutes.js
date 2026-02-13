const express = require("express");
const CareerIntro = require("../models/CareerIntro");
const router = express.Router();

// Get career intro data
router.get("/", async (req, res) => {
  try {
    let careerIntro = await CareerIntro.findOne();

    // Create default if not exists
    if (!careerIntro) {
      careerIntro = new CareerIntro({
        title: 'Careers',
        subtitle: 'Join a team built on professionalism, growth, and integrity.',
        description: 'Explore exciting opportunities and be part of our legacy',
        ctaText: 'Explore Opportunities',
        enabled: true
      });
      await careerIntro.save();
    }

    res.json(careerIntro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update career intro
router.put("/", async (req, res) => {
  try {
    const { title, subtitle, description, ctaText, enabled } = req.body;

    let careerIntro = await CareerIntro.findOne();
    
    if (!careerIntro) {
      careerIntro = new CareerIntro({
        title,
        subtitle,
        description,
        ctaText,
        enabled
      });
    } else {
      if (title) careerIntro.title = title;
      if (subtitle) careerIntro.subtitle = subtitle;
      if (description) careerIntro.description = description;
      if (ctaText) careerIntro.ctaText = ctaText;
      if (enabled !== undefined) careerIntro.enabled = enabled;
    }

    careerIntro.updatedAt = Date.now();
    await careerIntro.save();

    res.json(careerIntro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
