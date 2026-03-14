const router = require('express').Router();
const ContactSettings = require('../model/ContactSettings');
const ContactInquiry = require('../model/ContactInquiry');
const ContactOtp = require('../model/ContactOtp');
const GeneralSettings = require('../model/GeneralSettings');
const nodemailer = require('nodemailer');
const { createTransporter, getMailConfig } = require('../utils/mail');

// ---------------- SEND OTP ----------------
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await ContactOtp.findOneAndUpdate(
      { email: email.toLowerCase() },
      { otp, expiresAt, verified: false },
      { upsert: true, new: true }
    );

    const transporter = await createTransporter();
    const mailConfig = await getMailConfig();

    const mailOptions = {
      from: `"${mailConfig.from}" <${mailConfig.user}>`,
      to: email,
      subject: "Verification Code for Contact Inquiry",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #022683; margin: 0;">Verification Code</h1>
            <p style="color: #666;">Use the code below to verify your email address.</p>
          </div>
          <div style="background-color: #f8faff; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 30px;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 5px; color: #022683;">${otp}</span>
          </div>
          <p style="margin-bottom: 10px;">This code is valid for <strong>5 minutes</strong>. If you didn't request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">&copy; ${new Date().getFullYear()} Raju & Prasad. All rights reserved.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP Error:", err);
    res.status(500).json({ message: "Failed to send verification code" });
  }
});

