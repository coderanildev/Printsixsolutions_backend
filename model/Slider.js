const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },

    imageUrl: { type: String, required: true },

    description: { type: String },
    shortDescription: { type: String },

    isActive: { type: Boolean, default: false },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

module.exports = mongoose.model("Sliders", sliderSchema);
