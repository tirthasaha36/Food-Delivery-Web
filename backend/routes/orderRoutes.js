const express = require("express");
const Order = require("../models/Order");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { adminMiddleware } = require("../middlewares/adminMiddleware");

const router = express.Router();

// ✅ Place an Order
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

// ✅ Get All Orders (Admin Only)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("restaurant", "name")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get User's Orders (Authenticated User)
router.get("/my-orders", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate("restaurant items.itemId");
        
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get Order by ID (Authenticated User)
router.get("/:orderId", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate("items.itemId");

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update Order Status (Admin Only)
router.put("/:orderId/status", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["pending", "confirmed", "delivered"];

        console.log("🔍 Received Order Status:", status);

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: `Invalid order status. Allowed values: ${validStatuses.join(", ")}` });
        }

        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });

        order.status = status;
        await order.save();

        res.json({ message: "Order status updated successfully", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete Order (Admin Only)
router.delete("/:orderId", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });

        res.json({ message: "Order deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
