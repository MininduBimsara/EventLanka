const Ticket = require("../../models/Ticket");

/**
 * Ticket Repository - Handles all database operations for Ticket model
 */
class TicketRepository {
  /**
   * Create a new ticket
   * @param {Object} ticketData - Ticket data
   * @returns {Object} Created ticket document
   */
  async create(ticketData) {
    return await Ticket.create(ticketData);
  }

  /**
   * Create multiple tickets
   * @param {Array} ticketsData - Array of ticket data
   * @returns {Array} Array of created ticket documents
   */
  async createMany(ticketsData) {
    return await Ticket.insertMany(ticketsData);
  }

  /**
   * Find ticket by ID
   * @param {String} ticketId - Ticket ID
   * @param {Object} populateOptions - Population options
   * @returns {Object|null} Ticket document or null
   */
  async findById(ticketId, populateOptions = {}) {
    let query = Ticket.findById(ticketId);

    if (populateOptions.event) {
      query = query.populate("event_id");
    }
    if (populateOptions.user) {
      query = query.populate("user_id");
    }

    return await query;
  }

  /**
   * Find tickets by user ID
   * @param {String} userId - User ID
   * @param {Object} options - Query options
   * @returns {Array} Array of ticket documents
   */
  async findByUserId(userId, options = {}) {
    let query = Ticket.find({ user_id: userId });

    if (options.populate) {
      if (options.populate.event) {
        query = query.populate("event_id");
      }
    }

    if (options.sort) {
      query = query.sort(options.sort);
    }

    return await query;
  }

  /**
   * Find tickets by event ID
   * @param {String} eventId - Event ID
   * @param {Object} options - Query options
   * @returns {Array} Array of ticket documents
   */
  async findByEventId(eventId, options = {}) {
    let query = Ticket.find({ event_id: eventId });

    if (options.populate) {
      if (options.populate.user) {
        query = query.populate("user_id");
      }
    }

    if (options.sort) {
      query = query.sort(options.sort);
    }

    return await query;
  }

