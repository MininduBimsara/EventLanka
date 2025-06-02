const Admin = require("../../models/Admin");

/**
 * Admin Repository - Handles all database operations for Admin model
 */
class AdminRepository {
  /**
   * Create a new admin profile
   * @param {Object} adminData - Admin data
   * @returns {Object} Created admin document
   */
  async create(adminData) {
    const admin = new Admin(adminData);
    return await admin.save();
  }

  /**
   * Find admin by user ID
   * @param {String} userId - User ID
   * @returns {Object|null} Admin document or null
   */
  async findByUserId(userId) {
    return await Admin.findOne({ user: userId });
  }

  /**
   * Find admin by ID
   * @param {String} adminId - Admin ID
   * @returns {Object|null} Admin document or null
   */
  async findById(adminId) {
    return await Admin.findById(adminId);
  }

  /**
   * Update admin by user ID
   * @param {String} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} Updated admin document
   */
  async updateByUserId(userId, updateData) {
    return await Admin.findOneAndUpdate({ user: userId }, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Find all admins
   * @param {Object} options - Query options
   * @returns {Array} Array of admin documents
   */
  async findAll(options = {}) {
    let query = Admin.find();

    if (options.populate) {
      query = query.populate(options.populate);
    }

    return await query;
  }

  /**
   * Find admins by department
   * @param {String} department - Department
   * @returns {Array} Array of admin documents
   */
  async findByDepartment(department) {
    return await Admin.find({ department });
  }

  /**
   * Find admins with specific permission
   * @param {String} permission - Permission name
   * @returns {Array} Array of admin documents
   */
  async findByPermission(permission) {
    const filter = {};
    filter[`permissions.${permission}`] = true;
    return await Admin.find(filter);
  }

  /**
   * Delete admin by user ID
   * @param {String} userId - User ID
   * @returns {Object|null} Deleted admin document
   */
  async deleteByUserId(userId) {
    return await Admin.findOneAndDelete({ user: userId });
  }

  /**
   * Update admin permissions
   * @param {String} userId - User ID
   * @param {Object} permissions - New permissions object
   * @returns {Object|null} Updated admin document
   */
  async updatePermissions(userId, permissions) {
    return await Admin.findOneAndUpdate(
      { user: userId },
      { permissions },
      { new: true }
    );
  }

  /**
   * Toggle two-factor authentication
   * @param {String} userId - User ID
   * @param {Boolean} enabled - Enable/disable 2FA
   * @returns {Object|null} Updated admin document
   */
  async toggleTwoFactor(userId, enabled) {
    return await Admin.findOneAndUpdate(
      { user: userId },
      { twoFactorEnabled: enabled },
      { new: true }
    );
  }
}

module.exports = {
  AdminRepository: new AdminRepository(),
};
