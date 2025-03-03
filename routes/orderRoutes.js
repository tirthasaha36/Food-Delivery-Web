const express = require("express");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Place an order (Protected Route)
router.post("/", authMiddleware, async (req, res) => {
  const { restaurant, items, totalPrice } = req.body;

  if (!restaurant || !items || !totalPrice) {
    return res.status(400).json({ error: "All fields (restaurant, items, totalPrice) are required." });
  }

  try {
    const order = await Order.create({
      user: req.user.id, // Extract user ID from token
      restaurant,
      items,
      totalPrice,
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders for the logged-in user (Protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user from token
    const orders = await Order.find({ user: userId }).populate("restaurant").populate("items");

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
