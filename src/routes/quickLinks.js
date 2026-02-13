const express = require("express");
const router = express.Router();
const QuickLink = require("../models/QuickLink");


// GET all links
router.get("/", async (req, res) => {
  try {
    const links = await QuickLink.find().sort({ order: 1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


// CREATE
router.post("/", async (req, res) => {
  try {
    const newLink = new QuickLink(req.body);
    await newLink.save();
    res.json(newLink);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await QuickLink.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await QuickLink.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
