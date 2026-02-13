const express = require("express");
const Careers = require("../models/Careers");
const router = express.Router();

// Get all careers data
router.get("/", async (req, res) => {
  try {
    let careers = await Careers.findOne();
    
    // If no careers data exists, create default
    if (!careers) {
      careers = new Careers({
        careerIntro: {
          title: 'Careers',
          subtitle: 'Join a team built on professionalism, growth, and integrity.',
          description: 'Explore exciting opportunities and be part of our legacy',
          ctaText: 'Explore Opportunities',
          enabled: true
        },
        jobCategories: [
          {
            name: 'Audit & Assurance',
            enabled: true,
            jobs: [
              { 
                role: 'Senior Auditor', 
                description: 'Experience in statutory audits required',
                requirements: 'Qualified Chartered Accountant with valid membership',
                responsibilities: 'Assist in statutory audits',
                location: 'Multiple Locations',
                experience: '5+ years',
                employmentType: 'Full-time',
                image: '', 
                applyLink: '/apply/senior-auditor', 
                enabled: true 
              }
            ]
          }
        ],
        applications: []
      });
      await careers.save();
    }
    
    res.json(careers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update career intro section
router.put("/intro", async (req, res) => {
  try {
    let careers = await Careers.findOne();
    if (!careers) {
      careers = new Careers();
    }
    
    careers.careerIntro = req.body;
    careers.updatedAt = new Date();
    await careers.save();
    
    res.json(careers.careerIntro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update job categories
router.put("/categories", async (req, res) => {
  try {
    let careers = await Careers.findOne();
    if (!careers) {
      careers = new Careers();
    }
    
    careers.jobCategories = req.body;
    careers.updatedAt = new Date();
    await careers.save();
    
    res.json(careers.jobCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update single job
router.put("/job/:categoryId/:jobId", async (req, res) => {
  try {
    const { categoryId, jobId } = req.params;
    
    let careers = await Careers.findOne();
    if (!careers) {
      return res.status(404).json({ error: "Careers data not found" });
    }
    
    const category = careers.jobCategories.id(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    const job = category.jobs.id(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    
    Object.assign(job, req.body);
    careers.updatedAt = new Date();
    await careers.save();
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete job
router.delete("/job/:categoryId/:jobId", async (req, res) => {
  try {
    const { categoryId, jobId } = req.params;
    
    let careers = await Careers.findOne();
    if (!careers) {
      return res.status(404).json({ error: "Careers data not found" });
    }
    
    const category = careers.jobCategories.id(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    category.jobs.id(jobId).deleteOne();
    careers.updatedAt = new Date();
    await careers.save();
    
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add application
router.post("/applications", async (req, res) => {
  try {
    let careers = await Careers.findOne();
    if (!careers) {
      careers = new Careers();
    }
    
    const application = {
      ...req.body,
      date: new Date().toISOString().split('T')[0],
      status: 'New'
    };
    
    careers.applications.push(application);
    careers.updatedAt = new Date();
    await careers.save();
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application status
router.put("/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    let careers = await Careers.findOne();
    if (!careers) {
      return res.status(404).json({ error: "Careers data not found" });
    }
    
    const application = careers.applications.id(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    application.status = req.body.status;
    careers.updatedAt = new Date();
    await careers.save();
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete application
router.delete("/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    let careers = await Careers.findOne();
    if (!careers) {
      return res.status(404).json({ error: "Careers data not found" });
    }
    
    careers.applications.id(id).deleteOne();
    careers.updatedAt = new Date();
    await careers.save();
    
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export applications to Excel (CSV format)
router.get("/applications/export", async (req, res) => {
  try {
    let careers = await Careers.findOne();
    if (!careers || !careers.applications.length) {
      return res.status(404).json({ error: "No applications found" });
    }
    
    // Create CSV content
    const headers = ['Name', 'Email', 'Mobile', 'Role Applied', 'Resume File', 'Date', 'Status'];
    const rows = careers.applications.map(app => [
      app.name,
      app.email,
      app.mobile,
      app.role,
      app.resumeFile,
      app.date,
      app.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=applications.csv');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save all changes
router.post("/save", async (req, res) => {
  try {
    let careers = await Careers.findOne();
    if (!careers) {
      careers = new Careers(req.body);
    } else {
      Object.assign(careers, req.body);
    }
    
    careers.updatedAt = new Date();
    await careers.save();
    
    res.json({ message: "Careers data saved successfully", data: careers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
