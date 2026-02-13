const express = require("express");
const router = express.Router();
const NetworkingSubmission = require("../models/NetworkingSubmission");
const multer = require("multer");
const path = require("path");

// Multer config for file uploads
const storage = multer.diskStorage({
    destination: "./uploads/networking/",
    filename: (req, file, cb) => {
        cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb("Error: Only PDF/DOC/DOCX files allowed!");
    }
});

// GET all submissions
router.get("/", async (req, res) => {
    try {
        const submissions = await NetworkingSubmission.find().sort({ createdAt: -1 });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// POST submission (Public form)
router.post("/", upload.single("profileFile"), async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) data.profileFile = req.file.path;
        const submission = new NetworkingSubmission(data);
        await submission.save();
        res.json(submission);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE submission status
router.put("/:id", async (req, res) => {
    try {
        const updated = await NetworkingSubmission.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE submission
router.delete("/:id", async (req, res) => {
    try {
        await NetworkingSubmission.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
