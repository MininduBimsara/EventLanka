const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

exports.protect = asyncHandler(async (req, res, next) => {
  // Extract token from cookies instead of headers
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and attach it to req.user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Attach user object to request
    next(); // Proceed to the next middleware
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }
    res.status(400).json({ message: "Invalid token" });
  }
});

// exports.isAdmin = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     return next(); // User is admin, proceed to the next middleware
//   } else {
//     return res.status(403).json({ message: "Access denied. Admins only." });
//   }
// };
// exports.isUser = (req, res, next) => {
//   if (req.user && req.user.role === "user") {
//     return next(); // User is a regular user, proceed to the next middleware
//   } else {
//     return res.status(403).json({ message: "Access denied. Users only." });
//   }
// };
// exports.isOwner = (req, res, next) => {
//   if (req.user && req.user._id.toString() === req.params.id) {
//     return next(); // User is the owner of the resource, proceed to the next middleware
//   } else {
//     return res.status(403).json({ message: "Access denied. Not the owner." });
//   }
// };