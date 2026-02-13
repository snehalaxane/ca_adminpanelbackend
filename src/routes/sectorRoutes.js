const express = require("express");
const router = express.Router();
const Sector = require("../models/Sector");

// GET all sectors
router.get("/", async (req, res) => {
    try {
        const sectors = await Sector.find().sort({ order: 1 });
        res.json(sectors);
    } catch (err) {
        console.error("Error fetching sectors:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// CREATE sector
router.post("/", async (req, res) => {
    try {
        const newSector = new Sector(req.body);
        await newSector.save();
        res.json(newSector);
    } catch (err) {
        console.error("Error creating sector:", err);
        res.status(500).json({ message: err.message || "Server Error" });
    }
});

// UPDATE sector
router.put("/:id", async (req, res) => {
    try {
        const updated = await Sector.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        console.error("Error updating sector:", err);
        res.status(500).json({ message: err.message || "Server Error" });
    }
});

// DELETE sector
router.delete("/:id", async (req, res) => {
    try {
        await Sector.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("Error deleting sector:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
