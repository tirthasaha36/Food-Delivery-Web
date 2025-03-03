const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// Place an order
router.post("/", async (req, res) => {
  const { user, restaurant, items, totalPrice } = req.body;

  try {
    const order = await Order.create({ user, restaurant, items, totalPrice });
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("restaurant");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
