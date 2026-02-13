const express = require("express");
const JobOpening = require("../models/JobOpening");
const router = express.Router();

// Get all job categories with jobs
router.get("/", async (req, res) => {
  try {
    const jobCategories = await JobOpening.find();

    // Create default if empty
    if (jobCategories.length === 0) {
      const defaultCategory = new JobOpening({
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
      });
      await defaultCategory.save();
      return res.json([defaultCategory]);
    }

    res.json(jobCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new job category
router.post("/", async (req, res) => {
  try {
    const { name, enabled } = req.body;

    const newCategory = new JobOpening({
      name: name || 'New Category',
      enabled: enabled !== undefined ? enabled : true,
      jobs: []
    });

    await newCategory.save();
    res.json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update job category
router.put("/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, enabled } = req.body;

    const category = await JobOpening.findByIdAndUpdate(
      categoryId,
      {
        ...(name && { name }),
        ...(enabled !== undefined && { enabled }),
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete job category
router.delete("/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    await JobOpening.findByIdAndDelete(categoryId);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add job to category
router.post("/:categoryId/jobs", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const jobData = req.body;

    const category = await JobOpening.findById(categoryId);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    category.jobs.push(jobData);
    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update job
router.put("/:categoryId/jobs/:jobId", async (req, res) => {
  try {
    const { categoryId, jobId } = req.params;
    const updates = req.body;

    const category = await JobOpening.findById(categoryId);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const job = category.jobs.id(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    Object.assign(job, updates);
    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete job
router.delete("/:categoryId/jobs/:jobId", async (req, res) => {
  try {
    const { categoryId, jobId } = req.params;

    const category = await JobOpening.findById(categoryId);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    category.jobs.id(jobId).remove();
    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save all categories
router.post("/save-all", async (req, res) => {
  try {
    const { jobCategories } = req.body;

    // Delete all and save new ones
    await JobOpening.deleteMany({});

    const savedCategories = await JobOpening.insertMany(jobCategories);
    res.json(savedCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
