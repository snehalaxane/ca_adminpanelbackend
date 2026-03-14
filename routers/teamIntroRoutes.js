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
        const updateData = { ...req.body };
        
        // Update the document directly
        const updatedIntro = await TeamIntro.findOneAndUpdate(
            {}, 
            { $set: updateData }, 
            { upsert: true, new: true, runValidators: true }
        );

        console.log("Team Intro Updated Locally:", updatedIntro.accentText);
        res.json(updatedIntro);
    } catch (err) {
        console.error("Error updating Team Intro:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
