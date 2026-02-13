const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists at top level
const uploadDir = 'uploads/blogs';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for featured image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
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

// GET all active/all blog posts
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ publishDate: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new blog post
router.post('/', upload.single('featuredImage'), async (req, res) => {
    console.log("POST /api/blogs called");
    console.log("req.body:", JSON.stringify(req.body, null, 2));
    if (req.file) console.log("req.file:", req.file);
    try {
        const { title, shortDescription, publishDate, category, tags, content, enabled, author } = req.body;

        let parsedTags = tags;
        if (typeof tags === 'string') {
            try {
                parsedTags = JSON.parse(tags);
            } catch (e) {
                parsedTags = tags.split(',').map(t => t.trim());
            }
        }

        const blog = new Blog({
            title,
            shortDescription,
            publishDate: publishDate || new Date(),
            category,
            tags: parsedTags,
            content,
            featuredImage: req.file ? req.file.path.replace(/\\/g, '/') : (req.body.featuredImage || undefined),
            enabled: enabled === 'true' || enabled === true,
            author
        });

        const newBlog = await blog.save();
        console.log("Blog post saved with ID:", newBlog._id);
        res.status(201).json(newBlog.toObject());
    } catch (err) {
        console.error("Error in POST /api/blogs:", err);
        res.status(400).json({ message: err.message });
    }
});

// PUT update blog post
router.put('/:id', upload.single('featuredImage'), async (req, res) => {
    console.log("PUT /api/blogs called for ID:", req.params.id);
    console.log("req.body:", JSON.stringify(req.body, null, 2));
    if (req.file) console.log("req.file:", req.file.path);

    try {
        const { title, shortDescription, publishDate, category, tags, content, enabled, author } = req.body;

        let parsedTags = tags;
        if (typeof tags === 'string') {
            try {
                parsedTags = JSON.parse(tags);
            } catch (e) {
                parsedTags = tags.split(',').map(t => t.trim());
            }
        }

        const updateData = {
            title,
            shortDescription,
            publishDate,
            category,
            tags: parsedTags,
            content,
            enabled: enabled === 'true' || enabled === true,
            author,
            featuredImage: req.file ? req.file.path.replace(/\\/g, '/') : req.body.featuredImage
        };

        if (req.file) {
            // Optional: Delete old image
            const oldBlog = await Blog.findById(req.params.id);
            if (oldBlog && oldBlog.featuredImage && fs.existsSync(oldBlog.featuredImage) && !oldBlog.featuredImage.startsWith('http')) {
                fs.unlinkSync(oldBlog.featuredImage);
            }
        }

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
        console.log("Blog post updated successfully");
        res.json(updatedBlog.toObject());
    } catch (err) {
        console.error("Error in PUT /api/blogs:", err);
        res.status(400).json({ message: err.message });
    }
});

// DELETE blog post
router.delete('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog && blog.featuredImage && fs.existsSync(blog.featuredImage)) {
            fs.unlinkSync(blog.featuredImage);
        }
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
