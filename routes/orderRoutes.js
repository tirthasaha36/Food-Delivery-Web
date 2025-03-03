const express = require("express");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Place an order (Protected Route)
router.post("/", authMiddleware, async (req, res) => {
  const { restaurant, items, totalPrice } = req.body;

  try {
    const order = await Order.create({
      user: req.user.id,  // Extract user ID from token
      restaurant,
      items,
      totalPrice
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders (Protected Route)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("restaurant")
      .populate("user", "name email");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
