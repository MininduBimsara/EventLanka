// DiscountRepository.js
const Discount = require("../../models/Discount");

/**
 * Discount Repository - Handles all database operations for Discount model
 */
class DiscountRepository {
  /**
   * Find discount by code
   * @param {String} code - Discount code
   * @returns {Object|null} Discount document or null
   */
  async findByCode(code) {
    return await Discount.findOne({ code });
  }

  /**
   * Find discount by ID
   * @param {String} discountId - Discount ID
   * @returns {Object|null} Discount document or null
   */
  async findById(discountId) {
    return await Discount.findById(discountId);
  }

  /**
   * Create a new discount
   * @param {Object} discountData - Discount data
   * @returns {Object} Created discount document
   */
  async create(discountData) {
    return await Discount.create(discountData);
  }

  /**
   * Update discount by ID
   * @param {String} discountId - Discount ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} Updated discount document
   */
  async updateById(discountId, updateData) {
    return await Discount.findByIdAndUpdate(discountId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete discount by ID
   * @param {String} discountId - Discount ID
   * @returns {Object|null} Deleted discount document
   */
  async deleteById(discountId) {
    return await Discount.findByIdAndDelete(discountId);
  }

  /**
   * Find active discounts
   * @returns {Array} Array of active discount documents
   */
  async findActive() {
    const now = new Date();
    return await Discount.find({
      is_active: true,
      start_date: { $lte: now },
      end_date: { $gte: now },
    });
  }

  /**
   * Check if discount code is valid
   * @param {String} code - Discount code
   * @returns {Boolean} True if valid
   */
  async isValidCode(code) {
    const now = new Date();
    const discount = await Discount.findOne({
      code,
      is_active: true,
      start_date: { $lte: now },
      end_date: { $gte: now },
      usage_count: { $lt: "$usage_limit" },
    });
    return !!discount;
  }

  /**
   * Increment usage count
   * @param {String} discountId - Discount ID
   * @returns {Object|null} Updated discount document
   */
  async incrementUsage(discountId) {
    return await Discount.findByIdAndUpdate(
      discountId,
      { $inc: { usage_count: 1 } },
      { new: true }
    );
  }

  /**
   * Find discounts by event ID
   * @param {String} eventId - Event ID
   * @returns {Array} Array of discount documents
   */
  async findByEventId(eventId) {
    return await Discount.find({ applicable_events: eventId });
  }

  /**
   * Find discount by code and event
   * @param {String} code - Discount code
   * @param {String} eventId - Event ID
   * @returns {Object|null} Discount document or null
   */
  async findByCodeAndEvent(code, eventId) {
    return await Discount.findOne({
      applicable_events: eventId,
      code: code.toUpperCase(),
      is_active: true,
    });
  }

  /**
   * Check if code exists (excluding specific ID)
   * @param {String} code - Discount code
   * @param {String} excludeId - ID to exclude from check
   * @returns {Boolean} True if code exists
   */
  async codeExists(code, excludeId = null) {
    const query = { code: code.toUpperCase() };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existingCode = await Discount.findOne(query);
    return !!existingCode;
  }

  /**
   * Apply discount (increment usage count)
   * @param {String} discountId - Discount ID
   * @returns {Object|null} Updated discount document
   */
  async applyDiscount(discountId) {
    return await Discount.findByIdAndUpdate(
      discountId,
      { $inc: { usage_count: 1 } },
      { new: true }
    );
  }
}

module.exports = new DiscountRepository();