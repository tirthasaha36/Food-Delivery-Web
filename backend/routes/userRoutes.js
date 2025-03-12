const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/User");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

const router = express.Router();

// ✅ User Registration
router.post("/register", userController.registerUser);

// ✅ User Login
router.post("/login", userController.loginUser);

// ✅ Fetch user profile (Protected)
router.get("/me", authMiddleware, userController.getUserProfile);

// ✅ Update user profile (Protected)
router.put("/me", authMiddleware, userController.updateUserProfile);

// ✅ Get all users (Admin Only)
router.get("/", authMiddleware, adminMiddleware, userController.getUsers);

// 🔹 Forgot Password (Generate & Send Reset Token)
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry

        // Save the token in the database
        await user.save();

        console.log(`🔑 Generated Reset Token: ${resetToken}`); // Debugging log

        // Email transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset",
            text: `Click this link to reset your password: http://localhost:5000/reset-password/${resetToken}`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("❌ Email Sending Error:", err);
                return res.status(500).json({ success: false, message: "Email could not be sent" });
            }
            console.log(`📩 Email sent: ${info.response}`);
            res.json({ success: true, message: "Reset email sent successfully" });
        });

    } catch (err) {
        console.error("❌ Forgot Password Error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// 🔹 Reset Password
router.post("/reset-password/:token", async (req, res) => {
    const { password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() } // Ensure token is not expired
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        // Hash new password and update user
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined; // Clear token after reset
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ success: true, message: "Password reset successfully" });
    } catch (err) {
        console.error("❌ Reset Password Error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
