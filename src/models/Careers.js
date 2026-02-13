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
  jobs: [jobSchema]
});

const applicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  role: String,
  resumeFile: String,
  date: String,
  status: { type: String, enum: ['New', 'Received', 'Shortlisted', 'Rejected'], default: 'New' },
  createdAt: { type: Date, default: Date.now }
});

const careersSchema = new mongoose.Schema({
  // Career Introduction Section
  careerIntro: {
    title: { type: String, default: 'Careers' },
    subtitle: { type: String, default: 'Join a team built on professionalism, growth, and integrity.' },
    description: { type: String, default: 'Explore exciting opportunities and be part of our legacy' },
    ctaText: { type: String, default: 'Explore Opportunities' },
    enabled: { type: Boolean, default: true }
  },
  
  // Job Categories with Jobs
  jobCategories: [jobCategorySchema],
  
  // Applications
  applications: [applicationSchema],
  
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Careers", careersSchema);
