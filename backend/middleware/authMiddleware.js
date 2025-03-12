const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized, no token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ error: "User not found" });

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

exports.adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied, admin only" });
  }
};
