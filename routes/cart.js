const express = require("express");
const router = express.Router();
const Cart = require("../model/Cart");
const checkAuth = require("../middleware/checkAuth");

router.post("/", checkAuth, async (req, res) => {
  try {
    const { productId, name, salePrice, quantity, imageUrl } = req.body;
    const user = req.user.userId;

    if (!productId || !name || !salePrice || !quantity || !imageUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    const updatedItem = await Cart.findOneAndUpdate(
      { user, productId },
      { $inc: { quantity: parsedQuantity } },
      { new: true }
    );

    if (updatedItem) {
      return res.status(200).json(updatedItem);
    }

    const newCartItem = new Cart({
      productId,
      name,
      salePrice,
      quantity: parsedQuantity,
      imageUrl,
      user,
    });

    await newCartItem.save();
    res.status(201).json(newCartItem);
  } catch (error) {
    console.error("Error saving cart item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", checkAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const cartItems = await Cart.find({ user: userId });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:productId", checkAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    if (parsedQuantity === 0) {
      await Cart.findOneAndDelete({ user: userId, productId });
      return res
        .status(200)
        .json({ message: "Item removed from cart due to 0 quantity" });
    }

    const updatedItem = await Cart.findOneAndUpdate(
      { user: userId, productId },
      { quantity: parsedQuantity },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:productId", checkAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const deletedItem = await Cart.findOneAndDelete({
      user: userId,
      productId,
    });

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    res
      .status(200)
      .json({ message: "Item removed from cart", item: deletedItem });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
