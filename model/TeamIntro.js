const mongoose = require("mongoose");

const teamIntroSchema = new mongoose.Schema({
    title: { type: String, default: "The Team" },
    description: { type: String, default: "Meet our experienced & dedicated Chartered Accountant professionals" },
    enabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("TeamIntro", teamIntroSchema);
