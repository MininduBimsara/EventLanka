const Payment = require("../../models/Payment");

/**
 * Payment Repository - Handles all database operations for Payment model
 */
class PaymentRepository {
  /**
   * Create a new payment
   * @param {Object} paymentData - Payment data
   * @returns {Object} Created payment document
   */
  async create(paymentData) {
    return await Payment.create(paymentData);
  }

  /**
   * Find payment by ID
   * @param {String} paymentId - Payment ID
   * @param {Object} populateOptions - Population options
   * @returns {Object|null} Payment document or null
   */
  async findById(paymentId, populateOptions = {}) {
    let query = Payment.findById(paymentId);

    if (populateOptions.event) {
      query = query.populate("event_id", populateOptions.event);
    }
    if (populateOptions.user) {
      query = query.populate("user_id", populateOptions.user);
    }

    return await query;
  }

  /**
   * Find payment by transaction ID
   * @param {String} transactionId - Transaction ID
   * @param {Object} populateOptions - Population options
   * @returns {Object|null} Payment document or null
   */
  async findByTransactionId(transactionId, populateOptions = {}) {
    let query = Payment.findOne({ transaction_id: transactionId });

    if (populateOptions.event) {
      query = query.populate("event_id", populateOptions.event);
    }
    if (populateOptions.user) {
      query = query.populate("user_id", populateOptions.user);
    }

    return await query;
  }

  /**
   * Find payment by PayPal order ID
   * @param {String} paypalOrderId - PayPal order ID
   * @param {Object} populateOptions - Population options
   * @returns {Object|null} Payment document or null
   */
  async findByPayPalOrderId(paypalOrderId, populateOptions = {}) {
    let query = Payment.findOne({
      "payment_details.paypal_order_id": paypalOrderId,
    });

    if (populateOptions.event) {
      query = query.populate("event_id", populateOptions.event);
    }
    if (populateOptions.user) {
      query = query.populate("user_id", populateOptions.user);
    }

    return await query;
  }

