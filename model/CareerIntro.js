const mongoose = require("mongoose");

const careerIntroSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    ctaText: { type: String },
    enabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerIntro", careerIntroSchema);