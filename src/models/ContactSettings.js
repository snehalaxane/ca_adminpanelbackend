const mongoose = require('mongoose');

const contactSettingsSchema = new mongoose.Schema({
    heading: { type: String, default: 'Get in Touch' },
    subheading: { type: String, default: 'We would love to hear from you. Send us a message and we will respond as soon as possible.' },
    callNow: { type: String, default: '+91 40 2331 6023' },
    emailUs: { type: String, default: 'info@rajuprasad.com' },
    enabled: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactSettings', contactSettingsSchema);
