const mongoose = require("mongoose");

const mapLocationSchema = new mongoose.Schema({
    city: { type: String, required: true },
    state: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    pinColor: { type: String, default: '#022683' },
    tooltip: { type: String, required: true },
    address: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("MapLocation", mapLocationSchema);
