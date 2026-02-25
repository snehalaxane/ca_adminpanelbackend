const mongoose = require("mongoose");

const footerContentSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    socialMedia: {
      linkedin: { type: String },
      twitter: { type: String },
      facebook: { type: String }
    },
    copyright: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FooterContent", footerContentSchema);
