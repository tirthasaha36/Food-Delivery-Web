const express = require("express");
const Razorpay = require("razorpay");
require("dotenv").config();
const crypto = require("crypto");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create an Order (Frontend Calls This)
router.post("/create-order", authMiddleware, async (req, res) => {
    try {
        const { amount, currency = "INR" } = req.body;

        if (!amount) {
            return res.status(400).json({ error: "Amount is required" });
        }

        const options = {
            amount: amount * 100, // Convert to paisa (smallest currency unit)
            currency,
            receipt: `order_rcpt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Verify Payment Signature (Callback from Razorpay)
router.post("/verify-payment", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ error: "Invalid payment signature" });
        }

        res.json({ message: "Payment verified successfully", payment_id: razorpay_payment_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
