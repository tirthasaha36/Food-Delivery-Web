const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
});

// Middleware to remove expired reset tokens before saving
UserSchema.pre("save", function (next) {
    if (this.resetPasswordExpires && this.resetPasswordExpires < Date.now()) {
        this.resetPasswordToken = undefined;
        this.resetPasswordExpires = undefined;
    }
    next();
});

module.exports = mongoose.model("User", UserSchema);
