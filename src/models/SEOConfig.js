const mongoose = require('mongoose');

const seoConfigSchema = new mongoose.Schema({
    pageName: { type: String, required: true, unique: true },
    urlSlug: { type: String, required: true },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    keywords: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    indexPage: { type: Boolean, default: true },
    followLinks: { type: Boolean, default: true },
    includeInSitemap: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SEOConfig', seoConfigSchema);
