const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  items: [{ name: String, price: Number, quantity: Number }],
  status: { type: String, enum: ["pending", "preparing", "out for delivery", "delivered"], default: "pending" },
});

module.exports = mongoose.model("Order", OrderSchema);
