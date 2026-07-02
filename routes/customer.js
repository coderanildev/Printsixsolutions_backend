const express = require("express");
const router = express.Router();
const User = require("../model/User");
const mongoose = require("mongoose");
const checkAuth = require("../middleware/checkAuth");

/**
 * @route   GET /api/customer
 * @desc    Get all Customers
 */
router.get("/", checkAuth, async (req, res) => {
  try {
    const customers = await User.find({ role: "USER" }).select(
      "-password -refreshToken"
    );

    res.status(200).json({ success: true, customers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @route   GET /api/customer/:customerId
 * @desc    Get Customer by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select(
      "-password -refreshToken"
    );
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }
    res.status(200).json({ success: true, customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put("/status/:id", checkAuth, async (req, res) => {
  try {
    const status = req.body.status ? "Activated" : "Deactivated";
    const updatedData = {
      status: req.body.status,
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, msg: `Customer not ${status}` });
    }

    res.status(200).json({ success: true, customer: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
