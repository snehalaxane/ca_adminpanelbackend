const express = require("express");
const router = express.Router();
const SelectClientsIntro = require("../model/SelectClientsIntro");

// GET intro details
router.get("/", async (req, res) => {
    try {
        let intro = await SelectClientsIntro.findOne();
        if (!intro) {
            intro = new SelectClientsIntro({
                stats: [
                    { label: "Industry Sectors", value: "7" },
                    { label: "Service Categories", value: "76+" },
                    { label: "Years of Trust", value: "46+" }
                ]
            });
            await intro.save();
        }
        res.json(intro);
    } catch (err) {
        console.error("Error fetching select clients intro:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// UPDATE intro details
router.put("/", async (req, res) => {
    try {
        let intro = await SelectClientsIntro.findOne();
        if (intro) {
            intro = await SelectClientsIntro.findByIdAndUpdate(intro._id, req.body, { new: true });
        } else {
            intro = new SelectClientsIntro(req.body);
            await intro.save();
        }
        res.json(intro);
    } catch (err) {
        console.error("Error updating select clients intro:", err);
        res.status(500).json({ message: err.message || "Server Error" });
    }
});

module.exports = router;
