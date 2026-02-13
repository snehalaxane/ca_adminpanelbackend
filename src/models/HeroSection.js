const mongoose = require("mongoose");

const HeroSchema = new mongoose.Schema(
  {
    highlightNumber: String,
    highlightText: String,
    title: String,
    subtitle: String,
    description: String,
    ctaText: String,
    ctaLink: String,
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hero",HeroSchema);
