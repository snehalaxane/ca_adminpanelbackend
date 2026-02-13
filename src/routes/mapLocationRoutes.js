const express = require("express");
const router = express.Router();
const MapLocation = require("../models/MapLocation");

// GET all locations
router.get("/", async (req, res) => {
    try {
        const locations = await MapLocation.find().sort({ order: 1 });
        res.json(locations);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// CREATE location
router.post("/", async (req, res) => {
    try {
        const newLocation = new MapLocation(req.body);
        await newLocation.save();
        res.json(newLocation);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// UPDATE location
router.put("/:id", async (req, res) => {
    try {
        const updated = await MapLocation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE location
router.delete("/:id", async (req, res) => {
    try {
        await MapLocation.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
