const express = require("express");
const router = express.Router();
const BlogIntro = require("../model/BlogIntro");

// GET blog intro
router.get("/", async (req, res) => {
    try {
        let intro = await BlogIntro.findOne();
        if (!intro) {
            intro = new BlogIntro({
                title: "Our Blog",
                subtitle: "Stay updated with the latest trends, insights, and news from the industry.",
                enabled: true
            });
            await intro.save();
        }
        res.json(intro);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE blog intro
router.put("/", async (req, res) => {
    try {
        const { title, subtitle, enabled } = req.body;
        const intro = await BlogIntro.findOneAndUpdate(
            {},
            { title, subtitle, enabled },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(intro);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
