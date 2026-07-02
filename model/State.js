const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }, // e.g., "California"
  code: { type: String, unique: true, sparse: true, uppercase: true, trim: true }, // optional
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true, index: true },
}, { timestamps: true });

module.exports = mongoose.model('State', stateSchema); 
