const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Category = require("../model/Category");
const mongoose = require("mongoose");
const checkAuth = require("../middleware/checkAuth");

// Add Category
router.post(
  "/",
  checkAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("imageUrl").optional().isURL().withMessage("Invalid image URL"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const newCategory = new Category({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        slug: req.body.slug,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        parentId: req.body.parentId,
        userId: req.user.userId,
      });

      const result = await newCategory.save();
      res.status(201).json({ success: true, newCategory: result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get categories of the logged-in user
router.get("/my-categories", checkAuth, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.userId });
    res.status(200).json({ success: true, categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get category by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put("/:id", checkAuth, async (req, res) => {
  try {
    const updatedData = {
      title: req.body.title,
      slug: req.body.slug,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      isActive: req.body.isActive,
      parentId: req.body.parentId,
    };

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, category: updatedCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
