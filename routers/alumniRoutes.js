const express = require('express');
const router = express.Router();
const Alumni = require('../model/Alumni');




// GET all alumni
router.get('/', async (req, res) => {
    try {
        const alumni = await Alumni.find().sort({ order: 1, createdAt: -1 });
        res.json(alumni);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new alumni
router.post('/', async (req, res) => {
    try {
        const data = { ...req.body };

        if (data.enabled !== undefined) {
            data.enabled = data.enabled === 'true' || data.enabled === true;
        }

      

        const alumni = new Alumni(data);
        const newAlumni = await alumni.save();
        res.status(201).json(newAlumni.toObject());
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update alumni
router.put('/:id', async (req, res) => {
    try {
        const data = { ...req.body };

        if (data.enabled !== undefined) {
            data.enabled = data.enabled === 'true' || data.enabled === true;
        }

       

        const updatedAlumni = await Alumni.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true  });
        if (!updatedAlumni) return res.status(404).json({ message: "Alumni not found" });

        res.json(updatedAlumni.toObject());
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE alumni
router.delete('/:id', async (req, res) => {
    try {
        const alumni = await Alumni.findById(req.params.id);
      
        await Alumni.findByIdAndDelete(req.params.id);
        res.json({ message: 'Alumni deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
