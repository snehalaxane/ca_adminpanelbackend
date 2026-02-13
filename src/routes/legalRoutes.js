const express = require('express');
const router = express.Router();
const LegalPage = require('../models/LegalPage');

// GET all legal pages
router.get('/', async (req, res) => {
    try {
        const pages = await LegalPage.find().sort({ createdAt: -1 });
        res.json(pages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single legal page by ID
router.get('/:id', async (req, res) => {
    try {
        const page = await LegalPage.findById(req.params.id);
        if (!page) return res.status(404).json({ message: 'Page not found' });
        res.json(page);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create new legal page
router.post('/', async (req, res) => {
    try {
        const page = new LegalPage(req.body);
        const newPage = await page.save();
        res.status(201).json(newPage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update legal page
router.put('/:id', async (req, res) => {
    try {
        const data = { ...req.body };
        data.lastUpdated = new Date().toISOString().split('T')[0];

        const updatedPage = await LegalPage.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!updatedPage) return res.status(404).json({ message: 'Page not found' });
        res.json(updatedPage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE legal page
router.delete('/:id', async (req, res) => {
    try {
        const page = await LegalPage.findByIdAndDelete(req.params.id);
        if (!page) return res.status(404).json({ message: 'Page not found' });
        res.json({ message: 'Page deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
