const express = require('express');
const router = express.Router();
const ContactFormSettings = require('../models/ContactFormSettings');

// GET contact form settings (single document)
router.get('/', async (req, res) => {
  try {
    let settings = await ContactFormSettings.findOne();
    if (!settings) {
      settings = new ContactFormSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE contact form settings
router.put('/', async (req, res) => {
  try {
    const { callNow, emailUs, formFields } = req.body;

    // Basic server-side validation
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => /^\+?[0-9\s\-()]{7,}$/.test(phone || '');

    if (callNow && !validatePhone(callNow)) {
      return res.status(400).json({ message: 'Invalid phone number for callNow' });
    }
    if (emailUs && !validateEmail(emailUs)) {
      return res.status(400).json({ message: 'Invalid email address for emailUs' });
    }

    let settings = await ContactFormSettings.findOne();
    if (!settings) {
      settings = new ContactFormSettings(req.body);
    } else {
      // only assign known fields to avoid accidental mutation
      if (typeof req.body.heading !== 'undefined') settings.heading = req.body.heading;
      if (typeof req.body.subheading !== 'undefined') settings.subheading = req.body.subheading;
      if (typeof req.body.callNow !== 'undefined') settings.callNow = req.body.callNow;
      if (typeof req.body.emailUs !== 'undefined') settings.emailUs = req.body.emailUs;
      if (typeof req.body.enabled !== 'undefined') settings.enabled = req.body.enabled;
      if (Array.isArray(formFields)) settings.formFields = formFields;
    }
    settings.updatedAt = Date.now();
    await settings.save();

    // return the saved document so frontend can pick up generated _id values
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
