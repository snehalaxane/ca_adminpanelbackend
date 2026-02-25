const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: { type: String },
    url: { type: String },
    category: { type: String },
    year: { type: String },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    heading: { type: String },
    subheading: { type: String },
    isIntro: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
