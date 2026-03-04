const express = require("express");
const router = express.Router();
const NewsletterIntro = require("../model/NewsletterIntro");

// GET newsletter intro
router.get("/", async (req, res) => {
    try {
        let intro = await NewsletterIntro.findOne();
        if (!intro) {
            intro = new NewsletterIntro({
                title: "Newsletters",
                subtitle: "Stay updated with our latest industry insights and firm news.",
                enabled: true
            });
            await intro.save();
        }
        res.json(intro);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE newsletter intro
router.put("/", async (req, res) => {
    try {
        const { title, subtitle, enabled, backgroundImage } = req.body;
        const intro = await NewsletterIntro.findOneAndUpdate(
            {},
            { title, subtitle, enabled, backgroundImage },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(intro);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
