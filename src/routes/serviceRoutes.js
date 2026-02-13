const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

// GET all services
router.get("/", async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1 });
        res.json(services);
    } catch (err) {
        console.error("Error fetching services:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// CREATE service
router.post("/", async (req, res) => {
    try {
        const newService = new Service(req.body);
        await newService.save();
        res.json(newService);
    } catch (err) {
        console.error("Error creating service:", err);
        if (err.code === 11000) {
            return res.status(400).json({ message: "Slug must be unique" });
        }
        res.status(500).json({ message: err.message || "Server Error" });
    }
});

// UPDATE service
router.put("/:id", async (req, res) => {
    try {
        const updated = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        console.error("Error updating service:", err);
        res.status(500).json({ message: err.message || "Server Error" });
    }
});

// DELETE service
router.delete("/:id", async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
