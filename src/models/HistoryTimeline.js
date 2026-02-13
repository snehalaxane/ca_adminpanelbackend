const mongoose = require("mongoose");

const historyTimelineSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    year: { type: String, required: true },
    tag: { type: String },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("HistoryTimeline", historyTimelineSchema);
