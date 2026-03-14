const express = require("express");
const router = express.Router();
const NewsTicker = require("../model/NewsTicker");

// Get all news ticker items
router.get("/", async (req, res) => {
    try {
        const items = await NewsTicker.find().sort({ order: 1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new news ticker item
router.post("/", async (req, res) => {
    const item = new NewsTicker({
        content: req.body.content,
        enabled: req.body.enabled,
        order: req.body.order || 0
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a news ticker item
router.put("/:id", async (req, res) => {
    try {
        const updatedItem = await NewsTicker.findByIdAndUpdate(
            req.params.id,
            {
                content: req.body.content,
                enabled: req.body.enabled,
                order: req.body.order
            },
            { new: true }
        );
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a news ticker item
router.delete("/:id", async (req, res) => {
    try {
        await NewsTicker.findByIdAndDelete(req.params.id);
        res.json({ message: "News ticker item deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
