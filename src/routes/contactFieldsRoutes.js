const express = require('express');
const router = express.Router();
const ContactField = require('../models/ContactField');

// Get form fields
router.get('/', async (req, res) => {
  try {
    // Sort by 'order' 
    const fields = await ContactField.find().sort({ order: 1 });
    // If empty, frontend logic might need defaults, but let's just return what we have
    res.json(fields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Replace form fields (bulk)
router.put('/', async (req, res) => {
  try {
    const fields = Array.isArray(req.body) ? req.body : req.body.formFields;
    if (!Array.isArray(fields)) return res.status(400).json({ message: 'Invalid payload' });

    // basic validation per field
    for (const f of fields) {
      if (!f.label || typeof f.label !== 'string') return res.status(400).json({ message: 'Each field must have a label' });
      // Ensure we don't carry over _id if it's meant to be "new" or keep it if it's "update".
      // But since we are doing deleteMany + insertMany, we can just let Mongo generate new IDs or try to preserve them if needed. 
      // For simplicity and "clean slate" logic on "Save All", we usually strip _id for insertMany unless we want to keep them.
      // However, frontend relies on IDs. Let's try to keep them if valid, but insertMany might complain about duplicates if we don't delete first.
      // We delete first, so re-inserting with same _id is fine technically, but often cleaner to let Mongo generate or just update.
      // Given the requirement "3 diff collection", the simplest bulk update is Replace All strategy.
      if (!f.fieldType || typeof f.fieldType !== 'string') f.fieldType = 'text';
    }

    // Atomic-ish replacement
    await ContactField.deleteMany({});

    // Insert new docs
    // We map to ensure clean objects
    const docsToInsert = fields.map(f => ({
      label: f.label,
      fieldType: f.fieldType,
      required: !!f.required,
      enabled: f.enabled !== undefined ? f.enabled : true,
      order: f.order || 0,
      placeholder: f.placeholder || ''
      // Let Mongo generate _id or use provided if we really wanted to persist ID stable across saves (but deleteMany wipes them). 
      // Frontend will get new IDs on response.
    }));

    const result = await ContactField.insertMany(docsToInsert);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
