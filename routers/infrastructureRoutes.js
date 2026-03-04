const express = require("express");
const Infrastructure = require("../model/Infrastructure");
const adminAuth = require("../middleware/middleware");
const router = express.Router();

// GET Infrastructure
router.get("/", async (req, res) => {
    try {
        let infra = await Infrastructure.findOne();
        if (!infra) {
            infra = await Infrastructure.create({
                title: "Infrastructure",
                description: "All the offices of the firm are adequately equipped with modern furniture & fixtures, advanced data processing equipments, secured storage networks, firewalls, high-speed communication facilities and an exhaustive library containing professional books, articles, publications, and journals necessary for the profession."
            });
        }
        res.json(infra);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// UPDATE Infrastructure
router.put("/", adminAuth, async (req, res) => {
    try {
        const infra = await Infrastructure.findOneAndUpdate(
            {},
            { $set: req.body },
            { new: true, upsert: true }
        );
        res.json({ success: true, infra });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
