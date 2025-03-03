const express = require("express");
const Restaurant = require("../models/Restaurant");

const router = express.Router();

// Add a restaurant
router.post("/", async (req, res) => {
  const { name, address, menu } = req.body;

  try {
    const restaurant = await Restaurant.create({ name, address, menu });
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
