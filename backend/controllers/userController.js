const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Send token in HTTP-only cookie for security
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      success: true,
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, profilePic: user.profilePic },
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Update User Profile (Supports Profile Pic Upload & Delete)
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, password, removeProfilePic } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // 🔹 Handle Profile Picture Removal
    if (removeProfilePic === "true" && user.profilePic) {
      // Extract Cloudinary public_id correctly
      const publicId = user.profilePic.match(/\/v\d+\/(.+)\./)[1];

      // Delete image from Cloudinary
      await cloudinary.uploader.destroy(publicId);
      user.profilePic = null; // Remove from DB
    }

    // 🔹 Handle Profile Picture Update
    if (req.file) {
      // Delete previous Cloudinary image if it exists
      if (user.profilePic) {
        const publicId = user.profilePic.match(/\/v\d+\/(.+)\./)[1];
        await cloudinary.uploader.destroy(publicId);
      }

      console.log("Cloudinary Uploaded File:", req.file); // Debugging log
      user.profilePic = req.file.secure_url; // Save Cloudinary URL
    }

    // 🔹 Update Other Profile Fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ success: true, message: "Profile updated successfully", user });

  } catch (err) {
    console.error("❌ Profile Update Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Users (Admin Only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (err) {
    console.error("Fetch Users Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
