const mongoose = require("mongoose");

const infrastructureSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, default: "Infrastructure" },
        description: { type: String, default: "" },
        enabled: { type: Boolean, default: true },
        // Contact side details (Head Office specifically for this section)
        contactTitle: { type: String, default: "Contact Us" },
        officeName: { type: String, default: "Head Office" },
        address: { type: String, default: "" },
        phone1: { type: String, default: "" },
        phone2: { type: String, default: "" },
        email: { type: String, default: "" },
        website: { type: String, default: "" },
        fax: { type: String, default: "" },
        // Newsletter side details
        newsletterTitle: { type: String, default: "Newsletter" },
        newsletterSubtitle: { type: String, default: "Subscribe to our Newsletter" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Infrastructure", infrastructureSchema);
