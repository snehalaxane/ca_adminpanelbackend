const express = require("express");
const router = express.Router();
const FooterContact = require("../models/FooterContact");

// GET Footer Contact (Only One Document)
router.get("/", async (req, res) => {
  try {
    const data = await FooterContact.findOne();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE Footer Contact
router.put("/", async (req, res) => {
  try {
    let data = await FooterContact.findOne();

    if (!data) {
      // If not exists → create first time
      data = new FooterContact(req.body);
    } else {
      // Update existing
      Object.assign(data, req.body);
    }

    await data.save();
    res.json({ message: "Footer updated successfully", data });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
