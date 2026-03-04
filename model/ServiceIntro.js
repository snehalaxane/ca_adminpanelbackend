const mongoose = require("mongoose");

const serviceIntroSchema = new mongoose.Schema({
    title: { type: String, default: "Services" },
    subtitle: { type: String, default: "We deliver professional services with commitment, competence and clarity." },
    introDescription: { type: String, default: "The Firm provides Audit & Assurance, Tax Consultancy and Advisory services..." },
    ctaTitle: { type: String, default: "Need professional advisory services?" },
    ctaSubtitle: { type: String, default: "Our team of experts is ready to provide customized solutions for your business" },
    introEnabled: { type: Boolean, default: true },
    ctaEnabled: { type: Boolean, default: true },
    backgroundImage: { type: String, default: "" },
    enabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("ServiceIntro", serviceIntroSchema);
