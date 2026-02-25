const express = require("express");
const router = express.Router();
const ServiceIntro = require("../model/ServiceIntro");

// GET intro
router.get("/", async (req, res) => {
    try {
        let intro = await ServiceIntro.findOne();
        if (!intro) {
            intro = new ServiceIntro();
            await intro.save();
        }
        res.json(intro);
    } catch (err) {
        console.error("Error fetching service intro:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// UPDATE intro
router.put("/", async (req, res) => {
    try {
        let intro = await ServiceIntro.findOne();
        if (!intro) {
            intro = new ServiceIntro(req.body);
        } else {
            Object.assign(intro, req.body);
        }
        await intro.save();
        res.json(intro);
    } catch (err) {
        console.error("Error updating service intro:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
