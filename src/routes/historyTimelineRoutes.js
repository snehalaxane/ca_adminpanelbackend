const express = require("express");
const router = express.Router();
const HistoryTimeline = require("../models/HistoryTimeline");

// GET all timeline events
router.get("/", async (req, res) => {
    try {
        const events = await HistoryTimeline.find().sort({ order: 1 });
        res.json(events);
    } catch (err) {
        console.error("Error fetching timeline events:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// CREATE timeline event
router.post("/", async (req, res) => {
    try {
        const newEvent = new HistoryTimeline(req.body);
        await newEvent.save();
        res.json(newEvent);
    } catch (err) {
        console.error("Error creating timeline event:", err);
        res.status(500).json({ message: err.message || "Server Error" });
    }
});

// UPDATE timeline event
router.put("/:id", async (req, res) => {
    try {
        const updated = await HistoryTimeline.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        console.error("Error updating timeline event:", err);
        res.status(500).json({ message: err.message || "Server Error" });
    }
});

// DELETE timeline event
router.delete("/:id", async (req, res) => {
    try {
        await HistoryTimeline.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("Error deleting timeline event:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
