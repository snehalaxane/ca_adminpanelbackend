const mongoose = require('mongoose');

const contactInquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    message: { type: String, required: true },
    additionalInfo: { type: Map, of: String, default: {} },
    subject: { type: String, default: 'General Inquiry' },
    status: { type: String, enum: ['New', 'Replied', 'Closed'], default: 'New' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ContactInquiry', contactInquirySchema);
