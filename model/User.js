const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true },
  isDefaultBillingAddress: { type: Boolean, default: false },
  isDefaultShippingAddress: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["ADMIN", "VENDOR", "USER"], default: "USER" },
    status: { type: Boolean, default: false },
    refreshToken: { type: String },
    addresses: [addressSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