  /**
   * Find payments by user ID
   * @param {String} userId - User ID
   * @param {Object} options - Query options
   * @returns {Array} Array of payment documents
   */
  async findByUserId(userId, options = {}) {
    let query = Payment.find({ user_id: userId });

    if (options.populate) {
      if (options.populate.event) {
        query = query.populate("event_id", options.populate.event);
      }
      if (options.populate.user) {
        query = query.populate("user_id", options.populate.user);
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
   * Find payments by event ID
   * @param {String} eventId - Event ID
   * @param {Object} options - Query options
   * @returns {Array} Array of payment documents
   */
  async findByEventId(eventId, options = {}) {
    let query = Payment.find({ event_id: eventId });

    if (options.populate) {
      if (options.populate.user) {
        query = query.populate("user_id", options.populate.user);
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
   * Find all payments with optional filter
   * @param {Object} filter - MongoDB filter object
   * @param {Object} options - Query options
   * @returns {Array} Array of payment documents
   */
  async findAll(filter = {}, options = {}) {
    let query = Payment.find(filter);

    if (options.populate) {
      if (options.populate.event) {
        query = query.populate("event_id", options.populate.event);
      }
      if (options.populate.user) {
        query = query.populate("user_id", options.populate.user);
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
   * Find payments by status
   * @param {String} status - Payment status
   * @param {Object} options - Query options
   * @returns {Array} Array of payment documents
   */
  async findByStatus(status, options = {}) {
    return await this.findAll({ payment_status: status }, options);
  }

  /**
   * Find payments by payment method
   * @param {String} method - Payment method
   * @param {Object} options - Query options
   * @returns {Array} Array of payment documents
   */
  async findByPaymentMethod(method, options = {}) {
    return await this.findAll({ payment_method: method }, options);
  }

  /**
   * Find completed payments
   * @param {Object} options - Query options
   * @returns {Array} Array of completed payment documents
   */
  async findCompleted(options = {}) {
    return await this.findByStatus("completed", options);
  }

  /**
   * Find pending payments
   * @param {Object} options - Query options
   * @returns {Array} Array of pending payment documents
   */
  async findPending(options = {}) {
    return await this.findByStatus("pending", options);
  }

  /**
   * Find failed payments
   * @param {Object} options - Query options
   * @returns {Array} Array of failed payment documents
   */
  async findFailed(options = {}) {
    return await this.findByStatus("failed", options);
  }

  /**
   * Find payments by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} options - Query options
   * @returns {Array} Array of payment documents
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
   * Update payment by ID
   * @param {String} paymentId - Payment ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} Updated payment document
   */
  async updateById(paymentId, updateData) {
    return await Payment.findByIdAndUpdate(paymentId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Update payment status
   * @param {String} paymentId - Payment ID
   * @param {String} status - New status
   * @returns {Object|null} Updated payment document
   */
  async updateStatus(paymentId, status) {
    return await Payment.findByIdAndUpdate(
      paymentId,
      { payment_status: status },
      { new: true }
    );
  }

  /**
   * Delete payment by ID
   * @param {String} paymentId - Payment ID
   * @returns {Object|null} Deleted payment document
   */
  async deleteById(paymentId) {
    return await Payment.findByIdAndDelete(paymentId);
  }

  /**
   * Count payments with optional filter
   * @param {Object} filter - MongoDB filter object
   * @returns {Number} Count of documents
   */
  async count(filter = {}) {
    return await Payment.countDocuments(filter);
  }

  /**
   * Check if payment exists
   * @param {String} paymentId - Payment ID
   * @returns {Boolean} True if payment exists
   */
  async exists(paymentId) {
    const payment = await Payment.findById(paymentId).select("_id");
    return !!payment;
  }

  /**
   * Find user's most recent payment for an event
   * @param {String} userId - User ID
   * @param {String} eventId - Event ID
   * @param {String} status - Payment status (optional)
   * @returns {Object|null} Payment document or null
   */
  async findUserEventPayment(userId, eventId, status = null) {
    const filter = {
      user_id: userId,
      event_id: eventId,
    };

    if (status) {
      filter.payment_status = status;
    }

    return await Payment.findOne(filter)
      .populate("event_id", "title date location")
      .sort({ createdAt: -1 });
  }

  /**
   * Find payment by transaction ID pattern (regex search)
   * @param {String} transactionId - Transaction ID or pattern
   * @param {Object} populateOptions - Population options
   * @returns {Object|null} Payment document or null
   */
  async findByTransactionIdPattern(transactionId, populateOptions = {}) {
    let query = Payment.findOne({
      transaction_id: { $regex: transactionId, $options: "i" },
    });

    if (populateOptions.event) {
      query = query.populate("event_id", populateOptions.event);
    }
    if (populateOptions.user) {
      query = query.populate("user_id", populateOptions.user);
    }

    return await query;
  }

  /**
   * Get payment statistics
   * @param {Object} filter - Optional filter
   * @returns {Object} Payment statistics
   */
  async getStatistics(filter = {}) {
    const pipeline = [
      { $match: filter },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
          completedPayments: {
            $sum: { $cond: [{ $eq: ["$payment_status", "completed"] }, 1, 0] },
          },
          pendingPayments: {
            $sum: { $cond: [{ $eq: ["$payment_status", "pending"] }, 1, 0] },
          },
          failedPayments: {
            $sum: { $cond: [{ $eq: ["$payment_status", "failed"] }, 1, 0] },
          },
          paypalPayments: {
            $sum: { $cond: [{ $eq: ["$payment_method", "paypal"] }, 1, 0] },
          },
          averagePaymentAmount: { $avg: "$amount" },
        },
      },
    ];

    const result = await Payment.aggregate(pipeline);
    return (
      result[0] || {
        totalPayments: 0,
        totalRevenue: 0,
        completedPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
        paypalPayments: 0,
        averagePaymentAmount: 0,
      }
    );
  }

  /**
   * Get revenue by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {String} groupBy - Group by period ('day', 'week', 'month')
   * @returns {Array} Revenue data grouped by time period
   */
  async getRevenueByDateRange(startDate, endDate, groupBy = "day") {
    let groupFormat;
    switch (groupBy) {
      case "week":
        groupFormat = { $week: "$createdAt" };
        break;
      case "month":
        groupFormat = { $month: "$createdAt" };
        break;
      default:
        groupFormat = { $dayOfYear: "$createdAt" };
    }

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          payment_status: "completed",
        },
      },
      {
        $group: {
          _id: {
            period: groupFormat,
            year: { $year: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.period": 1 } },
    ];

    return await Payment.aggregate(pipeline);
  }
}

module.exports = new PaymentRepository();
