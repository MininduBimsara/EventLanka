const Order = require("../../models/Order");

/**
 * Order Repository - Handles all database operations for Order model
 */
class OrderRepository {
  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @returns {Object} Created order document
   */
  async create(orderData) {
    return await Order.create(orderData);
  }

  /**
   * Find order by ID
   * @param {String} orderId - Order ID
   * @param {Object} populateOptions - Population options
   * @returns {Object|null} Order document or null
   */
  async findById(orderId, populateOptions = {}) {
    let query = Order.findById(orderId);

    if (populateOptions.tickets) {
      query = query.populate({
        path: "tickets",
        populate: {
          path: "event_id",
          model: "Event",
        },
      });
    }

    if (populateOptions.discount) {
      query = query.populate("discount_id");
    }

    if (populateOptions.user) {
      query = query.populate("user_id");
    }

    return await query;
  }

  /**
   * Find orders by user ID
   * @param {String} userId - User ID
   * @param {Object} populateOptions - Population options
   * @returns {Array} Array of order documents
   */
  async findByUserId(userId, populateOptions = {}) {
    let query = Order.find({ user_id: userId });

    if (populateOptions.tickets) {
      query = query.populate({
        path: "tickets",
        populate: {
          path: "event_id",
          model: "Event",
        },
      });
    }

    if (populateOptions.discount) {
      query = query.populate("discount_id");
    }

    return await query;
  }

  /**
   * Find all orders with optional filter
   * @param {Object} filter - MongoDB filter object
   * @param {Object} options - Query options
   * @returns {Array} Array of order documents
   */
  async findAll(filter = {}, options = {}) {
    let query = Order.find(filter);

    if (options.populate) {
      if (options.populate.tickets) {
        query = query.populate({
          path: "tickets",
          populate: {
            path: "event_id",
            model: "Event",
          },
        });
      }
      if (options.populate.discount) {
        query = query.populate("discount_id");
      }
      if (options.populate.user) {
        query = query.populate("user_id");
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
   * Update order by ID
   * @param {String} orderId - Order ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} Updated order document
   */
  async updateById(orderId, updateData) {
    return await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete order by ID
   * @param {String} orderId - Order ID
   * @returns {Object|null} Deleted order document
   */
  async deleteById(orderId) {
    return await Order.findByIdAndDelete(orderId);
  }

  /**
   * Find orders by status
   * @param {String} status - Order status
   * @param {Object} options - Query options
   * @returns {Array} Array of order documents
   */
  async findByStatus(status, options = {}) {
    return await this.findAll({ status }, options);
  }

  /**
   * Find orders by payment status
   * @param {String} paymentStatus - Payment status
   * @param {Object} options - Query options
   * @returns {Array} Array of order documents
   */
  async findByPaymentStatus(paymentStatus, options = {}) {
    return await this.findAll({ payment_status: paymentStatus }, options);
  }

  /**
   * Find pending orders
   * @param {Object} options - Query options
   * @returns {Array} Array of pending order documents
   */
  async findPending(options = {}) {
    return await this.findByStatus("pending", options);
  }

  /**
   * Find completed orders
   * @param {Object} options - Query options
   * @returns {Array} Array of completed order documents
   */
  async findCompleted(options = {}) {
    return await this.findByStatus("completed", options);
  }

  /**
   * Find cancelled orders
   * @param {Object} options - Query options
   * @returns {Array} Array of cancelled order documents
   */
  async findCancelled(options = {}) {
    return await this.findByStatus("cancelled", options);
  }

  /**
   * Find paid orders
   * @param {Object} options - Query options
   * @returns {Array} Array of paid order documents
   */
  async findPaid(options = {}) {
    return await this.findByPaymentStatus("paid", options);
  }

  /**
   * Find orders by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} options - Query options
   * @returns {Array} Array of order documents
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
   * Count orders with optional filter
   * @param {Object} filter - MongoDB filter object
   * @returns {Number} Count of documents
   */
  async count(filter = {}) {
    return await Order.countDocuments(filter);
  }

  /**
   * Check if order exists
   * @param {String} orderId - Order ID
   * @returns {Boolean} True if order exists
   */
  async exists(orderId) {
    const order = await Order.findById(orderId).select("_id");
    return !!order;
  }

  /**
   * Find user's orders for specific event
   * @param {String} userId - User ID
   * @param {String} eventId - Event ID
   * @param {Object} options - Query options
   * @returns {Array} Array of order documents
   */
  async findByUserAndEvent(userId, eventId, options = {}) {
    const filter = { user_id: userId };

    // We need to populate tickets to filter by event
    const orders = await this.findByUserId(userId, { tickets: true });

    // Filter orders that have tickets for the specific event
    return orders.filter((order) =>
      order.tickets.some((ticket) => ticket.event_id._id.toString() === eventId)
    );
  }

  /**
   * Update payment status
   * @param {String} orderId - Order ID
   * @param {String} paymentStatus - New payment status
   * @returns {Object|null} Updated order document
   */
  async updatePaymentStatus(orderId, paymentStatus) {
    return await Order.findByIdAndUpdate(
      orderId,
      { payment_status: paymentStatus },
      { new: true }
    );
  }

  /**
   * Update order status
   * @param {String} orderId - Order ID
   * @param {String} status - New status
   * @returns {Object|null} Updated order document
   */
  async updateStatus(orderId, status) {
    return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  }

  /**
   * Get order statistics
   * @param {Object} filter - Optional filter
   * @returns {Object} Order statistics
   */
  async getStatistics(filter = {}) {
    const pipeline = [
      { $match: filter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$total_amount" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
          paidOrders: {
            $sum: { $cond: [{ $eq: ["$payment_status", "paid"] }, 1, 0] },
          },
          averageOrderValue: { $avg: "$total_amount" },
        },
      },
    ];

    const result = await Order.aggregate(pipeline);
    return (
      result[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        paidOrders: 0,
        averageOrderValue: 0,
      }
    );
  }

  /**
   * Find order by ID with populated tickets and event details
   * @param {String} orderId - Order ID
   * @returns {Object|null} Order document with populated tickets
   */
  async findByIdWithPopulatedTickets(orderId) {
    return await Order.findById(orderId).populate({
      path: "tickets",
      populate: {
        path: "event_id",
        model: "Event",
      },
    });
  }

  /**
   * Update order payment details
   * @param {String} orderId - Order ID
   * @param {Object} paymentData - Payment data to update
   * @returns {Object|null} Updated order document
   */
  async updatePaymentDetails(orderId, paymentData) {
    return await Order.findByIdAndUpdate(
      orderId,
      {
        payment_status: paymentData.payment_status,
        status: paymentData.status,
        payment_method: paymentData.paymentMethod,
        payment_details: paymentData.payment_details,
      },
      { new: true }
    );
  }
}

module.exports = new OrderRepository();
