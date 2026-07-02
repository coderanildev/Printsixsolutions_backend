const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../model/Order");
const checkAuth = require("../middleware/checkAuth"); // enable after testing

// Simple validation helper (you can keep express-validator later)
function validateOrderBody(body) {
  if (!body.billingAddress) return "billingAddress is required";
  if (!body.shippingAddress) return "shippingAddress is required";
  if (!Array.isArray(body.items) || body.items.length === 0) return "items are required";
  if (typeof body.subTotal !== "number") return "subTotal must be a number";
  if (typeof body.totalAmount !== "number") return "totalAmount must be a number";
  return null;
}

router.post("/", async (req, res) => {
  try {
    // debug log
    console.log("Incoming order body:", req.body);

    // Basic validation
    const err = validateOrderBody(req.body);
    if (err) return res.status(400).json({ success: false, error: err });

    // Build order document to match model
    const orderData = {
      userId: req.user?.userId || req.body.userId, // when checkAuth disabled, accept from body
      billingAddress: req.body.billingAddress,
      shippingAddress: req.body.shippingAddress,
      items: (req.body.items || []).map((item) => ({
        productId: item.productId,
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: item.quantity,
      })),
      subTotal: req.body.subTotal,
      shippingCost: req.body.shippingCost || 0,
      totalAmount: req.body.totalAmount,
      paymentMethod: req.body.paymentMethod || "COD",
    };

    // debug log model constructor
    console.log("Order model:", Order && typeof Order === "function" ? "OK model" : Order);

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    return res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("ORDER CREATE ERROR:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});


// ------------------------------------------------------
// 📌 2. GET ALL ORDERS (Admin or optional)
// ------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ------------------------------------------------------
// 📌 3. GET MY ORDERS (Logged in User)
// ------------------------------------------------------
router.get("/my-orders", checkAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// // ------------------------------------------------------
// // 📌 4. GET ORDER BY ID
// // ------------------------------------------------------
router.get("/my-order/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    // Find order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});



// // ------------------------------------------------------
// // 📌 5. UPDATE ORDER STATUS (optional)
// // ------------------------------------------------------
// router.put("/:id", async (req, res) => {
//   try {
//     const updateData = {
//       paymentStatus: req.body.paymentStatus,
//       orderStatus: req.body.orderStatus,
//     };

//     const updatedOrder = await Order.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     res.status(200).json({ success: true, order: updatedOrder });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });


// // ------------------------------------------------------
// // 📌 6. DELETE ORDER (optional)
// // ------------------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
