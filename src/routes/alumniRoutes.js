const express = require('express');
const router = express.Router();
const Alumni = require('../models/Alumni');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/alumni';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for alumni photo uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `alumni-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// GET all alumni
router.get('/', async (req, res) => {
    try {
        const alumni = await Alumni.find().sort({ order: 1, createdAt: -1 });
        res.json(alumni);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new alumni
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        const data = { ...req.body };

        if (data.enabled !== undefined) {
            data.enabled = data.enabled === 'true' || data.enabled === true;
        }

        if (req.file) {
            data.photo = req.file.path.replace(/\\/g, '/');
        }

        const alumni = new Alumni(data);
        const newAlumni = await alumni.save();
        res.status(201).json(newAlumni.toObject());
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update alumni
router.put('/:id', upload.single('photo'), async (req, res) => {
    try {
        const data = { ...req.body };

        if (data.enabled !== undefined) {
            data.enabled = data.enabled === 'true' || data.enabled === true;
        }

        if (req.file) {
            data.photo = req.file.path.replace(/\\/g, '/');

            // Delete old photo if exists
            const oldAlumni = await Alumni.findById(req.params.id);
            if (oldAlumni && oldAlumni.photo && fs.existsSync(oldAlumni.photo) && !oldAlumni.photo.startsWith('http')) {
                fs.unlinkSync(oldAlumni.photo);
            }
        }

        const updatedAlumni = await Alumni.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!updatedAlumni) return res.status(404).json({ message: "Alumni not found" });

        res.json(updatedAlumni.toObject());
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE alumni
router.delete('/:id', async (req, res) => {
    try {
        const alumni = await Alumni.findById(req.params.id);
        if (alumni && alumni.photo && fs.existsSync(alumni.photo) && !alumni.photo.startsWith('http')) {
            fs.unlinkSync(alumni.photo);
        }
        await Alumni.findByIdAndDelete(req.params.id);
        res.json({ message: 'Alumni deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
