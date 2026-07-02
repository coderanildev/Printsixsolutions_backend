const express = require("express");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const User = require("../model/User");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    req.userDoc = user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Address validation rules
const addressValidation = [
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("phone").notEmpty().withMessage("Valid phone number is required"),
  body("address1").notEmpty().withMessage("Address line 1 is required"),
  body("address2").notEmpty().withMessage("Address line 2 is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("postalCode").notEmpty().withMessage("Postal code is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("state").notEmpty().withMessage("State is required"),
];

// Add New Address
router.post("/", checkAuth, getUser, addressValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const user = req.userDoc;
    const newAddress = req.body;

    if (user.addresses.length === 0) {
      newAddress.isDefaultBillingAddress = true;
      newAddress.isDefaultShippingAddress = true;
    }
    
    user.addresses.push(newAddress);
    await user.save();

    res.status(200).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Addresses
router.get("/", checkAuth, getUser, async (req, res) => {

  try {
    const user = await User.findById(req.user.userId);                                       

    if (!user) return res.status(404).json({ message: 'User not found' });

    const addresses = user?.addresses || [];

    return res.status(200).json({ addresses });
  } catch (err) {
    next(err);
  }
});

// Get Address by ID
router.get("/:addressId", checkAuth, getUser, async (req, res) => {
  const { addressId } = req.params;
  const address = req.userDoc.addresses.id(addressId);

  if (!address) return res.status(404).json({ message: "Address not found" });

  res.status(200).json({ address });
});

// Get Default Address
router.get("/default", checkAuth, getUser, async (req, res) => {

  try {
    const defaultAddress = req.userDoc.addresses.find((addr) => addr.isDefault);

    if (!defaultAddress) {
      return res.status(404).json({ message: "No default address set" });
    }

    res.status(200).json({ address: defaultAddress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Set Default Address
router.patch(
  "/:addressId/default",
  checkAuth,
  getUser,
  async (req, res) => {
    try {
      const { addressId } = req.params;
      const user = req.userDoc;

      const address = user.addresses.id(addressId);
      if (!address)
        return res.status(404).json({ message: "Address not found" });

      // Set all addresses to isDefault: false
      user.addresses.forEach((addr) => {
        addr.isDefault = addr._id.toString() === addressId;
      });

      await user.save();

      res.status(200).json({
        message: "Default address updated",
        addresses: user.addresses,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Update Address
router.put(
  "/:addressId",
  checkAuth,
  getUser,
  addressValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { addressId } = req.params;
      const updatedData = req.body;
      const address = req.userDoc.addresses.id(addressId);

      if (!address)
        return res.status(404).json({ message: "Address not found" });

      Object.assign(address, updatedData);
      await req.userDoc.save();

      res
        .status(200)
        .json({ message: "Address updated", addresses: req.userDoc.addresses });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Delete Address
router.delete("/:addressId", checkAuth, getUser, async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = req.userDoc;
    console.log("user: ", user);
    const address = user.addresses.id(addressId);
    console.log("address: ", address);
    
    if (!address) return res.status(404).json({ message: "Address not found" });

    const wasDefault = address.isDefault;

    address.deleteOne();
    await user.save();

    // If deleted address was default, promote the first remaining one
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
      await user.save();
    }

    res.status(200).json({
      message: "Address deleted",
      addresses: user.addresses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
