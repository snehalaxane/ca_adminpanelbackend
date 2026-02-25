const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    publishDate: { type: Date, default: Date.now },
    category: { type: String, required: true },
    tags: [{ type: String }],
    content: { type: String, required: true },
    featuredImage: { type: String },
    enabled: { type: Boolean, default: true },
    author: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
