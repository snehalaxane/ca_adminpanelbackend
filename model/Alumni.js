const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
    name: { type: String, required: true },
    company: { type: String, required: true },
    designation: { type: String, required: true },
    industry: { type: String },
    image: { type: String },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Alumni', alumniSchema);
