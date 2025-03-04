const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["COD", "UPI", "Card"], required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ["pending", "confirmed", "delivered"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
