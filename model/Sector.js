const mongoose = require("mongoose");

const industrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    enabled: { type: Boolean, default: true }
});

const sectorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, default: 'Factory' },
    color: { type: String, default: '#022683' },
    enabled: { type: Boolean, default: true },
    industries: [industrySchema],
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Sector", sectorSchema);
