const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "United States"
  code: { type: String, required: true, unique: true }, // e.g., "US"
}, { timestamps: true });

module.exports = mongoose.model('Country', countrySchema);
