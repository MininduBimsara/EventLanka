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
      valid_from: { $lte: now },
      valid_until: { $gte: now },
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
      valid_from: { $lte: now },
      valid_until: { $gte: now },
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
}

module.exports = new DiscountRepository();
