const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Slider = require("../model/Slider");
const mongoose = require("mongoose");
const checkAuth = require("../middleware/checkAuth");

console.log("router",router);
console.log("checkAuth",checkAuth)

// ==========================
//      ADD SLIDER
// ==========================
router.post( "/",checkAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("slug").notEmpty().withMessage("Slug is required"),
    body("imageUrl").notEmpty().withMessage("Image is required"),

  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const newSlider = new Slider({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        shortDescription: req.body.shortDescription,
        imageUrl: req.body.imageUrl,
        isActive: req.body.isActive,
        userId: req.user.userId,
      });

      const result = await newSlider.save();
      res.status(201).json({ success: true, slider: result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// ==========================
//      GET ALL SLIDERS
// ==========================
router.get("/", async (req, res) => {
  try {
    const sliders = await Slider.find();
    res.status(200).json({ success: true, sliders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================
//   GET LOGGED-IN USER SLIDERS
// ==========================
router.get("/my-sliders", checkAuth, async (req, res) => {
  try {
    const sliders = await Slider.find({ userId: req.user.userId });
    res.status(200).json({ success: true, sliders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================
//      GET SLIDER BY ID
// ==========================
router.get("/:id", async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) {
      return res
        .status(404)
        .json({ success: false, message: "Slider not found" });
    }
    res.status(200).json({ success: true, slider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================
//      GET SLIDER BY SLUG
// ==========================
router.get("/slug/:slug", async (req, res) => {
  try {
    const slider = await Slider.findOne({ slug: req.params.slug });
    if (!slider) {
      return res
        .status(404)
        .json({ success: false, message: "Slider not found" });
    }
    res.status(200).json({ success: true, slider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================
//       UPDATE SLIDER
// ==========================
router.put("/:id", checkAuth, async (req, res) => {
  try {
    const updatedData = {
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      shortDescription: req.body.shortDescription,
      imageUrl: req.body.imageUrl,
      isActive: req.body.isActive,
    };

    const updatedSlider = await Slider.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedSlider) {
      return res
        .status(404)
        .json({ success: false, message: "Slider not found" });
    }

    res.status(200).json({ success: true, slider: updatedSlider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================
//       DELETE SLIDER
// ==========================
router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const deletedSlider = await Slider.findByIdAndDelete(req.params.id);

    if (!deletedSlider) {
      return res
        .status(404)
        .json({ success: false, message: "Slider not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Slider deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
