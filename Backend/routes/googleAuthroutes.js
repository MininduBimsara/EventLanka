const express = require("express");
const passport = require("passport");
const passportConfig = require("../Config/passportConfig");
const { verifyGoogleToken } = passportConfig;

const router = express.Router();

// 1. Google Login Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. Google Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:5173/"); // Redirect to your frontend
  }
);

// 3. Logout Route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("http://localhost:3000"); // Redirect to home page after logout
  });
});

// 4. Get Authenticated User
router.get("/user", (req, res) => {
  res.json(req.user || null);
});

// 5. Endpoint to handle Google token verification from frontend
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Use the verifyGoogleToken function exported from your passport config
    const userData = await verifyGoogleToken(token);

    // Set user in session if needed
    if (req.session) {
      req.session.user = userData.user;
    }

    return res.json(userData);
  } catch (error) {
    console.error("Google token verification error:", error);
    return res.status(401).json({ message: "Google authentication failed" });
  }
});

module.exports = router;
