const mongoose = require('mongoose');

const contactSettingsSchema = new mongoose.Schema({
    pageTitle: { type: String },
    pageSubtitle: { type: String },
    heading: { type: String },
    subheading: { type: String },
    callNow: { type: String },
    emailUs: { type: String },
    backgroundImage: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
    formFields: [
        {
            label: { type: String, default: '' },
            fieldType: { type: String, default: 'text' },
            required: { type: Boolean, default: false },
            enabled: { type: Boolean, default: true },
            order: { type: Number, default: 0 },
            placeholder: { type: String, default: '' },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactSettings', contactSettingsSchema);
