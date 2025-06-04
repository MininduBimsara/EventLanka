const User = require("../models/User");

/**
 * User Repository - Handles all database operations for User model
 */
class UserRepository {
  /**
   * Find user by email
   * @param {String} email - User email
   * @returns {Object|null} User document or null
   */
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  /**
   * Find user by ID
   * @param {String} userId - User ID
   * @returns {Object|null} User document or null
   */
  async findById(userId) {
    return await User.findById(userId);
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Object} Created user document
   */
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Update user by ID
   * @param {String} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} Updated user document
   */
  async updateById(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete user by ID
   * @param {String} userId - User ID
   * @returns {Object|null} Deleted user document
   */
  async deleteById(userId) {
    return await User.findByIdAndDelete(userId);
  }

  /**
   * Find all users with optional filters
   * @param {Object} filter - MongoDB filter object
   * @param {Object} options - Query options (limit, skip, sort)
   * @returns {Array} Array of user documents
   */
  async findAll(filter = {}, options = {}) {
    let query = User.find(filter);

    if (options.sort) query = query.sort(options.sort);
    if (options.limit) query = query.limit(options.limit);
    if (options.skip) query = query.skip(options.skip);

    return await query;
  }

  /**
   * Count users with optional filter
   * @param {Object} filter - MongoDB filter object
   * @returns {Number} Count of documents
   */
  async count(filter = {}) {
    return await User.countDocuments(filter);
  }

  /**
   * Check if user exists by email
   * @param {String} email - User email
   * @returns {Boolean} True if user exists
   */
  async existsByEmail(email) {
    const user = await User.findOne({ email }).select("_id");
    return !!user;
  }

  /**
   * Find users by role
   * @param {String} role - User role
   * @returns {Array} Array of user documents
   */
  async findByRole(role) {
    return await User.find({ role });
  }

  /**
   * Check if user exists by ID
   * @param {String} userId - User ID
   * @returns {Boolean} True if user exists
   */
  async exists(userId) {
    const user = await User.findById(userId).select("_id");
    return !!user;
  }

  /**
   * Find users by multiple IDs
   * @param {Array} userIds - Array of user IDs
   * @returns {Array} Array of user documents
   */
  async findByIds(userIds) {
    return await User.find({ _id: { $in: userIds } });
  }

  /**
   * Find users by status
   * @param {String} status - User status
   * @returns {Array} Array of user documents
   */
  async findByStatus(status) {
    return await User.find({ status });
  }

  /**
   * Update user status
   * @param {String} userId - User ID
   * @param {String} status - New status
   * @returns {Object|null} Updated user document
   */
  async updateStatus(userId, status) {
    return await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true, runValidators: true }
    );
  }

  /**
   * Find users by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} options - Query options
   * @returns {Array} Array of user documents
   */
  async findByDateRange(startDate, endDate, options = {}) {
    const filter = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    return await this.findAll(filter, options);
  }
}

module.exports = new UserRepository();
