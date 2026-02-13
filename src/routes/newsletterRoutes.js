const express = require("express");
const router = express.Router();
const Newsletter = require("../models/Newsletter");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = "./uploads/newsletters/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `newsletter-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed!"));
        }
    }
});

// GET all newsletters
router.get("/", async (req, res) => {
    try {
        const newsletters = await Newsletter.find().sort({ year: -1, createdAt: -1 });
        res.json(newsletters);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// CREATE newsletter
router.post("/", upload.single("pdfFile"), async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) {
            data.pdfFile = req.file.path.replace(/\\/g, "/");
        }
        const newsletter = new Newsletter(data);
        await newsletter.save();
        res.json(newsletter);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE newsletter
router.put("/:id", upload.single("pdfFile"), async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) {
            data.pdfFile = req.file.path.replace(/\\/g, "/");
        }
        const updated = await Newsletter.findByIdAndUpdate(req.params.id, data, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE newsletter
router.delete("/:id", async (req, res) => {
    try {
        const newsletter = await Newsletter.findById(req.params.id);
        if (newsletter && newsletter.pdfFile) {
            if (fs.existsSync(newsletter.pdfFile)) {
                fs.unlinkSync(newsletter.pdfFile);
            }
        }
        await Newsletter.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
