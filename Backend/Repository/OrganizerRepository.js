const Organizer = require("../../models/Organizer");

/**
 * Organizer Repository - Handles all database operations for Organizer model
 */
class OrganizerRepository {
  /**
   * Create a new organizer profile
   * @param {Object} organizerData - Organizer data
   * @returns {Object} Created organizer document
   */
  async create(organizerData) {
    const organizer = new Organizer(organizerData);
    return await organizer.save();
  }

  /**
   * Find organizer by user ID
   * @param {String} userId - User ID
   * @returns {Object|null} Organizer document or null
   */
  async findByUserId(userId) {
    return await Organizer.findOne({ user: userId });
  }

  /**
   * Find organizer by ID
   * @param {String} organizerId - Organizer ID
   * @returns {Object|null} Organizer document or null
   */
  async findById(organizerId) {
    return await Organizer.findById(organizerId);
  }

  /**
   * Update organizer by user ID
   * @param {String} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} Updated organizer document
   */
  async updateByUserId(userId, updateData) {
    return await Organizer.findOneAndUpdate({ user: userId }, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Find all public organizers
   * @param {Object} options - Query options
   * @returns {Array} Array of public organizer documents
   */
  async findPublic(options = {}) {
    let query = Organizer.find({ isPublic: true });

    if (options.populate) {
      query = query.populate(options.populate);
    }

    return await query;
  }

  /**
   * Find organizers by category
   * @param {String} category - Category
   * @returns {Array} Array of organizer documents
   */
  async findByCategory(category) {
    return await Organizer.find({ categories: category });
  }

  /**
   * Delete organizer by user ID
   * @param {String} userId - User ID
   * @returns {Object|null} Deleted organizer document
   */
  async deleteByUserId(userId) {
    return await Organizer.findOneAndDelete({ user: userId });
  }
}

module.exports = {
  OrganizerRepository: new OrganizerRepository(),
};