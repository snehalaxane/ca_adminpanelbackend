require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");

// ─── Route Imports ───────────────────────────────────────────────────────────
const adminRoutes = require("./routers/adminRoutes");
const heroRoutes = require("./routers/heroRoutes");
const aboutRoutes = require("./routers/aboutRoutes");
const navbarRoutes = require("./routers/navbarRoutes");
const footerContactRoutes = require("./routers/footerContact");
const footerContentRoutes = require("./routers/footerContent");
const quickLinksRoutes = require("./routers/quickLinks");
const mapLocationRoutes = require("./routers/mapLocationRoutes");
const teamMemberRoutes = require("./routers/teamMemberRoutes");
const serviceRoutes = require("./routers/serviceRoutes");
const sectorRoutes = require("./routers/sectorRoutes");
const historyJourneyRoutes = require("./routers/historyJourneyRoutes");
const historyTimelineRoutes = require("./routers/historyTimelineRoutes");
const historyMissionRoutes = require("./routers/historyMissionRoutes");
const networkingContentRoutes = require("./routers/networkingContentRoutes");
const networkingAssociateRoutes = require("./routers/networkingAssociateRoutes");
const networkingSubmissionRoutes = require("./routers/networkingSubmissionRoutes");
const newsletterRoutes = require("./routers/newsletterRoutes");
const blogRoutes = require("./routers/blogRoutes");
const alumniRoutes = require("./routers/alumniRoutes");
const galleryRoutes = require("./routers/galleryRoutes");
const settingsRoutes = require("./routers/settingsRoutes");
const legalRoutes = require("./routers/legalRoutes");
const seoRoutes = require("./routers/seoRoutes");
const careerIntroRoutes = require("./routers/careerIntroRoutes");
const jobOpeningsRoutes = require("./routers/jobOpeningsRoutes");
const applicationsRoutes = require("./routers/applicationsRoutes");
const contactFormRoutes = require("./routers/contactFormRoutes");
const contactSettingsRoutes = require("./routers/contactSettingsRoutes");
const contactFieldsRoutes = require("./routers/contactFieldsRoutes");
const contactOfficesRoutes = require("./routers/contactOfficesRoutes");
const newsletterIntroRoutes = require("./routers/newsletterIntroRoutes");
const blogIntroRoutes = require("./routers/blogIntroRoutes");
const alumniIntroRoutes = require("./routers/alumniIntroRoutes");
const selectClientsIntroRoutes = require("./routers/selectClientsIntroRoutes");
const serviceIntroRoutes = require("./routers/serviceIntroRoutes");
const footerSectionRoutes = require("./routers/footerSectionRoutes");
const teamIntroRoutes = require("./routers/teamIntroRoutes");
const historyIntroRoutes = require("./routers/historyIntroRoutes");
const infrastructureRoutes = require("./routers/infrastructureRoutes");
const newsletterSubscriptionRoutes = require("./routers/newsletterSubscriptionRoutes");
const newsTickerRoutes = require("./routers/newsTickerRoutes");

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://ca-adminpanelfrontend-n2gh.vercel.app",
        "https://ca-homepagefrontend.vercel.app",
        "https://superadmin.rajuandprasad.com",
        "https://superadmin.rajuandprasad.com/",
        "https://superadmin.rajuandprasad.com/login",
        "https://homepage-rajuandprasad-copy.vercel.app",
        "https://homepage-rajuandprasad-copy.vercel.app/",
        "https://adminpanel-rajuandprasad-copy.vercel.app/",
        "https://adminpanel-rajuandprasad-copy.vercel.app",
        "https://adminpanel-rajuandprasad-copy.vercel.app/login",
        "https://ca-homepagefrontend.vercel.app/",
        "https://admin.rajuandprasad.com"


    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true
}));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Global Request Logger
app.use((req, res, next) => {
    console.log(`[DEBUG] ${new Date().toISOString()} ${req.method} ${req.url}`);
    console.log(`[DEBUG] Content-Type: ${req.headers['content-type']}`);
    console.log(`[DEBUG] Content-Length: ${req.headers['content-length']}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('[DEBUG] Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// ─── Session ──────────────────────────────────────────────────────────────────
app.use(session({
    name: "admin-session",
    secret: "admin-cms-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Routes ───────────────────────────────────────────────────────────────────
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
app.use("/api/newsletter-intro", newsletterIntroRoutes);
app.use("/api/blog-intro", blogIntroRoutes);
app.use("/api/alumni-intro", alumniIntroRoutes);
app.use("/api/select-clients-intro", selectClientsIntroRoutes);
app.use("/api/service-intro", serviceIntroRoutes);
app.use("/api/footer-sections", footerSectionRoutes);
app.use("/api/team-intro", teamIntroRoutes);
app.use("/api/history-intro", historyIntroRoutes);
app.use("/api/infrastructure", infrastructureRoutes);
app.use("/api/newsletter-subscriptions", newsletterSubscriptionRoutes);
app.use("/api/news-ticker", newsTickerRoutes);

app.use("/api/job-categories", jobOpeningsRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Backend is running successfully 🚀",
        status: "OK"
    });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    if (err.name === "MulterError" || err.message.includes("Only images")) {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});

// ─── Database + Server ────────────────────────────────────────────────────────
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected ✅"))
    .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
