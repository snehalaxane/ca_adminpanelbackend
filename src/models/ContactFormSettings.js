const mongoose = require('mongoose');

const contactFormSettingsSchema = new mongoose.Schema({
  heading: { type: String, default: 'Get in Touch' },
  subheading: { type: String, default: 'We would love to hear from you. Send us a message and we will respond as soon as possible.' },
  callNow: { type: String, default: '+91 40 2331 6023' },
  emailUs: { type: String, default: 'info@rajuprasad.com' },
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
