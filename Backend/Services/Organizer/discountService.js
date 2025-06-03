const EventRepository = require("../../Repository/EventRepository");
const DiscountRepository = require("../../Repository/DiscountRepository");
const mongoose = require("mongoose");

class DiscountService {
  /**
   * Validate user authorization for events
   * @param {Array} eventIds - Array of event IDs
   * @param {string} userId - The requesting user ID
   * @param {string} userRole - The requesting user role
   * @returns {Array} - Array of event objects
   */
  async validateEventAuthorization(eventIds, userId, userRole) {
    const events = await EventRepository.findByIds(eventIds);

    if (!events || events.length === 0) {
      throw new Error("One or more events not found");
    }

    const unauthorizedEvent = events.find(
      (event) =>
        event.organizer_id.toString() !== userId && userRole !== "admin"
    );

    if (unauthorizedEvent) {
      throw new Error(
        "Unauthorized to manage discount codes for one or more events"
      );
    }

    return events;
  }

  /**
   * Check if discount code already exists
   * @param {string} code - The discount code
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {boolean} - Whether code exists
   */
  async isCodeExists(code, excludeId = null) {
    return await DiscountRepository.codeExists(code, excludeId);
  }

  /**
   * Create a new discount code
   * @param {Object} discountData - The discount data
   * @param {string} userId - The creating user ID
   * @param {string} userRole - The creating user role
   * @returns {Object} - Created discount
   */
  async createDiscount(discountData, userId, userRole) {
    const {
      applicable_events,
      code,
      description,
      discount_type,
      discount_value,
      usage_limit,
      start_date,
      end_date,
      minimum_purchase_amount,
    } = discountData;

    // Validate events and authorization
    await this.validateEventAuthorization(applicable_events, userId, userRole);

    // Check if code already exists
    if (await this.isCodeExists(code)) {
      throw new Error("Discount code already exists");
    }

    // Validate discount data
    this.validateDiscountData(discountData);

    const discount = await DiscountRepository.create({
      applicable_events,
      code: code.toUpperCase(),
      description: description || "",
      discount_type,
      discount_value,
      usage_limit: usage_limit || null,
      usage_count: 0,
      start_date: start_date || Date.now(),
      end_date,
      minimum_purchase_amount: minimum_purchase_amount || 0,
      is_active: true,
      created_by: userId,
    });

    return discount;
  }

  /**
   * Validate discount data
   * @param {Object} discountData - The discount data to validate
   */
  validateDiscountData(discountData) {
    const { discount_type, discount_value, start_date, end_date } =
      discountData;

    // Validate discount type and value
    if (!["percentage", "fixed"].includes(discount_type)) {
      throw new Error("Invalid discount type. Must be 'percentage' or 'fixed'");
    }

    if (discount_value <= 0) {
      throw new Error("Discount value must be greater than 0");
    }

    if (discount_type === "percentage" && discount_value > 100) {
      throw new Error("Percentage discount cannot exceed 100%");
    }

    // Validate dates
    if (start_date && end_date && new Date(start_date) >= new Date(end_date)) {
      throw new Error("Start date must be before end date");
    }
  }

  /**
   * Get discount codes for a specific event
   * @param {string} eventId - The event ID
   * @param {string} userId - The requesting user ID
   * @param {string} userRole - The requesting user role
   * @returns {Array} - Array of discount codes
   */
  async getDiscountsByEvent(eventId, userId, userRole) {
    // Validate eventId
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      throw new Error("Invalid event ID");
    }

    // Validate authorization
    await this.validateEventAuthorization([eventId], userId, userRole);

