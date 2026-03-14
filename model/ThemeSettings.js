const mongoose = require('mongoose');

const themeSettingsSchema = new mongoose.Schema({
    primaryColor: { type: String, default: '#002855' },
    secondaryColor: { type: String, default: '#888888' },
    backgroundColor: { type: String, default: '#D1D5DB' }
}, { timestamps: true });

module.exports = mongoose.model('ThemeSettings', themeSettingsSchema);
