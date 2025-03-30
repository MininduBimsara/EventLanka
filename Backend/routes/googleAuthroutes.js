const express = require("express");
const passport = require("passport");

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
    res.redirect("http://localhost:3000/dashboard"); // Redirect to your frontend
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

module.exports = router;
