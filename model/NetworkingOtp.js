const mongoose = require('mongoose');

const networkingOtpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false }
}, { timestamps: true });

// Auto-delete expired OTPs
networkingOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('NetworkingOtp', networkingOtpSchema);
