const mongoose = require("mongoose");

const newsletterSubscriptionSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, required: true },
        message: { type: String },
        status: { type: String, default: "active" } // active, unsubscribed
    },
    { timestamps: true }
);

module.exports = mongoose.model("NewsletterSubscription", newsletterSubscriptionSchema);
