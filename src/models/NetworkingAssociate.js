const mongoose = require("mongoose");

const networkingAssociateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, default: "Building2" },
    enabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("NetworkingAssociate", networkingAssociateSchema);
