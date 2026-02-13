const mongoose = require("mongoose");

const historyMissionSchema = new mongoose.Schema({
    title: { type: String, default: "Our Mission" },
    content: { type: String, default: "" },
    enabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("HistoryMission", historyMissionSchema);
