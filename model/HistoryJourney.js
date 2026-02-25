const mongoose = require("mongoose");

const historyJourneySchema = new mongoose.Schema({
    sinceYear: { type: String, default: "1979" },
    title: { type: String, default: "Our Journey Since 1979" },
    description: { type: String, default: "" },
    yearsOfService: { type: String, default: "46+" },
    activeLocations: { type: String, default: "7" }
}, { timestamps: true });

module.exports = mongoose.model("HistoryJourney", historyJourneySchema);