    const discounts = await DiscountRepository.findByEventId(eventId);
    return discounts;
  }

  /**
   * Update a discount code
   * @param {string} discountId - The discount ID
   * @param {Object} updates - The updates to apply
   * @param {string} userId - The requesting user ID
   * @param {string} userRole - The requesting user role
   * @returns {Object} - Updated discount
   */
  async updateDiscount(discountId, updates, userId, userRole) {
    const discount = await DiscountRepository.findById(discountId);
    if (!discount) {
      throw new Error("Discount code not found");
    }

    // Validate authorization
    await this.validateEventAuthorization(
      discount.applicable_events,
      userId,
      userRole
    );

    // Validate updates
    if (updates.discount_type || updates.discount_value) {
      this.validateDiscountData({ ...discount.toObject(), ...updates });
    }

    // Don't allow changing sensitive fields
    delete updates.code;
    delete updates.created_by;
    delete updates.usage_count;

    const updatedDiscount = await DiscountRepository.updateById(
      discountId,
      updates
    );

    return updatedDiscount;
  }

  /**
   * Delete a discount code
   * @param {string} discountId - The discount ID
   * @param {string} userId - The requesting user ID
   * @param {string} userRole - The requesting user role
   * @returns {boolean} - Success status
   */
  async deleteDiscount(discountId, userId, userRole) {
    const discount = await DiscountRepository.findById(discountId);
    if (!discount) {
      throw new Error("Discount code not found");
    }

    // Validate authorization
    await this.validateEventAuthorization(
      discount.applicable_events,
      userId,
      userRole
    );

    await DiscountRepository.deleteById(discountId);
    return true;
  }

  /**
   * Validate discount code for specific event and ticket details
   * @param {string} eventId - The event ID
   * @param {string} code - The discount code
   * @param {number} ticketCount - Number of tickets
   * @param {string} ticketType - Type of ticket
   * @returns {Object} - Validation result with discount details
   */
  async validateDiscountForEvent(eventId, code, ticketCount, ticketType) {
    const event = await EventRepository.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    const discount = await DiscountRepository.findByCodeAndEvent(code, eventId);


    if (!discount) {
      throw new Error("Invalid discount code");
    }

    // Check expiration
    if (discount.end_date && new Date() > new Date(discount.end_date)) {
      throw new Error("Discount code has expired");
    }

    // Check usage limit
    if (discount.usage_limit && discount.usage_count >= discount.usage_limit) {
      throw new Error("Discount code has reached maximum uses");
    }

    // Check minimum purchase requirement
    if (ticketCount < discount.minimum_purchase_amount) {
      throw new Error(
        `Minimum ${discount.minimum_purchase_amount} tickets required for this discount code`
      );
    }

    // Find ticket type details
    const ticketTypeDetails = event.ticket_types.find(
      (t) => t.type === ticketType
    );
    if (!ticketTypeDetails) {
      throw new Error("Invalid ticket type");
    }

    const discountAmount = this.calculateDiscountAmount(
      discount,
      ticketTypeDetails.price,
      ticketCount
    );

    return {
      valid: true,
      discountAmount,
      discountType: discount.discount_type,
      discountValue: discount.discount_value,
      discountId: discount._id,
    };
  }

  /**
   * Validate discount code for general use (updated version)
   * @param {string} code - The discount code
   * @param {number} subtotal - The subtotal amount
   * @returns {Object} - Validation result with discount details
   */
  async validateDiscountCode(code, subtotal) {
    const discount = await DiscountRepository.findByCode(code.toUpperCase());


    if (!discount) {
      throw new Error("Invalid discount code");
    }

    // Check expiration
    const now = new Date();
    if (discount.end_date && now > new Date(discount.end_date)) {
      throw new Error("Discount code has expired");
    }

    // Check usage limit
    if (discount.usage_limit && discount.usage_count >= discount.usage_limit) {
      throw new Error("Discount code has reached maximum uses");
    }

    // Check minimum purchase requirement
    if (subtotal < discount.minimum_purchase_amount) {
      throw new Error(
        `Minimum purchase amount of $${discount.minimum_purchase_amount} required for this discount`
      );
    }

    const discountAmount = this.calculateDiscountAmount(discount, subtotal, 1);

    return {
      valid: true,
      discountAmount,
      discountId: discount._id,
      discountType: discount.discount_type,
      discountValue: discount.discount_value,
    };
  }

  /**
   * Calculate discount amount based on type
   * @param {Object} discount - The discount object
   * @param {number} price - The base price or subtotal
   * @param {number} quantity - The quantity (for per-ticket discounts)
   * @returns {number} - Calculated discount amount
   */
  calculateDiscountAmount(discount, price, quantity = 1) {
    let discountAmount = 0;

    if (discount.discount_type === "percentage") {
      discountAmount = (price * discount.discount_value) / 100;
    } else {
      // Fixed amount discount
      discountAmount = discount.discount_value;
    }

    // For per-ticket discounts, multiply by quantity
    if (quantity > 1) {
      discountAmount *= quantity;
    }

    // Ensure discount doesn't exceed the total price
    return Math.min(discountAmount, price * quantity);
  }

  /**
   * Apply discount code (increment usage count)
   * @param {string} discountId - The discount ID
   * @returns {Object} - Updated discount
   */
  async applyDiscountCode(discountId) {
    const discount = await DiscountRepository.applyDiscount(discountId);


    if (!discount) {
      throw new Error("Discount not found");
    }

    return discount;
  }

  /**
   * Get discount usage statistics
   * @param {string} discountId - The discount ID
   * @param {string} userId - The requesting user ID
   * @param {string} userRole - The requesting user role
   * @returns {Object} - Usage statistics
   */
  async getDiscountStats(discountId, userId, userRole) {
    const discount = await DiscountRepository.findById(discountId);
    if (!discount) {
      throw new Error("Discount code not found");
    }

    // Validate authorization
    await this.validateEventAuthorization(
      discount.applicable_events,
      userId,
      userRole
    );

    const usagePercentage = discount.usage_limit
      ? (discount.usage_count / discount.usage_limit) * 100
      : null;

    const isExpired = discount.end_date
      ? new Date() > new Date(discount.end_date)
      : false;
    const isMaxedOut = discount.usage_limit
      ? discount.usage_count >= discount.usage_limit
      : false;

    return {
      usage_count: discount.usage_count,
      usage_limit: discount.usage_limit,
      usage_percentage: usagePercentage,
      is_expired: isExpired,
      is_maxed_out: isMaxedOut,
      is_active: discount.is_active && !isExpired && !isMaxedOut,
    };
  }
}

module.exports = new DiscountService();
