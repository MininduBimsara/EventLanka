// Repository/AuthRepository.js - Cleaned for Firebase integration
const User = require("../models/User");

/**
 * Auth Repository - Handles authentication-related database operations
 * Password reset functionality moved to Firebase
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
   * Update user password (for regular password changes, not reset)
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

  // All password reset methods removed - Firebase handles this now
  // - findByResetToken()
  // - updateResetToken()
  // - clearResetToken()
}

module.exports = new AuthRepository();
