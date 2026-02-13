const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
  number: { type: String, required: true },
  label: { type: String, required: true },
});

const aboutSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  stats: [statSchema],
}, { timestamps: true });

module.exports = mongoose.model("About", aboutSchema);
