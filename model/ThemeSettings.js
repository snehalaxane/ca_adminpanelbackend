const mongoose = require('mongoose');

const themeSettingsSchema = new mongoose.Schema({
    primaryColor: { type: String, default: '#022683' },
    secondaryColor: { type: String, default: '#888888' }
}, { timestamps: true });

module.exports = mongoose.model('ThemeSettings', themeSettingsSchema);
