const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    billingAddress: {
      fullName: String,
      phone: String,
      address1: String,
      address2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      billingAddressId: String,
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      address1: String,
      address2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      shippingAddressId: String,
      isDefaultShippingAddress: Boolean,
    },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        imageUrl: String,
        price: Number,
        quantity: Number,
      },
    ],

    subTotal: Number,
    shippingCost: Number,
    totalAmount: Number,

    paymentMethod: {
      type: String,
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    paymentMethodsDetails: {
        type: String,
        enum: ["COD", "card", "paypal", "stripe"],
        default: "COD",
    },

    orderStatus: {
      type: String,
      enum: ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PROCESSING",
    },

    paypal: {
      orderId: String,
      payerId: String,
      paymentId: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
