// Services/Common/passwordResetService.js - Restored and simplified
const UserRepository = require("../../Repository/UserRepository");
const AuthRepository = require("../../Repository/AuthRepository");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Request a password reset email (not used - Firebase handles this)
 * Keeping this for potential future use
 */
const requestPasswordReset = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await UserRepository.findByEmail(email);
  if (!user) {
    return {
      message:
        "If that email exists in our system, a password reset link has been sent.",
    };
  }

  // Generate and hash token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Store reset token in database (you'll need to add these fields back to User model)
  const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await UserRepository.updateById(user._id, {
    resetPasswordToken: hashedToken,
    resetPasswordExpires: tokenExpiry,
  });

  return {
    message:
      "If that email exists in our system, a password reset link has been sent.",
    resetToken: resetToken, // Return unhashed token for email link
  };
};

/**
 * Verify a password reset token
 */
const verifyToken = async (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with valid reset token
  const user = await UserRepository.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Password reset token is invalid or has expired");
  }

  return { message: "Token is valid", email: user.email };
};

/**
 * Reset user password with valid token
 */
const resetUserPassword = async (token, password) => {
  if (!password) {
    throw new Error("Password is required");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with valid reset token
  const user = await UserRepository.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Password reset token is invalid or has expired");
  }

  // Hash new password and update
  const hashedPassword = await bcrypt.hash(password, 10);
  await AuthRepository.updatePassword(user._id, hashedPassword);

  // Clear reset token
  await UserRepository.updateById(user._id, {
    resetPasswordToken: undefined,
    resetPasswordExpires: undefined,
  });

  // Generate JWT
  const loginToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
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
  };
};

module.exports = {
  requestPasswordReset,
  verifyToken,
  resetUserPassword,
};
