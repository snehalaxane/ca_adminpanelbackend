const mongoose = require('mongoose');

const legalPageSchema = new mongoose.Schema({
    pageTitle: { type: String, required: true },
    pageSlug: { type: String, required: true, unique: true },
    content: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    lastUpdated: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

module.exports = mongoose.model('LegalPage', legalPageSchema);
