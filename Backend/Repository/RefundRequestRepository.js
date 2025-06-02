const RefundRequest = require("../../models/RefundRequest");

/**
 * RefundRequest Repository - Handles all database operations for RefundRequest model
 */
class RefundRequestRepository {
  /**
   * Create a new refund request
   * @param {Object} refundData - Refund request data
   * @returns {Object} Created refund request document
   */
  async create(refundData) {
    const refundRequest = new RefundRequest(refundData);
    return await refundRequest.save();
  }

  /**
   * Find refund request by ID
   * @param {String} refundId - Refund request ID
   * @param {Object} populateOptions - Population options
   * @returns {Object|null} Refund request document or null
   */
  async findById(refundId, populateOptions = {}) {
    let query = RefundRequest.findById(refundId);

    if (populateOptions.user) {
      query = query.populate("user_id", populateOptions.user);
    }
    if (populateOptions.event) {
      query = query.populate("event_id", populateOptions.event);
    }
    if (populateOptions.ticket) {
      query = query.populate("ticket_id", populateOptions.ticket);
    }

    return await query;
  }

  /**
   * Find all refund requests with optional filter
   * @param {Object} filter - MongoDB filter object
   * @param {Object} options - Query options
   * @returns {Array} Array of refund request documents
   */
  async findAll(filter = {}, options = {}) {
    let query = RefundRequest.find(filter);

    if (options.populate) {
      if (options.populate.user) {
        query = query.populate("user_id", options.populate.user);
      }
      if (options.populate.event) {
        query = query.populate("event_id", options.populate.event);
      }
      if (options.populate.ticket) {
        query = query.populate("ticket_id", options.populate.ticket);
      }
    }

    if (options.sort) {
      query = query.sort(options.sort);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.skip) {
      query = query.skip(options.skip);
    }

    return await query;
  }

  /**
   * Find refund requests by user ID
   * @param {String} userId - User ID
   * @param {Object} options - Query options
   * @returns {Array} Array of refund request documents
   */
  async findByUserId(userId, options = {}) {
    return await this.findAll({ user_id: userId }, options);
  }

  /**
   * Find refund requests by event ID
   * @param {String} eventId - Event ID
   * @param {Object} options - Query options
   * @returns {Array} Array of refund request documents
   */
  async findByEventId(eventId, options = {}) {
    return await this.findAll({ event_id: eventId }, options);
  }

  /**
   * Find refund requests by status
   * @param {String} status - Refund request status
   * @param {Object} options - Query options
   * @returns {Array} Array of refund request documents
   */
  async findByStatus(status, options = {}) {
    return await this.findAll({ status }, options);
  }

  /**
   * Find pending refund requests
   * @param {Object} options - Query options
   * @returns {Array} Array of pending refund request documents
   */
  async findPending(options = {}) {
    return await this.findByStatus("pending", options);
  }

  /**
   * Find approved refund requests
   * @param {Object} options - Query options
   * @returns {Array} Array of approved refund request documents
   */
  async findApproved(options = {}) {
    return await this.findByStatus("approved", options);
  }

  /**
   * Find rejected refund requests
   * @param {Object} options - Query options
   * @returns {Array} Array of rejected refund request documents
   */
  async findRejected(options = {}) {
    return await this.findByStatus("rejected", options);
  }

  /**
   * Update refund request by ID
   * @param {String} refundId - Refund request ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} Updated refund request document
   */
  async updateById(refundId, updateData) {
    return await RefundRequest.findByIdAndUpdate(refundId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Update refund request status
   * @param {String} refundId - Refund request ID
   * @param {String} status - New status
   * @param {String} note - Optional note
   * @returns {Object|null} Updated refund request document
   */
  async updateStatus(refundId, status, note = null) {
    const updateData = { status };
    if (note) {
      updateData.note = note;
    }
    return await this.updateById(refundId, updateData);
  }

  /**
   * Delete refund request by ID
   * @param {String} refundId - Refund request ID
   * @returns {Object|null} Deleted refund request document
   */
  async deleteById(refundId) {
    return await RefundRequest.findByIdAndDelete(refundId);
  }

  /**
   * Count refund requests with optional filter
   * @param {Object} filter - MongoDB filter object
   * @returns {Number} Count of documents
   */
  async count(filter = {}) {
    return await RefundRequest.countDocuments(filter);
  }

  /**
   * Check if refund request exists
   * @param {String} refundId - Refund request ID
   * @returns {Boolean} True if refund request exists
   */
  async exists(refundId) {
    const refundRequest = await RefundRequest.findById(refundId).select("_id");
    return !!refundRequest;
  }

  /**
   * Find refund requests by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} options - Query options
   * @returns {Array} Array of refund request documents
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

  /**
   * Get refund request statistics
   * @param {Object} filter - Optional filter
   * @returns {Object} Refund request statistics
   */
  async getStatistics(filter = {}) {
    const pipeline = [
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          pendingRequests: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          approvedRequests: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          rejectedRequests: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
          averageRefundAmount: { $avg: "$amount" },
        },
      },
    ];

    const result = await RefundRequest.aggregate(pipeline);
    return (
      result[0] || {
        totalRequests: 0,
        totalAmount: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        rejectedRequests: 0,
        averageRefundAmount: 0,
      }
    );
  }
}

module.exports = new RefundRequestRepository();
