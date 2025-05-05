// Backend: googleAuthRoutes.js
const express = require("express");
const { verifyGoogleToken } = require("../services/googleAuthService");

const router = express.Router();

// Handle Google authentication from frontend
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Verify token and get user data
    const userData = await verifyGoogleToken(token);

    // Set authentication in session if needed
    if (req.session) {
      req.session.user = userData.user;
      req.session.isAuthenticated = true;
    }

    return res.json(userData);
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(401).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
});

// Get current authenticated user
router.get("/user", (req, res) => {
  // Check if user is in session
  if (req.session && req.session.user) {
    return res.json(req.session.user);
  }

  return res.json(null);
});

// Logout
router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }

      res.clearCookie("connect.sid"); // Clear the session cookie
      return res.json({ message: "Logged out successfully" });
    });
  } else {
    return res.json({ message: "Not logged in" });
  }
});

module.exports = router;
