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

module.exports = router;
