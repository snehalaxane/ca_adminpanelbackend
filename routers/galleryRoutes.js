const express = require('express');
const router = express.Router();
const Gallery = require('../model/Gallery');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads', 'gallery');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Now points to absolute path
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
        const images = await Gallery.find({ isIntro: { $ne: true } }).sort({ order: 1, createdAt: -1 });
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
            // Store 'uploads/gallery/filename.jpg' instead of the full system path
            data.url = `uploads/gallery/${req.file.filename}`;
        }

        const image = new Gallery(data);
        const newImage = await image.save();
        res.status(201).json(newImage.toObject());
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET gallery intro
router.get('/intro', async (req, res) => {
    try {
        let intro = await Gallery.findOne({ isIntro: true });
        if (!intro) {
            intro = new Gallery({
                isIntro: true,
                heading: 'Our Gallery',
                subheading: 'Capturing moments from our legacy of excellence across India.',
                title: 'Gallery Header',
                category: 'System',
                year: 'System',
                url: 'none'
            });
            await intro.save();
        }
        res.json(intro);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT update gallery intro
router.put('/intro', async (req, res) => {
    try {
        const { heading, subheading } = req.body;
        const updatedIntro = await Gallery.findOneAndUpdate(
            { isIntro: true },
            {
                $set: {
                    heading,
                    subheading,
                    isIntro: true,
                    title: 'Gallery Header', // Just for clarity in DB
                    category: 'System',
                    year: 'System',
                    url: 'none'
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(updatedIntro);
    } catch (err) {
        console.error('Error updating gallery intro:', err);
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
            // Store 'uploads/gallery/filename.jpg' instead of the full system path
            data.url = `uploads/gallery/${req.file.filename}`;


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
