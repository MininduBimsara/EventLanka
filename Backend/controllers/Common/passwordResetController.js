// Controllers/Common/passwordResetController.js - Fixed implementation
const passwordResetService = require("../../Services/Common/passwordResetService");

// Generate backend token for Firebase email (this is what Firebase calls)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const result = await passwordResetService.requestPasswordReset(email);

    // Return the reset token for Firebase to use in the email link
    res.status(200).json({
      message: result.message,
      resetToken: result.resetToken,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: error.message || "Something went wrong. Please try again.",
    });
  }
};

// Verify reset token
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    const result = await passwordResetService.verifyToken(token);
    res.status(200).json({
      valid: true,
      message: result.message,
      email: result.email,
    });
  } catch (error) {
    console.error("Verify token error:", error);
    res.status(400).json({
      valid: false,
      message:
        error.message || "Password reset token is invalid or has expired",
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const result = await passwordResetService.resetUserPassword(
      token,
      password
    );

    // Set the cookie for auto-login
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: result.message,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(400).json({
      message: error.message || "Something went wrong. Please try again.",
    });
  }
};

module.exports = {
  forgotPassword,
  verifyResetToken,
  resetPassword,
};
