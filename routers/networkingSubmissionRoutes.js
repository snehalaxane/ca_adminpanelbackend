const express = require("express");
const router = express.Router();
const NetworkingSubmission = require("../model/NetworkingSubmission");
const NetworkingOtp = require("../model/NetworkingOtp");
const GeneralSettings = require("../model/GeneralSettings");
const multer = require("multer");
const path = require("path");
const { createTransporter, getMailConfig } = require("../utils/mail");

// Multer config for file uploads
const storage = multer.diskStorage({
    destination: "./uploads/networking/",
    filename: (req, file, cb) => {
        cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname) return cb(null, true);
        cb(new Error("Error: Only PDF and DOC files are allowed!"));
    }
});

// ---------------- SEND OTP ----------------
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await NetworkingOtp.findOneAndUpdate(
            { email: email.toLowerCase() },
            { otp, expiresAt, verified: false },
            { upsert: true, new: true }
        );

        const transporter = await createTransporter();
        const mailConfig = await getMailConfig();

        const genSettings = await GeneralSettings.findOne() || {};
        const siteLogo = genSettings.logoUrl
            ? (genSettings.logoUrl.startsWith('http') ? genSettings.logoUrl : `${req.protocol}://${req.get('host')}${genSettings.logoUrl}`)
            : '';
        const siteName = genSettings.siteName || mailConfig.from;

        const mailOptions = {
            from: `"${siteName}" <${mailConfig.user}>`,
            to: email,
            subject: "Verification Code for Networking Inquiry",
            html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; color: #333;">
          ${siteLogo ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${siteLogo}" alt="${siteName}" style="max-height: 50px; object-fit: contain;"></div>` : ''}
          <h2 style="color: #022683; text-align: center;">Verification Code</h2>
          <p style="text-align: center; color: #666;">Use the following code to verify your identity for the networking inquiry.</p>
          <div style="background: #f4f6f9; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #022683;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #999; text-align: center;">This code expires in 5 minutes.</p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "OTP sent successfully" });
    } catch (err) {
        console.error("Networking OTP Error:", err);
        res.status(500).json({ message: "Failed to send verification code" });
    }
});

// ---------------- VERIFY OTP ----------------
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    try {
        const record = await NetworkingOtp.findOne({
            email: email.toLowerCase(),
            otp,
            expiresAt: { $gt: new Date() }
        });

        if (!record) {
            return res.status(400).json({ message: "Invalid or expired verification code" });
        }

        record.verified = true;
        await record.save();

        res.json({ success: true, message: "Email verified successfully" });
    } catch (err) {
        res.status(500).json({ message: "Verification failed" });
    }
});

// GET all submissions
router.get("/", async (req, res) => {
    try {
        const submissions = await NetworkingSubmission.find().sort({ createdAt: -1 });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// POST submission (Public form)
router.post("/", upload.single("profileFile"), async (req, res) => {
    try {
        const { fullName, email, mobile, organisation } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });

        // Check if verified
        const otpRecord = await NetworkingOtp.findOne({ email: email.toLowerCase(), verified: true });
        if (!otpRecord) {
            return res.status(403).json({ message: "Please verify your email address first" });
        }

        const data = { ...req.body };
        if (req.file) data.profileFile = req.file.path;

        const submission = new NetworkingSubmission(data);
        await submission.save();

        // ─── SEND EMAIL NOTIFICATIONS ───
        const transporter = await createTransporter();
        const mailConfig = await getMailConfig();

        // Fetch site settings for logo and name
        const genSettings = await GeneralSettings.findOne() || {};
        const siteLogo = genSettings.logoUrl
            ? (genSettings.logoUrl.startsWith('http') ? genSettings.logoUrl : `${req.protocol}://${req.get('host')}${genSettings.logoUrl}`)
            : '';
        const siteName = genSettings.siteName || mailConfig.from;

        // 1. Admin Email
        const adminMailOptions = {
            from: `"${siteName} Networking" <${mailConfig.user}>`,
            // to: "info@rajuandprasad.com",
            to: "info@rajuandprasad.com",
            subject: `New Networking Inquiry: ${fullName}`,
            html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    ${siteLogo ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${siteLogo}" alt="${siteName}" style="max-height: 50px; object-fit: contain;"></div>` : ''}
                    <h2 style="color: #022683; border-bottom: 2px solid #022683; padding-bottom: 10px;">Networking Submission</h2>
                    <p><strong>Name:</strong> ${fullName}</p>
                    <p><strong>Organisation:</strong> ${organisation || 'N/A'}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Mobile:</strong> ${mobile}</p>
                    <p><strong>File Attached:</strong> ${req.file ? 'Yes (Check Attachments)' : 'No'}</p>
                    <hr/>
                    <p style="font-size: 12px; color: #888;">Submitted on ${new Date().toLocaleString()}</p>
                </div>
            `,
            attachments: req.file ? [{
                filename: req.file.originalname,
                path: req.file.path
            }] : []
        };

        // 2. User Email
        const userMailOptions = {
            from: `"${siteName}" <${mailConfig.user}>`,
            to: email,
            subject: "Networking Inquiry Received",
            html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    ${siteLogo ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${siteLogo}" alt="${siteName}" style="max-height: 50px; object-fit: contain;"></div>` : ''}
                    <h2 style="color: #022683;">Hi ${fullName},</h2>
                    <p>Thank you for expressing interest in networking with us.</p>
                    <p>We have received your details and our team will review the same and get back to you shortly.</p>
                    <br/>
                    <p>Best regards,<br/><strong>Team ${siteName}</strong></p>
                </div>
            `
        };

        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(userMailOptions)
        ]);

        // Cleanup
        await NetworkingOtp.deleteMany({ email: email.toLowerCase() });

        res.json({ success: true, message: "Submission successful", submission });
    } catch (err) {
        console.error("Networking Submission Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// UPDATE submission status
router.put("/:id", async (req, res) => {
    try {
        const updated = await NetworkingSubmission.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE submission
router.delete("/:id", async (req, res) => {
    try {
        await NetworkingSubmission.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
