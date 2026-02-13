const express = require('express');
const router = express.Router();
const GeneralSettings = require('../models/GeneralSettings');
const ThemeSettings = require('../models/ThemeSettings');
const EmailSettings = require('../models/EmailSettings');

// --- General Settings ---
router.get('/general', async (req, res) => {
    try {
        let settings = await GeneralSettings.findOne();
        if (!settings) {
            settings = await GeneralSettings.create({});
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/general', async (req, res) => {
    try {
        const settings = await GeneralSettings.findOneAndUpdate({}, req.body, { upsert: true, new: true });
        res.json(settings);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- Theme Settings ---
router.get('/theme', async (req, res) => {
    try {
        let settings = await ThemeSettings.findOne();
        if (!settings) {
            settings = await ThemeSettings.create({});
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/theme', async (req, res) => {
    try {
        const settings = await ThemeSettings.findOneAndUpdate({}, req.body, { upsert: true, new: true });
        res.json(settings);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- Email Settings ---
router.get('/email', async (req, res) => {
    try {
        let settings = await EmailSettings.findOne();
        if (!settings) {
            settings = await EmailSettings.create({});
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/email', async (req, res) => {
    try {
        const settings = await EmailSettings.findOneAndUpdate({}, req.body, { upsert: true, new: true });
        res.json(settings);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
