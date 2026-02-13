const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
    name: { type: String, required: true },
    company: { type: String, required: true },
    designation: { type: String, required: true },
    country: { type: String },
    yearJoined: { type: String },
    yearLeft: { type: String },
    photo: { type: String },
    bio: { type: String },
    linkedin: { type: String },
    achievements: { type: String },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Alumni', alumniSchema);
