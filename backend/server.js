require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");


// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((error) => {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1); // Exit process if MongoDB connection fails
  });

// API Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/restaurants", require("./routes/restaurantRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));


// Cleanup Job: Remove expired reset tokens every hour
const cleanupExpiredTokens = async () => {
  try {
    const result = await User.updateMany(
      { resetPasswordExpires: { $lt: Date.now() } },
      { $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 } }
    );
    if (result.modifiedCount > 0) {
      console.log(`🧹 Cleaned up ${result.modifiedCount} expired reset tokens`);
    }
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  }
};

// Run cleanup job every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000); // 1 



// Default Route
app.get("/", (req, res) => {
  res.send("🍔 Food Delivery API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
