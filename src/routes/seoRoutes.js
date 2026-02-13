const express = require('express');
const router = express.Router();
const SEOConfig = require('../models/SEOConfig');

// GET all SEO settings
router.get('/', async (req, res) => {
    try {
        let configs = await SEOConfig.find();

        // If no configs exist, initialize them with defaults for the 4 sections
        if (configs.length === 0) {
            const defaults = [
                { pageName: 'Home', urlSlug: '/', metaTitle: 'Home - Raju & Prasad', metaDescription: 'Leading CA firm in India', keywords: 'CA, Taxation, Audit' },
                { pageName: 'About', urlSlug: '/about', metaTitle: 'About Us - Raju & Prasad', metaDescription: '46+ years of excellence', keywords: 'About us, CA firm history' },
                { pageName: 'Services', urlSlug: '/services', metaTitle: 'Our Services - Raju & Prasad', metaDescription: 'Taxation, Audit, GST', keywords: 'Taxation services, Audit services' },
                { pageName: 'Contact', urlSlug: '/contact', metaTitle: 'Contact Us - Raju & Prasad', metaDescription: 'Get in touch with us', keywords: 'Contact, office locations' }
            ];
            configs = await SEOConfig.insertMany(defaults);
        }

        res.json(configs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET SEO by pageName
router.get('/:pageName', async (req, res) => {
    try {
        const config = await SEOConfig.findOne({ pageName: req.params.pageName });
        if (!config) return res.status(404).json({ message: 'SEO config not found' });
        res.json(config);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT update SEO by pageName
router.put('/:pageName', async (req, res) => {
    try {
        const config = await SEOConfig.findOneAndUpdate(
            { pageName: req.params.pageName },
            req.body,
            { new: true, upsert: true }
        );
        res.json(config);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE SEO by pageName
router.delete('/:pageName', async (req, res) => {
    try {
        const config = await SEOConfig.findOneAndDelete({ pageName: req.params.pageName });
        if (!config) return res.status(404).json({ message: 'SEO config not found' });
        res.json({ message: 'SEO config deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
