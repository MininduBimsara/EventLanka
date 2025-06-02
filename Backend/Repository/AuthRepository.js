const User = require("../../models/User");

/**
 * Auth Repository - Handles authentication-related database operations
 */
class AuthRepository {
  /**
   * Find user by Google ID
   * @param {String} googleId - Google ID
   * @returns {Object|null} User document or null
   */
  async findByGoogleId(googleId) {
    return await User.findOne({ googleId });
  }

  /**
   * Create user from Google auth
   * @param {Object} googleUserData - Google user data
   * @returns {Object} Created user document
   */
  async createGoogleUser(googleUserData) {
    const user = new User(googleUserData);
    return await user.save();
  }

  /**
   * Update existing Google user
   * @param {String} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} Updated user document
   */
  async updateGoogleUser(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Find user with reset token
   * @param {String} token - Hashed reset token
   * @returns {Object|null} User document or null
   */
  async findByResetToken(token) {
    return await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  }

  /**
   * Update user reset token
   * @param {String} userId - User ID
   * @param {String} token - Hashed token
   * @param {Date} expiry - Token expiry date
   * @returns {Object|null} Updated user document
   */
  async updateResetToken(userId, token, expiry) {
    return await User.findByIdAndUpdate(
      userId,
      {
        resetPasswordToken: token,
        resetPasswordExpires: expiry,
      },
      { new: true }
    );
  }

  /**
   * Clear reset token
   * @param {String} userId - User ID
   * @returns {Object|null} Updated user document
   */
  async clearResetToken(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
      },
      { new: true }
    );
  }

  /**
   * Update user password
   * @param {String} userId - User ID
   * @param {String} hashedPassword - New hashed password
   * @returns {Object|null} Updated user document
   */
  async updatePassword(userId, hashedPassword) {
    return await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
  }
}

module.exports = new AuthRepository();
