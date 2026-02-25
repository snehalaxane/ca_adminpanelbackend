const express = require("express");
const router = express.Router();
const TeamIntro = require("../model/TeamIntro");

// GET team intro
router.get("/", async (req, res) => {
    try {
        let intro = await TeamIntro.findOne();
        if (!intro) {
            intro = new TeamIntro();
            await intro.save();
        }
        res.json(intro);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// UPDATE team intro
router.put("/", async (req, res) => {
    try {
        let intro = await TeamIntro.findOne();
        if (!intro) {
            intro = new TeamIntro(req.body);
        } else {
            Object.assign(intro, req.body);
        }
        await intro.save();
        res.json(intro);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
