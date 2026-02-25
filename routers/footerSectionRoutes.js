const express = require('express');
const router = express.Router();
const FooterSection = require('../model/FooterSection');

// GET all sections
router.get('/', async (req, res) => {
    try {
        const sections = await FooterSection.find().sort({ order: 1 });
        res.json(sections);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// CREATE section
router.post('/', async (req, res) => {
    try {
        const section = new FooterSection(req.body);
        await section.save();
        res.json(section);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// UPDATE section
router.put('/:id', async (req, res) => {
    try {
        const section = await FooterSection.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(section);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE section
router.delete('/:id', async (req, res) => {
    try {
        await FooterSection.findByIdAndDelete(req.params.id);
        res.json({ message: 'Section deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
