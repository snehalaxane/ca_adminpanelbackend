const mongoose = require("mongoose");

const networkingSubmissionSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    organisation: { type: String },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    profileFile: { type: String }, // Path to uploaded PDF/DOC/DOCX
    submissionDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Replied'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model("NetworkingSubmission", networkingSubmissionSchema);
