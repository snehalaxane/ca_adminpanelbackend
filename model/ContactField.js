const mongoose = require('mongoose');

const contactFieldSchema = new mongoose.Schema({
    label: { type: String, required: true },
    fieldType: { type: String, default: 'text' },
    required: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    placeholder: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactField', contactFieldSchema);
