const express = require("express");
const router = express.Router();
const Navbar = require("../models/Navbar");


// ✅ GET ALL NAV ITEMS
router.get("/", async (req, res) => {
  try {
    const items = await Navbar.find().sort({ order: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ CREATE NAV ITEM
router.post("/", async (req, res) => {
  try {
    const newItem = await Navbar.create(req.body);
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ UPDATE NAV ITEM
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await Navbar.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Nav item not found" });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ DELETE NAV ITEM
router.delete("/:id", async (req, res) => {
  try {
    // Delete children first (important)
    await Navbar.deleteMany({ parentId: req.params.id });

    const deletedItem = await Navbar.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Nav item not found" });
    }

    res.json({ message: "Nav item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
