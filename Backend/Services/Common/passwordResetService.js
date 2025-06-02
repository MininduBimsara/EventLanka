// passwordResetService.js - Refactored to use UserRepository
const UserRepository = require("../repositories/UserRepository");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendPasswordResetEmail } = require("../emailService");

/**
 * Request a password reset email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - Response message
 */
const requestPasswordReset = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  // Use repository to find user
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

  // Use repository to update reset token
  const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await UserRepository.updateResetToken(user._id, hashedToken, tokenExpiry);

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await sendPasswordResetEmail(user.email, resetUrl);
    return {
      message:
        "If that email exists in our system, a password reset link has been sent.",
    };
  } catch (error) {
    // Clear tokens in case of email failure using repository
    await UserRepository.clearResetToken(user._id);
    throw new Error("Could not send email. Please try again.");
  }
};

/**
 * Verify a password reset token
 * @param {string} token - Reset token
 * @returns {Promise<Object>} - Response message
 */
const verifyToken = async (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Use repository to find user with reset token
  const user = await UserRepository.findByResetToken(hashedToken);

  if (!user) {
    throw new Error("Password reset token is invalid or has expired");
  }

  return { message: "Token is valid" };
};

/**
 * Reset user password with valid token
 * @param {string} token - Reset token
 * @param {string} password - New password
 * @returns {Promise<Object>} - User data and JWT token
 */
const resetUserPassword = async (token, password) => {
  if (!password) {
    throw new Error("Password is required");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Use repository to find user with reset token
  const user = await UserRepository.findByResetToken(hashedToken);

  if (!user) {
    throw new Error("Password reset token is invalid or has expired");
  }

  // Hash new password and update using repository
  const hashedPassword = await bcrypt.hash(password, 10);
  await UserRepository.updatePassword(user._id, hashedPassword);
  await UserRepository.clearResetToken(user._id);

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