const mongoose = require("mongoose");

const subServiceSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    content: { type: String, required: true },
    icon: { type: String, default: 'CheckCircle2' },
    enabled: { type: Boolean, default: true }
});

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String }, // Used as the main heading in the details panel
    category: { type: String, required: true }, // e.g., 'Core Services', 'Advisory Services'
    icon: { type: String, default: 'FileCheck' },
    shortDescription: { type: String, required: true },
    detailedDescription: { type: String },
    slug: { type: String, required: true, unique: true },
    enabled: { type: Boolean, default: true },
    subServices: [subServiceSchema],
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
