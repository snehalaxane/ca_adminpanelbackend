const express = require('express');
const router = express.Router();
const ContactSettings = require('../models/ContactSettings');

// GET contact settings
router.get('/', async (req, res) => {
  try {
    let settings = await ContactSettings.findOne();
    if (!settings) {
      settings = new ContactSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE contact settings
router.put('/', async (req, res) => {
  try {
    const { callNow, emailUs } = req.body;
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => /^\+?[0-9\s\-()]{7,}$/.test(phone || '');

    if (callNow && !validatePhone(callNow)) {
      return res.status(400).json({ message: 'Invalid phone number for callNow' });
    }
    if (emailUs && !validateEmail(emailUs)) {
      return res.status(400).json({ message: 'Invalid email address for emailUs' });
    }

    let settings = await ContactSettings.findOne();
    if (!settings) {
      settings = new ContactSettings(req.body);
    } else {
      if (typeof req.body.heading !== 'undefined') settings.heading = req.body.heading;
      if (typeof req.body.subheading !== 'undefined') settings.subheading = req.body.subheading;
      if (typeof req.body.callNow !== 'undefined') settings.callNow = req.body.callNow;
      if (typeof req.body.emailUs !== 'undefined') settings.emailUs = req.body.emailUs;
      if (typeof req.body.enabled !== 'undefined') settings.enabled = req.body.enabled;
    }
    settings.updatedAt = Date.now();
    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
