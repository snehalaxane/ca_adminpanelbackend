const mongoose = require('mongoose');

const contactOfficeSchema = new mongoose.Schema({
  cityName: { type: String, default: '' },
  officeName: { type: String, default: '' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  mapEmbed: { type: String, default: '' },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactOffice', contactOfficeSchema);
