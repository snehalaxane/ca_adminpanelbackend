// const mongoose = require("mongoose");

// const navItemSchema = new mongoose.Schema({
//   label: { type: String, required: true },
//   link: { type: String, required: true },
//   enabled: { type: Boolean, default: true },
//   dropdown: { type: Boolean, default: false }
// });

// const navbarSchema = new mongoose.Schema({
//   items: [navItemSchema]
// }, { timestamps: true });

// module.exports = mongoose.model("Navbar", navbarSchema);

const mongoose = require("mongoose");

const navbarSchema = new mongoose.Schema({
  label: { type: String, required: true },
  link: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Navbar",
    default: null
  },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Navbar", navbarSchema);
