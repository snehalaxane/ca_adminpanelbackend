const express = require("express");
const Application = require("../models/Application");
const router = express.Router();

// Get all applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new application
router.post("/", async (req, res) => {
  try {
    const { name, email, mobile, role, resumeFile, date, status } = req.body;

    const application = new Application({
      name,
      email,
      mobile,
      role,
      resumeFile,
      date: date || new Date().toLocaleDateString(),
      status: status || 'New'
    });

    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const application = await Application.findByIdAndUpdate(id, updates, { new: true });

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete application
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Application.findByIdAndDelete(id);
    res.json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export applications to CSV
router.get("/export", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });

    // Create CSV content
    let csv = 'Name,Email,Mobile,Role,Resume File,Date,Status\n';

    applications.forEach(app => {
      const escapedName = `"${(app.name || '').replace(/"/g, '""')}"`;
      const escapedEmail = `"${(app.email || '').replace(/"/g, '""')}"`;
      const escapedMobile = `"${(app.mobile || '').replace(/"/g, '""')}"`;
      const escapedRole = `"${(app.role || '').replace(/"/g, '""')}"`;
      const escapedResume = `"${(app.resumeFile || '').replace(/"/g, '""')}"`;
      const escapedDate = `"${(app.date || '').replace(/"/g, '""')}"`;
      const escapedStatus = `"${(app.status || '').replace(/"/g, '""')}"`;

      csv += `${escapedName},${escapedEmail},${escapedMobile},${escapedRole},${escapedResume},${escapedDate},${escapedStatus}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=applications.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save all applications
router.post("/save-all", async (req, res) => {
  try {
    const { applications } = req.body;

    // Delete all and save new ones
    await Application.deleteMany({});

    const savedApps = await Application.insertMany(applications);
    res.json(savedApps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