// ---------------- VERIFY OTP ----------------
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

  try {
    const record = await ContactOtp.findOne({
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

// GET contact form settings (single document)
router.get('/', async (req, res) => {
  try {
    let settings = await ContactFormSettings.findOne();
    if (!settings) {
      settings = new ContactFormSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET all submissions
router.get('/submissions', async (req, res) => {
  try {
    const submissions = await ContactInquiry.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// SUBMIT contact form
router.post('/submit', async (req, res) => {
  try {
    const rawData = req.body || {};
    const keys = Object.keys(rawData);

    if (keys.length === 0) {
      return res.status(400).json({ message: 'No data received' });
    }

    // Extraction logic
    // 1. Name
    let finalName = rawData.name || '';
    if (!finalName) {
      const nameKey = keys.find(k => k.toLowerCase().includes('name'));
      finalName = nameKey ? rawData[nameKey] : (rawData[keys[0]] || 'Unknown');
    }

    // 2. Email
    let finalEmail = rawData.email || '';
    if (!finalEmail) {
      const emailKey = keys.find(k => k.toLowerCase().includes('email') || k.toLowerCase().includes('mail'));
      finalEmail = emailKey ? rawData[emailKey] : '';
    }

    if (!finalEmail) return res.status(400).json({ message: "Email is required" });

    // VERIFY IF EMAIL IS VERIFIED
    const otpRecord = await ContactOtp.findOne({ email: finalEmail.toLowerCase(), verified: true });
    if (!otpRecord) {
      return res.status(403).json({ message: "Please verify your email address first" });
    }

    // 3. Mobile
    let finalMobile = rawData.mobile || '';
    if (!finalMobile) {
      const mobileKey = keys.find(k => k.toLowerCase().includes('mobile') || k.toLowerCase().includes('phone') || k.toLowerCase().includes('tel') || k.toLowerCase().includes('contact'));
      finalMobile = mobileKey ? rawData[mobileKey] : 'N/A';
    }

    // 4. Message
    let finalMessage = rawData.message || '';
    if (!finalMessage) {
      const msgKey = keys.find(k => k.toLowerCase().includes('message') || k.toLowerCase().includes('query') || k.toLowerCase().includes('comment'));
      finalMessage = msgKey ? rawData[msgKey] : (rawData[keys[keys.length - 1]] || 'No message provided');
    }

    const inquiry = new ContactInquiry({
      name: finalName,
      email: finalEmail,
      mobile: finalMobile,
      message: finalMessage,
      additionalInfo: rawData
    });

    await inquiry.save();

    // Fetch site settings for logo and name
    const genSettings = await GeneralSettings.findOne() || {};
    const siteLogo = genSettings.logoUrl
      ? (genSettings.logoUrl.startsWith('http') ? genSettings.logoUrl : `${req.protocol}://${req.get('host')}${genSettings.logoUrl}`)
      : '';
    const siteName = genSettings.siteName || mailConfig.from; // Changed fallback from 'Think Tank'

    // ─── SEND EMAILS ───
    const transporter = await createTransporter();
    const mailConfig = await getMailConfig();
    const settings = await ContactSettings.findOne();
    // const adminEmail = settings?.emailUs || mailConfig.user; // This line is effectively replaced by direct usage below

    // 1. Admin Notification
    const adminMailOptions = {
      from: `"${siteName} Notifications" <${mailConfig.user}>`,
      to: "info@rajuandprasad.com", // Changed recipient to info@rajuandprasad.com
      subject: `New Inquiry from ${finalName}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          ${siteLogo ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${siteLogo}" alt="${siteName}" style="max-height: 60px; object-fit: contain;"></div>` : ''}
          <h2 style="color: #022683; border-bottom: 2px solid #022683; padding-bottom: 10px;">New Inquiry Received</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 10px; font-weight: bold; width: 30%;">Name:</td><td style="padding: 10px;">${finalName}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold;">Email:</td><td style="padding: 10px;">${finalEmail}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold;">Mobile:</td><td style="padding: 10px;">${finalMobile}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold;">Message:</td><td style="padding: 10px;">${finalMessage}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 10px; background: #f9f9f9; border-radius: 5px;">
            <p style="font-size: 12px; color: #666; text-align: center;">Sent from ${siteName} Admin Panel</p>
          </div>
        </div>
      `
    };

    // 2. User Confirmation
    const userMailOptions = {
      from: `"${siteName}" <${mailConfig.user}>`,
      to: finalEmail,
      subject: "We've received your inquiry",
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          ${siteLogo ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${siteLogo}" alt="${siteName}" style="max-height: 60px; object-fit: contain;"></div>` : ''}
          <h2 style="color: #022683;">Thank you for reaching out!</h2>
          <p>Hi ${finalName.split(' ')[0]},</p>
          <p>We've received your inquiry and our team will get back to you shortly.</p>
          <div style="background: #f8faff; padding: 15px; border-left: 4px solid #022683; border-radius: 4px; margin: 20px 0;">
             <p style="margin: 0; font-style: italic; color: #555;">"${finalMessage.length > 100 ? finalMessage.substring(0, 100) + '...' : finalMessage}"</p>
          </div>
          <p>Best regards,<br/><strong>Team ${siteName}</strong></p>
        </div>
      `
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    // Cleanup session
    await ContactOtp.deleteOne({ email: finalEmail.toLowerCase() });

    res.json({ success: true, message: 'Inquiry submitted successfully', inquiry });
  } catch (err) {
    console.error("Submission Error:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE submission status
router.put('/submissions/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await ContactInquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE submission
router.delete('/submissions/:id', async (req, res) => {
  try {
    await ContactInquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Submission deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE contact form settings
router.put('/', async (req, res) => {
  try {
    const { callNow, emailUs, formFields } = req.body;

    // Basic server-side validation
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => /^\+?[0-9\s\-()]{7,}$/.test(phone || '');

    if (callNow && !validatePhone(callNow)) {
      return res.status(400).json({ message: 'Invalid phone number for callNow' });
    }
    if (emailUs && !validateEmail(emailUs)) {
      return res.status(400).json({ message: 'Invalid email address for emailUs' });
    }

    let settings = await ContactSettings.findOne();
    if (!settings) {
      settings = new ContactSettings(req.body);
    } else {
      if (typeof req.body.heading !== 'undefined') settings.heading = req.body.heading;
      if (typeof req.body.subheading !== 'undefined') settings.subheading = req.body.subheading;
      if (typeof req.body.callNow !== 'undefined') settings.callNow = req.body.callNow;
      if (typeof req.body.emailUs !== 'undefined') settings.emailUs = req.body.emailUs;
      if (typeof req.body.enabled !== 'undefined') settings.enabled = req.body.enabled;
      if (Array.isArray(formFields)) settings.formFields = formFields;
    }
    settings.updatedAt = Date.now();
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
