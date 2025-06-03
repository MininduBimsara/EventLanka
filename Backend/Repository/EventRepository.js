const Event = require("../../models/Event");

/**
 * Event Repository - Handles all database operations for Event model
 */
class EventRepository {
  /**
   * Create a new event
   * @param {Object} eventData - Event data
   * @returns {Object} Created event document
   */
  async create(eventData) {
    const event = new Event(eventData);
    return await event.save();
  }

  /**
   * Find event by ID
   * @param {String} eventId - Event ID
   * @returns {Object|null} Event document or null
   */
  async findById(eventId) {
    return await Event.findById(eventId);
  }

  /**
   * Find all events with optional filter
   * @param {Object} filter - MongoDB filter object
   * @param {Object} options - Query options
   * @returns {Array} Array of event documents
   */
  async findAll(filter = {}, options = {}) {
    let query = Event.find(filter);

    if (options.populate) {
      query = query.populate(options.populate);
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
    if (options.lean) {
      query = query.lean();
    }

    return await query;
  }

  /**
   * Find events by organizer ID
   * @param {String} organizerId - Organizer ID
   * @returns {Array} Array of event documents
   */
  async findByOrganizerId(organizerId) {
    return await Event.find({ organizer_id: organizerId });
  }

  /**
   * Find events by status
   * @param {String} status - Event status
   * @returns {Array} Array of event documents
   */
  async findByStatus(status) {
    return await Event.find({ event_status: status });
  }

  /**
   * Find approved events (public events)
   * @param {Object} options - Query options
   * @returns {Array} Array of approved event documents
   */
  async findApproved(options = {}) {
    return await this.findByStatus("approved", options);
  }

  /**
   * Find pending events
   * @param {Object} options - Query options
   * @returns {Array} Array of pending event documents
   */
  async findPending(options = {}) {
    return await this.findByStatus("pending", options);
  }

  /**
   * Update event by ID
   * @param {String} eventId - Event ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} Updated event document
   */
  async updateById(eventId, updateData) {
    return await Event.findByIdAndUpdate(eventId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete event by ID
   * @param {String} eventId - Event ID
   * @returns {Object|null} Deleted event document
   */
  async deleteById(eventId) {
    return await Event.findByIdAndDelete(eventId);
  }

  /**
   * Update event status
   * @param {String} eventId - Event ID
   * @param {String} status - New status
   * @returns {Object|null} Updated event document
   */
  async updateStatus(eventId, status) {
    return await Event.findByIdAndUpdate(
      eventId,
      { event_status: status },
      { new: true }
    );
  }

  /**
   * Find events by category
   * @param {String} category - Event category
   * @param {Object} options - Query options
   * @returns {Array} Array of event documents
   */
  async findByCategory(category, options = {}) {
    return await this.findAll({ category }, options);
  }

  /**
   * Find events by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} options - Query options
   * @returns {Array} Array of event documents
   */
  async findByDateRange(startDate, endDate, options = {}) {
    const filter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    return await this.findAll(filter, options);
  }

  /**
   * Find upcoming events
   * @param {Object} options - Query options
   * @returns {Array} Array of upcoming event documents
   */
  async findUpcoming(options = {}) {
    const now = new Date();
    const filter = {
      date: { $gte: now },
      event_status: "approved",
    };
    return await this.findAll(filter, { ...options, sort: { date: 1 } });
  }

  /**
   * Count events with optional filter
   * @param {Object} filter - MongoDB filter object
   * @returns {Number} Count of documents
   */
  async count(filter = {}) {
    return await Event.countDocuments(filter);
  }

  /**
   * Check if event exists
   * @param {String} eventId - Event ID
   * @returns {Boolean} True if event exists
   */
  async exists(eventId) {
    const event = await Event.findById(eventId).select("_id");
    return !!event;
  }

  /**
   * Find events with search query
   * @param {String} searchQuery - Search query
   * @param {Object} options - Query options
   * @returns {Array} Array of event documents
   */
  async search(searchQuery, options = {}) {
    const filter = {
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } },
      ],
    };
    return await this.findAll(filter, options);
  }

  /**
   * Find events by multiple IDs
   * @param {Array} eventIds - Array of event IDs
   * @returns {Array} Array of event documents
   */
  async findByIds(eventIds) {
    return await Event.find({ _id: { $in: eventIds } });
  }

  /**
   * Find event with specific population
   * @param {String} eventId - Event ID
   * @param {String} populateFields - Fields to populate
   * @returns {Object|null} Event document or null
   */
  async findByIdWithPopulation(eventId, populateFields = "") {
    let query = Event.findById(eventId);

    if (populateFields) {
      query = query.populate(populateFields);
    }

    return await query;
  }

  /**
   * Update ticket type availability
   * @param {String} eventId - Event ID
   * @param {String} ticketType - Ticket type
   * @param {Number} quantity - Quantity to decrease
   * @returns {Object|null} Updated event document
   */
  async updateTicketTypeAvailability(eventId, ticketType, quantity) {
    return await Event.findOneAndUpdate(
      {
        _id: eventId,
        "ticket_types.type": ticketType,
      },
      {
        $inc: { "ticket_types.$.availability": -quantity },
      },
      { new: true }
    );
  }
}

module.exports = new EventRepository();
