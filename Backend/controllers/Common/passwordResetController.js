const User = require("../../models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Request password reset email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user with the provided email
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return res.status(200).json({
        message:
          "If that email exists in our system, a password reset link has been sent.",
      });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token for security
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save token to user document with expiration time (10 minutes)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Email content
    const message = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Please click on the link below to reset your password:</p>
      <a href="${resetUrl}" clicktracking="off">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    // Send email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password Reset Request",
        html: message,
      });

      res.status(200).json({
        message:
          "If that email exists in our system, a password reset link has been sent.",
      });
    } catch (error) {
      console.error("Email send error:", error);

      // Reset the tokens in case of email failure
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res
        .status(500)
        .json({ message: "Could not send email. Please try again." });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

// Verify reset token
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash token to compare with stored hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with the token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    // Token is valid
    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    console.error("Verify token error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Hash token to compare with stored hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with the token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and remove reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // Optional: Auto-login after password reset by generating a new JWT
    const loginToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", loginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Password has been reset successfully",
      token: loginToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
          ? `/profile-images/${user.profileImage}`
          : null,
      },
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

module.exports = {
  forgotPassword,
  verifyResetToken,
  resetPassword,
};
