const express = require("express");
const router = express.Router();
const HistoryJourney = require("../models/HistoryJourney");

// GET journey details
router.get("/", async (req, res) => {
    try {
        let journey = await HistoryJourney.findOne();
        if (!journey) {
            journey = new HistoryJourney();
            await journey.save();
        }
        res.json(journey);
    } catch (err) {
        console.error("Error fetching journey details:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// UPDATE journey details
router.put("/", async (req, res) => {
    try {
        let journey = await HistoryJourney.findOne();
        if (journey) {
            journey = await HistoryJourney.findByIdAndUpdate(journey._id, req.body, { new: true });
        } else {
            journey = new HistoryJourney(req.body);
            await journey.save();
        }
        res.json(journey);
    } catch (err) {
        console.error("Error updating journey details:", err);
        res.status(500).json({ message: err.message || "Server Error" });
    }
});

module.exports = router;
