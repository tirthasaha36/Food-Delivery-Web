const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Users (Admin Only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Forgot Password
// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) return res.status(404).json({ error: "User not found" });

//   const resetToken = crypto.randomBytes(20).toString("hex");
//   user.resetPasswordToken = resetToken;
//   user.resetPasswordExpires = Date.now() + 86400000; // 24 hours
//   await user.save();

//   const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
//   });

//   const mailOptions = {
//     to: user.email,
//     from: process.env.EMAIL_USER,
//     subject: "Password Reset",
//     text: `Click this link to reset your password: http://localhost:5000/reset-password/${resetToken}`
//   };

//   transporter.sendMail(mailOptions, (err) => {
//     if (err) return res.status(500).json({ error: "Email could not be sent" });
//     res.json({ message: "Reset email sent successfully" });
//   });
// };
