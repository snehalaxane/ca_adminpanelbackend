const mongoose = require("mongoose");

const careerIntroSchema = new mongoose.Schema({
  title: { type: String, default: 'Careers' },
  subtitle: { type: String, default: 'Join a team built on professionalism, growth, and integrity.' },
  description: { type: String, default: 'Explore exciting opportunities and be part of our legacy' },
  ctaText: { type: String, default: 'Explore Opportunities' },
  enabled: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CareerIntro", careerIntroSchema);
