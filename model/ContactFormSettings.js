const mongoose = require('mongoose');

const contactFormSettingsSchema = new mongoose.Schema({
  heading: { type: String, },
  subheading: { type: String, },
  callNow: { type: String, },
  emailUs: { type: String, },
  enabled: { type: Boolean, default: true },
  // Persistable dynamic form fields for the contact form
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

module.exports = mongoose.model('ContactFormSettings', contactFormSettingsSchema);
