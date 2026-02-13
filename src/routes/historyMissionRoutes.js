const express = require("express");
const router = express.Router();
const HistoryMission = require("../models/HistoryMission");

// GET mission details
router.get("/", async (req, res) => {
    try {
        let mission = await HistoryMission.findOne();
        if (!mission) {
            mission = new HistoryMission();
            await mission.save();
        }
        res.json(mission);
    } catch (err) {
        console.error("Error fetching mission details:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// UPDATE mission details
router.put("/", async (req, res) => {
    try {
        let mission = await HistoryMission.findOne();
        if (mission) {
            mission = await HistoryMission.findByIdAndUpdate(mission._id, req.body, { new: true });
        } else {
            mission = new HistoryMission(req.body);
            await mission.save();
        }
        res.json(mission);
    } catch (err) {
        console.error("Error updating mission details:", err);
        res.status(500).json({ message: err.message || "Server Error" });
    }
});

module.exports = router;
