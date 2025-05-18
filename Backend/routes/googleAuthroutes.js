// Backend: googleAuthRoutes.js
const express = require("express");
const { verifyGoogleToken } = require("../Services/googleAuthService");

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

    // Set a cookie for authentication as well
    res.cookie("authToken", userData.token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

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
  console.log("Before clearing - Cookies:", req.cookies);

  // Clear authToken
  res.clearCookie("authToken", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  // Clear session cookie if it exists
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
      }

      res.clearCookie("connect.sid", {
        path: "/", // Match how it was originally set
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      return res.status(200).json({ message: "Logged out successfully" });
    });
  } else {
    return res.status(200).json({ message: "Logged out successfully" });
  }
});


module.exports = router;
