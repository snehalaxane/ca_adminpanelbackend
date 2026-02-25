const mongoose = require('mongoose');

const emailSettingsSchema = new mongoose.Schema({
    emailHost: { type: String },
    emailPort: { type: String },
    emailUser: { type: String },
    emailPassword: { type: String },
    emailFrom: { type: String },
    emailSecure: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('EmailSettings', emailSettingsSchema);
