const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    imageUrl: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// Virtual populate for products
categorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "categoryId",
});

// Auto-populate products in every find/findOne
function autoPopulateProducts(next) {
  this.populate("products");
  next();
}

categorySchema.pre("find", autoPopulateProducts);
categorySchema.pre("findOne", autoPopulateProducts);

module.exports = mongoose.model("Category", categorySchema);
