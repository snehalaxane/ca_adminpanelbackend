const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/gallery';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for gallery image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `gallery-${Date.now()}${path.extname(file.originalname)}`);
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

// GET all gallery images
router.get('/', async (req, res) => {
    try {
        const images = await Gallery.find().sort({ order: 1, createdAt: -1 });
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new gallery image
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const data = { ...req.body };

        if (data.enabled !== undefined) {
            data.enabled = data.enabled === 'true' || data.enabled === true;
        }

        if (req.file) {
            data.url = req.file.path.replace(/\\/g, '/');
        }

        const image = new Gallery(data);
        const newImage = await image.save();
        res.status(201).json(newImage.toObject());
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update gallery image
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const data = { ...req.body };

        if (data.enabled !== undefined) {
            data.enabled = data.enabled === 'true' || data.enabled === true;
        }

        if (req.file) {
            data.url = req.file.path.replace(/\\/g, '/');

            // Delete old file if exists
            const oldImage = await Gallery.findById(req.params.id);
            if (oldImage && oldImage.url && fs.existsSync(oldImage.url) && !oldImage.url.startsWith('http')) {
                fs.unlinkSync(oldImage.url);
            }
        }

        const updatedImage = await Gallery.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!updatedImage) return res.status(404).json({ message: "Image not found" });

        res.json(updatedImage.toObject());
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE gallery image
router.delete('/:id', async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        if (image && image.url && fs.existsSync(image.url) && !image.url.startsWith('http')) {
            fs.unlinkSync(image.url);
        }
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ message: 'Image deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
