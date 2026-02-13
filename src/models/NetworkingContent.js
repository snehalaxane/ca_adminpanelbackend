const mongoose = require("mongoose");

const networkingContentSchema = new mongoose.Schema({
    title: { type: String, default: "Domestic Networking" },
    description: { type: String, default: "" },
    icon: { type: String, default: "Network" },
    enabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("NetworkingContent", networkingContentSchema);
