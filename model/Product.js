const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    productImages: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isWholesale: {
      type: Boolean,
      default: false,
    },
    sku: {
      type: String,
      unique: true,
    },
    barcode: {
      type: String,
    },
    productCode: {
      type: String,
    },
    unit: {
      type: String,
      default: "Unit",
    },
    productPrice: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
    },
    wholesalePrice: {
      type: Number,
    },
    wholesaleQty: {
      type: Number,
    },
    productStock: {
      type: Number,
      default: 0,
    },
    qty: {
      type: Number,
      default: 1,
    },
    tags: [
      {
        type: String,
      },
    ],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
