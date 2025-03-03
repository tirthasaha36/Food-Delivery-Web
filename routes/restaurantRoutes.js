const express = require("express");
const Restaurant = require("../models/Restaurant");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware"); // ✅ FIXED IMPORT

const router = express.Router();

// Create a new restaurant (Admin Only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, address, cuisine, menu } = req.body;

        const newRestaurant = new Restaurant({ name, address, cuisine, menu });
        await newRestaurant.save();

        res.status(201).json({ message: "Restaurant added successfully", restaurant: newRestaurant });
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

// ✅ Get a single restaurant by ID
router.get("/:id", async (req, res) => {
  try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) {
          return res.status(404).json({ error: "Restaurant not found" });
      }
      res.json(restaurant);
  } catch (err) {
      res.status(500).json({ error: "Invalid restaurant ID format" });
  }
});

// ✅ Update a restaurant (Admin Only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { name, address, cuisine, menu } = req.body;

  try {
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
          req.params.id,
          { name, address, cuisine, menu },
          { new: true, runValidators: true } // Return updated restaurant & validate fields
      );

      if (!updatedRestaurant) {
          return res.status(404).json({ error: "Restaurant not found" });
      }

      res.json({ message: "Restaurant updated successfully", restaurant: updatedRestaurant });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a restaurant (Admin Only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
      const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);

      if (!deletedRestaurant) {
          return res.status(404).json({ error: "Restaurant not found" });
      }

      res.json({ message: "Restaurant deleted successfully" });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

module.exports = router;
