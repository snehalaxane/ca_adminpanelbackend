const express = require('express');
const router = express.Router();
console.log("CORRECT SETTINGS ROUTE ACTIVE");  // 👈 ADD HERE
const GeneralSettings = require('../models/GeneralSettings');
const ThemeSettings = require('../models/ThemeSettings');
const EmailSettings = require('../models/EmailSettings');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const uploadPath = path.join(__dirname, '../public/uploads');





if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });


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
        const updates = { ...req.body };

        // Prevent overwriting logoUrl with empty string
        if (!updates.logoUrl) {
            delete updates.logoUrl;
        }

        const settings = await GeneralSettings.findOneAndUpdate(
            {},
            updates,
            { upsert: true, new: true }
        );

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

// --- Upload Logo ---
router.post('/general/logo', upload.single('logo'), async (req, res) => {
    try {
        console.log("FILE:", req.file);   // 👈 ADD THIS
        console.log("BODY:", req.body);

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const logoUrl = `/uploads/${req.file.filename}`;

        const settings = await GeneralSettings.findOneAndUpdate(
            {},
            { logoUrl },
            { upsert: true, new: true }
        );
           console.log("DB Updated:", settings);   // optional but useful

        res.json({ logoUrl });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
