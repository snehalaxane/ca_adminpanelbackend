const mongoose = require('mongoose');

const seoConfigSchema = new mongoose.Schema({
    pageName: { type: String, required: true, unique: true },
    urlSlug: { type: String, required: true },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    keywords: {
  type: [String],
  default: []
},

}, { timestamps: true });

module.exports = mongoose.model('SEOConfig', seoConfigSchema);
