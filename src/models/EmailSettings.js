const mongoose = require('mongoose');

const emailSettingsSchema = new mongoose.Schema({
    emailHost: { type: String, default: 'smtp.gmail.com' },
    emailPort: { type: String, default: '587' },
    emailUser: { type: String, default: 'notifications@rajuprasad.com' },
    emailFrom: { type: String, default: 'Raju & Prasad' }
}, { timestamps: true });

module.exports = mongoose.model('EmailSettings', emailSettingsSchema);