  /**
   * Find all tickets with optional filter
   * @param {Object} filter - MongoDB filter object
   * @param {Object} options - Query options
   * @returns {Array} Array of ticket documents
   */
  async findAll(filter = {}, options = {}) {
    let query = Ticket.find(filter);

    if (options.populate) {
      if (options.populate.event) {
        query = query.populate("event_id");
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
   * Update ticket by ID
   * @param {String} ticketId - Ticket ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} Updated ticket document
   */
  async updateById(ticketId, updateData) {
    return await Ticket.findByIdAndUpdate(ticketId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Update multiple tickets
   * @param {Object} filter - MongoDB filter object
   * @param {Object} updateData - Data to update
   * @returns {Object} Update result
   */
  async updateMany(filter, updateData) {
    return await Ticket.updateMany(filter, updateData);
  }

  /**
   * Delete ticket by ID
   * @param {String} ticketId - Ticket ID
   * @returns {Object|null} Deleted ticket document
   */
  async deleteById(ticketId) {
    return await Ticket.findByIdAndDelete(ticketId);
  }

  /**
   * Delete multiple tickets
   * @param {Object} filter - MongoDB filter object
   * @returns {Object} Delete result
   */
  async deleteMany(filter) {
    return await Ticket.deleteMany(filter);
  }

  /**
   * Find tickets by payment status
   * @param {String} paymentStatus - Payment status
   * @param {Object} options - Query options
   * @returns {Array} Array of ticket documents
   */
  async findByPaymentStatus(paymentStatus, options = {}) {
    return await this.findAll({ payment_status: paymentStatus }, options);
  }

  /**
   * Find tickets by ticket type
   * @param {String} ticketType - Ticket type
   * @param {Object} options - Query options
   * @returns {Array} Array of ticket documents
   */
  async findByTicketType(ticketType, options = {}) {
    return await this.findAll({ ticket_type: ticketType }, options);
  }

  /**
   * Find paid tickets
   * @param {Object} options - Query options
   * @returns {Array} Array of paid ticket documents
   */
  async findPaid(options = {}) {
    return await this.findByPaymentStatus("paid", options);
  }

  /**
   * Find pending tickets
   * @param {Object} options - Query options
   * @returns {Array} Array of pending ticket documents
   */
  async findPending(options = {}) {
    return await this.findByPaymentStatus("pending", options);
  }

  /**
   * Find refunded tickets
   * @param {Object} options - Query options
   * @returns {Array} Array of refunded ticket documents
   */
  async findRefunded(options = {}) {
    return await this.findByPaymentStatus("refunded", options);
  }

  /**
   * Count tickets with optional filter
   * @param {Object} filter - MongoDB filter object
   * @returns {Number} Count of documents
   */
  async count(filter = {}) {
    return await Ticket.countDocuments(filter);
  }

  /**
   * Count tickets by event ID
   * @param {String} eventId - Event ID
   * @returns {Number} Count of tickets for the event
   */
  async countByEventId(eventId) {
    return await this.count({ event_id: eventId });
  }

  /**
   * Count sold tickets by event ID
   * @param {String} eventId - Event ID
   * @returns {Number} Count of sold tickets for the event
   */
  async countSoldByEventId(eventId) {
    return await this.count({
      event_id: eventId,
      payment_status: { $in: ["paid", "completed"] },
    });
  }

  /**
   * Update payment status for multiple tickets
   * @param {Array} ticketIds - Array of ticket IDs
   * @param {String} paymentStatus - New payment status
   * @returns {Object} Update result
   */
  async updatePaymentStatusByIds(ticketIds, paymentStatus) {
    return await this.updateMany(
      { _id: { $in: ticketIds } },
      { payment_status: paymentStatus }
    );
  }

  /**
   * Find user's tickets for specific event
   * @param {String} userId - User ID
   * @param {String} eventId - Event ID
   * @param {Object} options - Query options
   * @returns {Array} Array of ticket documents
   */
  async findByUserAndEvent(userId, eventId, options = {}) {
    return await this.findAll(
      {
        user_id: userId,
        event_id: eventId,
      },
      options
    );
  }

  /**
   * Get ticket statistics for an event
   * @param {String} eventId - Event ID
   * @returns {Object} Ticket statistics
   */
  async getEventStatistics(eventId) {
    const pipeline = [
      { $match: { event_id: eventId } },
      {
        $group: {
          _id: null,
          totalTickets: { $sum: "$quantity" },
          soldTickets: {
            $sum: {
              $cond: [
                { $in: ["$payment_status", ["paid", "completed"]] },
                "$quantity",
                0,
              ],
            },
          },
          pendingTickets: {
            $sum: {
              $cond: [{ $eq: ["$payment_status", "pending"] }, "$quantity", 0],
            },
          },
          refundedTickets: {
            $sum: {
              $cond: [{ $eq: ["$payment_status", "refunded"] }, "$quantity", 0],
            },
          },
          uniqueUsers: { $addToSet: "$user_id" },
        },
      },
      {
        $project: {
          totalTickets: 1,
          soldTickets: 1,
          pendingTickets: 1,
          refundedTickets: 1,
          availableTickets: { $subtract: ["$totalTickets", "$soldTickets"] },
          uniqueUsers: { $size: "$uniqueUsers" },
        },
      },
    ];

    const result = await Ticket.aggregate(pipeline);
    return (
      result[0] || {
        totalTickets: 0,
        soldTickets: 0,
        pendingTickets: 0,
        refundedTickets: 0,
        availableTickets: 0,
        uniqueUsers: 0,
      }
    );
  }

  /**
   * Check if ticket exists
   * @param {String} ticketId - Ticket ID
   * @returns {Boolean} True if ticket exists
   */
  async exists(ticketId) {
    const ticket = await Ticket.findById(ticketId).select("_id");
    return !!ticket;
  }

  /**
   * Find ticket with populated data
   * @param {String} ticketId - Ticket ID
   * @param {String} userFields - User fields to populate
   * @param {String} eventFields - Event fields to populate
   * @returns {Object|null} Ticket document or null
   */
  async findByIdWithPopulation(ticketId, userFields = "", eventFields = "") {
    let query = Ticket.findById(ticketId);

    if (userFields) {
      query = query.populate("user_id", userFields);
    }
    if (eventFields) {
      query = query.populate("event_id", eventFields);
    }

    return await query;
  }

  /**
   * Update QR code for ticket
   * @param {String} ticketId - Ticket ID
   * @param {String} qrCode - QR code data
   * @returns {Object|null} Updated ticket document
   */
  async updateQRCode(ticketId, qrCode) {
    return await Ticket.findByIdAndUpdate(
      ticketId,
      { qr_code: qrCode },
      { new: true }
    );
  }

  /**
   * Find tickets by event with population
   * @param {String} eventId - Event ID
   * @param {String} userFields - User fields to populate
   * @param {String} selectFields - Fields to select
   * @returns {Array} Array of ticket documents
   */
  async findByEventWithPopulation(eventId, userFields = "", selectFields = "") {
    let query = Ticket.find({ event_id: eventId });

    if (userFields) {
      query = query.populate("user_id", userFields);
    }
    if (selectFields) {
      query = query.select(selectFields);
    }

    return await query;
  }

  /**
   * Find full ticket details by event ID
   * @param {String} eventId - Event ID
   * @returns {Array} Array of full ticket documents
   */
  async findFullDetailsByEventId(eventId) {
    return await Ticket.find({ event_id: eventId })
      .populate("user_id", "username email")
      .select("user_id ticket_type quantity attendance_status check_in_time");
  }

  /**
   * Update attendance status
   * @param {String} ticketId - Ticket ID
   * @param {String} status - Attendance status
   * @param {Date} checkInTime - Check-in time (optional)
   * @returns {Object|null} Updated ticket document
   */
  async updateAttendanceStatus(ticketId, status, checkInTime = null) {
    const updateData = { attendance_status: status };
    if (checkInTime) {
      updateData.check_in_time = checkInTime;
    }

    return await Ticket.findByIdAndUpdate(ticketId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Find paid tickets by user and event
   * @param {String} userId - User ID
   * @param {String} eventId - Event ID
   * @returns {Array} Array of paid ticket documents
   */
  async findPaidByUserAndEvent(userId, eventId) {
    return await Ticket.find({
      user_id: userId,
      event_id: eventId,
      payment_status: "paid",
    });
  }

  /**
   * Find tickets with event details (including pricing)
   * @param {Object} filter - MongoDB filter object
   * @param {Object} options - Query options
   * @returns {Array} Array of ticket documents with event data
   */
  async findWithEventDetails(filter = {}, options = {}) {
    let query = Ticket.find(filter).populate({
      path: "event_id",
      select: "title date location ticket_types category",
    });

    if (options.populate && options.populate.user) {
      query = query.populate(
        "user_id",
        options.populate.userFields || "username email"
      );
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
   * Calculate ticket price from event data
   * @param {String} eventId - Event ID
   * @param {String} ticketType - Ticket type
   * @param {Number} quantity - Quantity
   * @returns {Promise<Number>} Total price
   */
  async calculateTicketPrice(eventId, ticketType, quantity) {
    const Event = require("../../models/Event");
    const event = await Event.findById(eventId).select("ticket_types");

    if (!event) {
      throw new Error("Event not found");
    }

    const ticketTypeData = event.ticket_types.find(
      (t) => t.type === ticketType
    );
    if (!ticketTypeData) {
      throw new Error("Ticket type not found");
    }

    return ticketTypeData.price * quantity;
  }

  /**
   * Find tickets with calculated total values
   * @param {Object} filter - MongoDB filter object
   * @param {Object} options - Query options
   * @returns {Array} Array of tickets with calculated prices
   */
  async findWithCalculatedPrices(filter = {}, options = {}) {
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "events",
          localField: "event_id",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $addFields: {
          calculatedPrice: {
            $multiply: [
              "$quantity",
              {
                $arrayElemAt: [
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: "$event.ticket_types",
                          cond: { $eq: ["$$this.type", "$ticket_type"] },
                        },
                      },
                      as: "ticketType",
                      in: "$$ticketType.price",
                    },
                  },
                  0,
                ],
              },
            ],
          },
        },
      },
    ];

    if (options.sort) {
      pipeline.push({ $sort: options.sort });
    }
    if (options.limit) {
      pipeline.push({ $limit: options.limit });
    }
    if (options.skip) {
      pipeline.push({ $skip: options.skip });
    }

    return await Ticket.aggregate(pipeline);
  }

  /**
   * Get tickets with event pricing information
   * @param {String} userId - User ID
   * @param {Object} options - Query options
   * @returns {Array} Array of tickets with pricing
   */
  async findUserTicketsWithPricing(userId, options = {}) {
    return await this.findWithEventDetails(
      { user_id: userId },
      {
        ...options,
        populate: { user: true, userFields: "username email" },
      }
    );
  }

  /**
   * Find tickets by payment status with event details
   * @param {String} paymentStatus - Payment status
   * @param {Object} options - Query options
   * @returns {Array} Array of tickets with event details
   */
  async findByPaymentStatusWithDetails(paymentStatus, options = {}) {
    return await this.findWithEventDetails(
      { payment_status: paymentStatus },
      options
    );
  }

  /**
   * Update ticket with calculated price
   * @param {String} ticketId - Ticket ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} Updated ticket document
   */
  async updateWithPriceCalculation(ticketId, updateData) {
    const ticket = await this.findById(ticketId);
    if (!ticket) return null;

    // If quantity or ticket_type is being updated, recalculate price
    // if (updateData.quantity || updateData.ticket_type) {
    //   const quantity = updateData.quantity || ticket.quantity;
    //   const ticketType = updateData.ticket_type || ticket.ticket_type;

    //   try {
    //     const calculatedPrice = await this.calculateTicketPrice(
    //       ticket.event_id,
    //       ticketType,
    //       quantity
    //     );
    //     updateData.calculatedPrice = calculatedPrice;
    //   } catch (error) {
    //     console.warn("Could not calculate price:", error.message);
    //   }
    // }

    return await this.updateById(ticketId, updateData);
  }
}

module.exports = new TicketRepository();
