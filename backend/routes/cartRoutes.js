const express = require("express");
const Cart = require("../models/Cart");
const { authMiddleware } = require("../middleware/authMiddleware");
const MenuItem = require("../models/MenuItem");

const router = express.Router();

/** 🛒 Get User's Cart */
router.get("/", authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.itemId");
        if (!cart) {
            return res.status(200).json({ message: "Cart is empty", cart: [] });
        }
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
});

/** ➕ Add Item to Cart */
router.post("/add", authMiddleware, async (req, res) => {
    const { itemId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }
        const itemIndex = cart.items.findIndex((item) => item.itemId.toString() === itemId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ itemId, quantity });
        }
        await cart.save();
        res.status(201).json({ message: "Item added to cart", cart });
    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
});

/** ✏️ Update Cart Item Quantity */
router.put("/update", authMiddleware, async (req, res) => {
    const { itemId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        const itemIndex = cart.items.findIndex((item) => item.itemId.toString() === itemId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
        } else {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        await cart.save();
        res.status(200).json({ message: "Cart updated", cart });
    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
});

/** ❌ Remove Item from Cart */
router.delete("/remove/:itemId", authMiddleware, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        cart.items = cart.items.filter((item) => item.itemId.toString() !== req.params.itemId);
        await cart.save();
        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
});

/** 🗑️ Clear Cart */
router.delete("/clear", authMiddleware, async (req, res) => {
    try {
        await Cart.findOneAndDelete({ user: req.user._id });
        res.status(200).json({ message: "Cart cleared" });
    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
});

module.exports = router;