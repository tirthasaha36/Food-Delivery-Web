const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { authMiddleware } = require("../middleware/authMiddleware"); // Ensure correct import
const { adminMiddleware } = require("../middleware/adminMiddleware"); // Ensure correct import

const router = express.Router();

// Debugging: Check if middleware functions are properly imported
console.log("authMiddleware:", authMiddleware);
console.log("adminMiddleware:", adminMiddleware);

// Place an Order
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { restaurant, items, totalPrice, paymentMethod, address } = req.body;

        // Validate request body
        if (!restaurant || !items || items.length === 0 || !totalPrice || !paymentMethod || !address) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate items
        for (let item of items) {
            if (!item.itemId || !item.name || !item.price || !item.quantity) {
                return res.status(400).json({ error: "Each item must include itemId, name, price, and quantity" });
            }
        }

        const newOrder = new Order({
            user: req.user.id,
            restaurant,
            items,
            totalPrice,
            paymentMethod,
            address
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully", order: newOrder });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/** ✅ Get User's Orders */
router.get("/", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate("items.itemId");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/** ✅ Get Order by ID */
router.get("/:orderId", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate("items.itemId");

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/** ✅ Update Order Status (Admin Only) */
router.put("/:orderId/status", authMiddleware, adminMiddleware, async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = status;
        await order.save();

        res.json({ message: "Order status updated", order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/** ✅ Delete Order (Admin Only) */
router.delete("/:orderId", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.orderId);
        res.json({ message: "Order deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
