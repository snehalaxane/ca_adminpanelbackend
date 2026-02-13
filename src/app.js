const express = require("express");
const cors = require("cors");
const session = require("express-session");
const adminRoutes = require("./routes/adminRoutes");
const heroRoutes = require("./routes/heroRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const navbarRoutes = require("./routes/navbarRoutes");
const footerContactRoutes = require("./routes/footerContact");
const footerContentRoutes = require("./routes/footerContent");
const quickLinksRoutes = require("./routes/quickLinks");
const mapLocationRoutes = require("./routes/mapLocationRoutes");
const teamMemberRoutes = require("./routes/teamMemberRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const sectorRoutes = require("./routes/sectorRoutes");
const historyJourneyRoutes = require("./routes/historyJourneyRoutes");
const historyTimelineRoutes = require("./routes/historyTimelineRoutes");
const historyMissionRoutes = require("./routes/historyMissionRoutes");
const networkingContentRoutes = require("./routes/networkingContentRoutes");
const networkingAssociateRoutes = require("./routes/networkingAssociateRoutes");
const networkingSubmissionRoutes = require("./routes/networkingSubmissionRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const blogRoutes = require("./routes/blogRoutes");
const alumniRoutes = require("./routes/alumniRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const legalRoutes = require("./routes/legalRoutes");
const seoRoutes = require("./routes/seoRoutes");
const careerIntroRoutes = require("./routes/careerIntroRoutes");
const jobOpeningsRoutes = require("./routes/jobOpeningsRoutes");
const applicationsRoutes = require("./routes/applicationsRoutes");
const contactFormRoutes = require("./routes/contactFormRoutes");
const contactSettingsRoutes = require("./routes/contactSettingsRoutes");
const contactFieldsRoutes = require("./routes/contactFieldsRoutes");
const contactOfficesRoutes = require("./routes/contactOfficesRoutes");

const app = express();

// ✅ CORS (use the port your frontend runs on)
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3500"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static("uploads"));

app.use(session({
  name: "admin-session",
  secret: "admin-cms-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,      // localhost
    sameSite: "lax",    // 👈 REQUIRED
    maxAge: 24 * 60 * 60 * 1000
  }
}));


app.use("/api/admin", adminRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/navbar", navbarRoutes);
app.use("/api/footer-contact", footerContactRoutes);
app.use("/api/footer-content", footerContentRoutes);
app.use("/api/quick-links", quickLinksRoutes);
app.use("/api/map-locations", mapLocationRoutes);
app.use("/api/team-members", teamMemberRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/sectors", sectorRoutes);
app.use("/api/history-journey", historyJourneyRoutes);
app.use("/api/history-timeline", historyTimelineRoutes);
app.use("/api/history-mission", historyMissionRoutes);
app.use("/api/networking-content", networkingContentRoutes);
app.use("/api/networking-associates", networkingAssociateRoutes);
app.use("/api/networking-submissions", networkingSubmissionRoutes);
app.use("/api/newsletters", newsletterRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/legal", legalRoutes);
app.use("/api/seo", seoRoutes);
app.use("/api/career-intro", careerIntroRoutes);
app.use("/api/job-openings", jobOpeningsRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/contact-form", contactFormRoutes);
app.use("/api/contact/settings", contactSettingsRoutes);
app.use("/api/contact/fields", contactFieldsRoutes);
app.use("/api/contact/offices", contactOfficesRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);

  // Handle Multer errors or custom validation errors with 400
  if (err.name === 'MulterError' || err.message.includes('Only images')) {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;
