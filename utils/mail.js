const nodemailer = require('nodemailer');
const EmailSettings = require('../model/EmailSettings');

/**
 * Creates a Nodemailer transporter using settings from the database.
 * If no settings are found or they are incomplete, it will attempt to use fallback values.
 */
const createTransporter = async () => {
    try {
        const settings = await EmailSettings.findOne();

        if (!settings || !settings.emailHost || !settings.emailUser || !settings.emailPassword) {
            const errorMsg = "[MAIL ERROR] SMTP settings are not fully configured in the Admin Panel (Settings > Email). Please provide Host, User, and Password.";
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        return nodemailer.createTransport({
            host: settings.emailHost,
            port: settings.emailPort || 587,
            secure: settings.emailSecure === true,
            auth: {
                user: settings.emailUser,
                pass: settings.emailPassword,
            },
        });
    } catch (error) {
        console.error("[MAIL] Error creating transporter:", error.message);
        throw error;
    }
};

/**
 * Fetches the sender name/email address from settings
 */
const getMailConfig = async () => {
    const settings = await EmailSettings.findOne();
    if (!settings) {
        return { from: "Raju & Prasad", user: "" };
    }
    return {
        from: settings.emailFrom || "Raju & Prasad",
        user: settings.emailUser || ""
    };
};

module.exports = { createTransporter, getMailConfig };
