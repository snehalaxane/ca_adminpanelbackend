const express = require("express");
const NewsletterSubscription = require("../model/NewsletterSubscription");
const { createTransporter, getMailConfig } = require("../utils/mail");
const router = express.Router();

// Public: Subscribe to newsletter
router.post("/subscribe", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Save to DB
        const subscription = await NewsletterSubscription.create({
            name,
            email,
            message
        });

        // Send Email via SMTP
        try {
            const transporter = await createTransporter();
            const config = await getMailConfig();

            const mailOptions = {
                from: `"${config.from}" <${config.user}>`,
                to: email,
                subject: "Thank you for subscribing to our Newsletter",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                        <h2 style="color: #022683; text-align: center;">Welcome to Our Newsletter!</h2>
                        <p>Hi ${name || 'there'},</p>
                        <p>Thank you for subscribing to the Raju & Prasad newsletter. We are excited to have you on board!</p>
                        <p>You will now receive the latest updates, industry insights, and professional news directly in your inbox.</p>
                        ${message ? `<p><strong>Your Message:</strong> ${message}</p>` : ''}
                        <br>
                        <p>Warm regards,</p>
                        <p><strong>The Raju & Prasad Team</strong></p>
                        <hr style="border: 0; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #888; text-align: center;">You are receiving this email because you subscribed on our website. To unsubscribe, please contact us.</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);

            // Also notify admin
            const adminMailOptions = {
                from: `"${config.from}" <${config.user}>`,
                to: config.user,
                subject: "New Newsletter Subscription",
                html: `
                    <h3>New Newsletter Subscription</h3>
                    <p><strong>Name:</strong> ${name || 'N/A'}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong> ${message || 'N/A'}</p>
                `
            };
            await transporter.sendMail(adminMailOptions);

        } catch (mailError) {
            console.error("[NEWSLETTER] Mail sending failed:", mailError.message);
            // We still return success because the subscription was saved to DB
        }

        res.json({ success: true, message: "Subscribed successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
