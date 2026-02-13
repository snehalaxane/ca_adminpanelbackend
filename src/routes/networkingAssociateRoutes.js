const express = require("express");
const router = express.Router();
const NetworkingAssociate = require("../models/NetworkingAssociate");

// GET all associates
router.get("/", async (req, res) => {
    try {
        const associates = await NetworkingAssociate.find();
        res.json(associates);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ADD associate
router.post("/", async (req, res) => {
    try {
        const newAssociate = new NetworkingAssociate(req.body);
        await newAssociate.save();
        res.json(newAssociate);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE associate
router.put("/:id", async (req, res) => {
    try {
        const updated = await NetworkingAssociate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE associate
router.delete("/:id", async (req, res) => {
    try {
        await NetworkingAssociate.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
