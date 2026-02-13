const express = require('express');
const router = express.Router();
const ContactOffice = require('../models/ContactOffice');

// Get all offices
router.get('/', async (req, res) => {
  try {
    const offices = await ContactOffice.find().sort({ order: 1, createdAt: 1 });
    res.json(offices);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Replace all offices (bulk PUT)
router.put('/', async (req, res) => {
  try {
    const offices = Array.isArray(req.body) ? req.body : req.body.offices;
    if (!Array.isArray(offices)) return res.status(400).json({ message: 'Invalid payload' });

    // Remove all existing and insert new ones
    await ContactOffice.deleteMany({});
    const inserted = await ContactOffice.insertMany(offices.map((o, i) => ({
      cityName: o.cityName || '',
      officeName: o.officeName || '',
      address: o.address || '',
      phone: o.phone || '',
      email: o.email || '',
      mapEmbed: o.mapEmbed || '',
      enabled: typeof o.enabled === 'boolean' ? o.enabled : true,
      order: typeof o.order === 'number' ? o.order : i
    })));

    res.json(inserted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
