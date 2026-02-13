const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
    month: { type: String, required: true },
    year: { type: String, required: true },
    title: { type: String, required: true },
    industryReview: { type: String },
    otherContents: { type: String },
    pdfFile: { type: String }, // Path to uploaded PDF
    enabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Newsletter", newsletterSchema);
