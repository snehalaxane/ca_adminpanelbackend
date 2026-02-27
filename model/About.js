const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
  icon: { type: String }, // Image path
});

const aboutSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  stats: [statSchema],
}, { timestamps: true });

module.exports = mongoose.model("About", aboutSchema);
