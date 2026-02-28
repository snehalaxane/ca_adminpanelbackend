const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
  image: { type: String }, // New field name
  icon: { type: String },  // Legacy field name for backward compatibility
  text: { type: String },  // Caption/Caption text
});

const aboutSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  stats: [statSchema],
}, { timestamps: true });

module.exports = mongoose.model("About", aboutSchema);
