const mongoose = require("mongoose");

const footerSectionSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        links: [
            {
                label: { type: String, required: true },
                href: { type: String, required: true }
            }
        ],
        enabled: { type: Boolean, default: true },
        order: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("FooterSection", footerSectionSchema);
