const mongoose = require("mongoose");

const subServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    enabled: { type: Boolean, default: true }
});

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    icon: { type: String, default: '📌' },
    shortDescription: { type: String, required: true },
    detailedDescription: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    enabled: { type: Boolean, default: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
    image: { type: String },
    subServices: [subServiceSchema],
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
