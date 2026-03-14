const express = require("express");
const Application = require("../model/Application");
const CareerOtp = require("../model/CareerOtp");
const GeneralSettings = require("../model/GeneralSettings");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createTransporter, getMailConfig } = require("../utils/mail");

const uploadDir = path.join(__dirname, "..", "uploads", "resumes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error("Error: Resume must be PDF or Word document!"));
  },
});

// ---------------- SEND OTP ----------------
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await CareerOtp.findOneAndUpdate(
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
      subject: "Verification Code for Your Job Application",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; color: #333;">
          ${siteLogo ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${siteLogo}" alt="${siteName}" style="max-height: 50px; object-fit: contain;"></div>` : ''}
          <h2 style="color: #022683; text-align: center;">Verification Code</h2>
          <p style="text-align: center; color: #666;">Use the following code to verify your email for the application process.</p>
          <div style="background: #f4f6f9; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #022683;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #999; text-align: center;">This code will expire in 5 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Career OTP Error:", err);
    res.status(500).json({ message: "Failed to send verification code" });
  }
});

// ---------------- VERIFY OTP ----------------
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

  try {
    const record = await CareerOtp.findOne({
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

// Export applications to CSV
router.get("/export", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    let csv = 'Name,Email,Mobile,Role,Message,Resume File,Date,Status\n';
    applications.forEach(app => {
      const escapedName = `"${(app.name || '').replace(/"/g, '""')}"`;
      const escapedEmail = `"${(app.email || '').replace(/"/g, '""')}"`;
      const escapedMobile = `"${(app.mobile || '').replace(/"/g, '""')}"`;
      const escapedRole = `"${(app.role || '').replace(/"/g, '""')}"`;
      const escapedMessage = `"${(app.message || '').replace(/"/g, '""')}"`;
      const escapedResume = `"${(app.resumeFile || '').replace(/"/g, '""')}"`;
      const escapedDate = `"${app.createdAt ? new Date(app.createdAt).toLocaleDateString() : ''}"`;
      const escapedStatus = `"${(app.status || '').replace(/"/g, '""')}"`;
      csv += `${escapedName},${escapedEmail},${escapedMobile},${escapedRole},${escapedMessage},${escapedResume},${escapedDate},${escapedStatus}\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=applications.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

// Submit an application
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const { name, email, mobile, role, message } = req.body;

    // Check if verified
    const otpRecord = await CareerOtp.findOne({ email: email.toLowerCase(), verified: true });
    if (!otpRecord) {
      return res.status(403).json({ message: "Please verify your email address first" });
    }

    const resumeFile = req.file ? req.file.filename : "";

    const newApplication = new Application({
      name,
      email,
      mobile,
      role,
      message,
      resumeFile,
      status: "New",
    });

    await newApplication.save();

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
      from: `"${siteName} Careers" <${mailConfig.user}>`,
      // to: "info@rajuandprasad.com",
      to: "info@rajuandprasad.com",
      subject: `New Job Application: ${role} - ${name}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          ${siteLogo ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${siteLogo}" alt="${siteName}" style="max-height: 50px; object-fit: contain;"></div>` : ''}
          <h2 style="color: #022683; border-bottom: 2px solid #022683; padding-bottom: 10px;">New Job Application</h2>
          <p><strong>Role:</strong> ${role}</p>
          <p><strong>Candidate Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mobile:</strong> ${mobile}</p>
          <p><strong>Message:</strong> ${message || 'N/A'}</p>
          <p><strong>Resume:</strong> Attached to this email</p>
          <hr/>
          <p style="font-size: 12px; color: #888;">Submitted on ${new Date().toLocaleString()}</p>
        </div>
      `,
      attachments: req.file ? [{
        filename: req.file.originalname,
        path: req.file.path
      }] : []
    };

    // 2. Candidate Email
    const candidateMailOptions = {
      from: `"${siteName}" <${mailConfig.user}>`,
      to: email,
      subject: `Application Received: ${role}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          ${siteLogo ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${siteLogo}" alt="${siteName}" style="max-height: 50px; object-fit: contain;"></div>` : ''}
          <h2 style="color: #022683;">Hi ${name},</h2>
          <p>Thank you for applying for the position of <strong>${role}</strong> at ${siteName}.</p>
          <p>We have received your application and resume. Our recruitment team will review your profile and if shortlisted, we will get back to you shortly.</p>
          <br/>
          <p>Best regards,<br/><strong>HR Team | ${siteName}</strong></p>
        </div>
      `
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(candidateMailOptions)
    ]);

    // Cleanup
    await CareerOtp.deleteMany({ email: email.toLowerCase() });

    res.status(201).json({ message: "Application submitted successfully", application: newApplication });
  } catch (error) {
    console.error("Submission Error:", error);
    res.status(500).json({ message: "Failed to submit application", error: error.message });
  }
});

// Update status
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatus = ["New", "Received", "Shortlisted", "Rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

// Delete application
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Application.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete application" });
  }
});

module.exports = router;
