const express = require("express");
const router = express.Router();
const NetworkingContent = require("../models/NetworkingContent");

// GET content
router.get("/", async (req, res) => {
    try {
        let content = await NetworkingContent.findOne();
        if (!content) {
            content = new NetworkingContent();
            await content.save();
        }
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// UPDATE content
router.put("/", async (req, res) => {
    try {
        let content = await NetworkingContent.findOne();
        if (content) {
            content = await NetworkingContent.findByIdAndUpdate(content._id, req.body, { new: true });
        } else {
            content = new NetworkingContent(req.body);
            await content.save();
        }
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
