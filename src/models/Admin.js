const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: "Admin"
    },
    phone: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      default: "Super Admin"
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
