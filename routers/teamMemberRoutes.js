const express = require("express");
const router = express.Router();
const TeamMember = require("../model/TeamMember");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "..", "uploads", "team");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// GET all team members
router.get("/", async (req, res) => {
    try {
        const members = await TeamMember.find().sort({ order: 1 });
        res.json(members);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// CREATE team member
router.post("/", upload.single("photo_file"), async (req, res) => {
    try {
        const memberData = { ...req.body };

        // If file uploaded, use the path
        if (req.file) {
            memberData.photo = `uploads/team/${req.file.filename}`;
        }

        const newMember = new TeamMember(memberData);
        await newMember.save();
        res.json(newMember);
    } catch (err) {
        console.error("Error creating team member:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// UPDATE team member
router.put("/:id", upload.single("photo_file"), async (req, res) => {
    try {
        const updateData = { ...req.body };

        // If file uploaded, update photo path
        if (req.file) {
            updateData.photo = `uploads/team/${req.file.filename}`;
        }

        const updated = await TeamMember.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        console.error("Error updating team member:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE team member
router.delete("/:id", async (req, res) => {
    try {
        await TeamMember.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
