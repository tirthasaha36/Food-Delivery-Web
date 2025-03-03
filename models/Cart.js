const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ],
    totalPrice: { type: Number, required: true, default: 0 }
});

/** ✅ Automatically calculate `totalPrice` before saving */
CartSchema.pre("save", async function (next) {
    let total = 0;

    for (let item of this.items) {
        const menuItem = await mongoose.model("MenuItem").findById(item.itemId);
        if (menuItem) {
            total += menuItem.price * item.quantity;
        }
    }

    this.totalPrice = total;
    next();
});

module.exports = mongoose.model("Cart", CartSchema);
