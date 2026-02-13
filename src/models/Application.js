const mongoose = require("mongoose");

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

module.exports = mongoose.model("Application", applicationSchema);
