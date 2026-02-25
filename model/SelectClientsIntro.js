const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
    enabled: { type: Boolean, default: true }
});

const selectClientsIntroSchema = new mongoose.Schema({
    title: { type: String, default: "Select Clients" },
    subtitle: { type: String, default: "Serving clients across diverse industries with trust and commitment." },
    introTitle: { type: String, default: "Our Portfolio" },
    introDescription1: { type: String, default: "The Firm represents a diversified portfolio of clients across various sectors." },
    introDescription2: { type: String, default: "Our expertise spans multiple industries and we take pride in delivering customized solutions." },
    stats: [statSchema],
    introEnabled: { type: Boolean, default: true },
    statsEnabled: { type: Boolean, default: true },
    enabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("SelectClientsIntro", selectClientsIntroSchema);
