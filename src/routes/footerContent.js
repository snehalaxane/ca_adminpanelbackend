const express = require("express");
const router = express.Router();
const FooterContent = require("../models/FooterContent");

// GET
router.get("/", async (req, res) => {
  try {
    const data = await FooterContent.findOne();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE (Single document CMS style)
router.put("/", async (req, res) => {
  try {
    let data = await FooterContent.findOne();

    if (!data) {
      data = new FooterContent(req.body);
    } else {
      Object.assign(data, req.body);
    }

    await data.save();
    res.json({ message: "Footer content updated", data });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
