const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  role: String,
  description: String,
  requirements: String,
  responsibilities: String,
  location: String,
  experience: String,
  employmentType: String,
  image: String,
  applyLink: String,
  enabled: { type: Boolean, default: true }
});

const jobCategorySchema = new mongoose.Schema({
  name: String,
  enabled: { type: Boolean, default: true },
  jobs: [jobSchema],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("JobOpening", jobCategorySchema);
