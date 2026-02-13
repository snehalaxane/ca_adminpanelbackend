const express = require("express");
const router = express.Router();
const TeamMember = require("../models/TeamMember");

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
router.post("/", async (req, res) => {
    try {
        const newMember = new TeamMember(req.body);
        await newMember.save();
        res.json(newMember);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// UPDATE team member
router.put("/:id", async (req, res) => {
    try {
        const updated = await TeamMember.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
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
