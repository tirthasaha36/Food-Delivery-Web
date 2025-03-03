const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ error: "Invalid token. User does not exist." });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token." });
    }
};

// ✅ Fix: Ensure adminMiddleware is correctly defined
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admins only!" });
    }
    next();
};

// ✅ Fix: Ensure proper exports
module.exports = { authMiddleware, adminMiddleware };
