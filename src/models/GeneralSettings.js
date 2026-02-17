const mongoose = require('mongoose');

const generalSettingsSchema = new mongoose.Schema({
    websiteStatus: { type: String, default: 'Live' },
    siteName: { type: String, default: 'Raju & Prasad – Chartered Accountants' },
    tagline: { type: String, default: 'Excellence in Financial Services' },
    maintenanceMode: { type: Boolean, default: false },
      logoUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('GeneralSettings', generalSettingsSchema);
