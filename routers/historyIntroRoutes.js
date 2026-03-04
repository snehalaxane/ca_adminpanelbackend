const express = require("express");
const router = express.Router();
const HistoryIntro = require("../model/HistoryIntro");

// GET history intro
router.get("/", async (req, res) => {
    try {
        let intro = await HistoryIntro.findOne();
        if (!intro) {
            intro = new HistoryIntro();
            await intro.save();
        }
        res.json(intro);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// UPDATE history intro
router.put("/", async (req, res) => {
    try {
        let intro = await HistoryIntro.findOne();
        if (!intro) {
            intro = new HistoryIntro(req.body);
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
