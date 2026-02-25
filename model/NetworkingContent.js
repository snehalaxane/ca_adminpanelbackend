const mongoose = require("mongoose");

const networkingContentSchema = new mongoose.Schema({
    pageTitle: { type: String, default: "Networking" },
    pageSubtitle: { type: String, default: "Connect with us to expand professional collaboration across India." },
    title: { type: String, default: "Domestic Networking" },
    description: { type: String, default: "" },
    icon: { type: String, default: "Network" },
    enabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("NetworkingContent", networkingContentSchema);
