const express = require("express");
const router = express.Router();
const AlumniIntro = require("../model/AlumniIntro");

// GET alumni intro
router.get("/", async (req, res) => {
    try {
        let intro = await AlumniIntro.findOne();
        if (!intro) {
            intro = new AlumniIntro({
                title: "Our Alumni",
                subtitle: "Celebrating the achievements and journeys of our former members.",
                enabled: true
            });
            await intro.save();
        }
        res.json(intro);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE alumni intro
router.put("/", async (req, res) => {
    try {
        const { title, subtitle, enabled, backgroundImage } = req.body;
        const intro = await AlumniIntro.findOneAndUpdate(
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
