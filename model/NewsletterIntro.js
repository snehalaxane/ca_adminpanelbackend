const mongoose = require("mongoose");

const newsletterIntroSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        subtitle: { type: String },
        enabled: { type: Boolean, default: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("NewsletterIntro", newsletterIntroSchema);
