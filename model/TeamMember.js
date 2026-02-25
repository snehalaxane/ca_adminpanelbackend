const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    city: { type: String, required: true },
    bio: { type: String, required: true },
    photo: { type: String, default: '' },
    showOnHome: { type: Boolean, default: false },
    showOnTeam: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("TeamMember", teamMemberSchema);
