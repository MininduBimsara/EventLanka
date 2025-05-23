const User = require("../../models/User");
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

  // Find user with the provided email
  const user = await User.findOne({ email });

  // If no user is found, we still return a success message for security reasons
  if (!user) {
    return {
      message:
        "If that email exists in our system, a password reset link has been sent.",
    };
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

  // Send email using our email service
  try {
    await sendPasswordResetEmail(user.email, resetUrl);

    return {
      message:
        "If that email exists in our system, a password reset link has been sent.",
    };
  } catch (error) {
    // Reset the tokens in case of email failure
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    throw new Error("Could not send email. Please try again.");
  }
};

/**
 * Verify a password reset token
 * @param {string} token - Reset token
 * @returns {Promise<Object>} - Response message
 */
const verifyToken = async (token) => {
  // Hash token to compare with stored hashed token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with the token and check if token is still valid
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Password reset token is invalid or has expired");
  }

  // Token is valid
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

  // Hash token to compare with stored hashed token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with the token and check if token is still valid
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Password reset token is invalid or has expired");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update user password and remove reset token fields
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  // Generate a new JWT for auto-login
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
