const TicketRepository = require("../../Repository/TicketRepository");
const EventRepository = require("../../Repository/EventRepository");
const UserRepository = require("../../Repository/UserRepository");

/**
 * Get sales data for a specific event
 * @param {string} eventId - Event ID
 * @param {string} userId - User ID (for authorization)
 * @param {string} userRole - User role (for authorization)
 * @returns {Object} Sales data for the event
 */
async function getSalesByEvent(eventId, userId, userRole) {
  // Check if user is authorized (event organizer or admin)
  const event = await EventRepository.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  if (event.organizer_id.toString() !== userId && userRole !== "admin") {
    throw new Error("Unauthorized to view sales data");
  }

  // Get all paid tickets for the event
  const tickets = await TicketRepository.findAll({
    event_id: eventId,
    payment_status: "paid", // Only count paid tickets
  });

  // Calculate total sales
  const totalSales = tickets.reduce((sum, ticket) => sum + ticket.price, 0);

  // Calculate sales by ticket type
  const salesByTicketType = calculateSalesByTicketType(tickets);

  return {
    eventId,
    totalSales,
    ticketsSold: tickets.reduce((sum, ticket) => sum + ticket.quantity, 0),
    salesByTicketType,
  };
}

/**
 * Get sales data within a time frame
 * @param {string} startDate - Start date (optional)
 * @param {string} endDate - End date (optional)
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @returns {Object} Sales data for the period
 */
async function getSalesByPeriod(startDate, endDate, userId, userRole) {
  // Check if user is authorized (must be an organizer or admin)
  if (userRole !== "organizer" && userRole !== "admin") {
    throw new Error("Unauthorized to view sales data");
  }

  // Build query for date range
  const query = {
    payment_status: "paid",
    createdAt: {},
  };

  if (startDate) {
    query.createdAt.$gte = new Date(startDate);
  }

  if (endDate) {
    query.createdAt.$lte = new Date(endDate);
  }

  // For organizers, only show their events
  if (userRole === "organizer") {
    const eventIds = await getOrganizerEventIds(userId);
    query.event_id = { $in: eventIds };
  }

  // Get tickets in the date range with event population
  // Make sure the population is working correctly
  const tickets = await TicketRepository.findAll(query, {
    populate: {
      event_id: true, // Changed from 'event' to 'event_id' to match the field name
      user_id: true, // Also populate user_id for analytics
    },
  });

  // Add validation before processing
  if (!tickets || tickets.length === 0) {
    return {
      startDate: startDate || "All time",
      endDate: endDate || "Present",
      totalSales: 0,
      ticketsSold: 0,
      salesByDay: {},
      salesByEvent: {},
    };
  }

  // Calculate sales by day and by event
  const salesByDay = calculateSalesByDay(tickets);
  const salesByEvent = calculateSalesByEventFromTickets(tickets);

  return {
    startDate: startDate || "All time",
    endDate: endDate || "Present",
    totalSales: tickets.reduce((sum, ticket) => sum + (ticket.price || 0), 0),
    ticketsSold: tickets.reduce(
      (sum, ticket) => sum + (ticket.quantity || 0),
      0
    ),
    salesByDay,
    salesByEvent,
  };
}

/**
 * Get comprehensive analytics data
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @returns {Object} Analytics data
 */
async function getAnalytics(userId, userRole) {
  // Check if user is authorized (must be an organizer or admin)
  if (userRole !== "organizer" && userRole !== "admin") {
    throw new Error("Unauthorized to view analytics");
  }

  // Build query based on user role
  const query = {};
  if (userRole === "organizer") {
    const eventIds = await getOrganizerEventIds(userId);
    query.event_id = { $in: eventIds };
  }

  // Get all tickets with populated data
  const tickets = await TicketRepository.findAll(query, {
    populate: { event: true, user: true },
  });

  // Calculate various analytics
  const totalRevenue = calculateTotalRevenue(tickets);
  const popularEvents = calculatePopularEvents(tickets);
  const customerRetention = calculateCustomerRetention(tickets);
  const salesOverTime = calculateSalesOverTime(tickets);

  return {
    totalRevenue,
    totalTicketsSold: tickets.reduce(
      (sum, ticket) => sum + ticket.quantity,
      0
    ),
    totalEvents: getUniqueEventCount(tickets),
    totalCustomers: getUniqueCustomerCount(tickets),
    popularEvents,
    customerRetention,
    salesOverTime,
  };
}

/**
 * Get organizer's event IDs
 * @param {string} userId - User ID
 * @returns {Array} Array of event IDs
 */
async function getOrganizerEventIds(userId) {
  const organizerEvents = await EventRepository.findByOrganizerId(userId);
  return organizerEvents.map((event) => event._id);
}

/**
 * Calculate sales by ticket type
 * @param {Array} tickets - Array of tickets
 * @returns {Object} Sales grouped by ticket type
 */
function calculateSalesByTicketType(tickets) {
  const salesByTicketType = {};
  tickets.forEach((ticket) => {
    if (!salesByTicketType[ticket.ticket_type]) {
      salesByTicketType[ticket.ticket_type] = {
        count: 0,
        revenue: 0,
      };
    }
    salesByTicketType[ticket.ticket_type].count += ticket.quantity;
    salesByTicketType[ticket.ticket_type].revenue += ticket.price;
  });
  return salesByTicketType;
}

/**
 * Calculate sales by day
 * @param {Array} tickets - Array of tickets
 * @returns {Object} Sales grouped by day
 */
function calculateSalesByDay(tickets) {
  const salesByDay = {};
  tickets.forEach((ticket) => {
    const day = ticket.createdAt.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    if (!salesByDay[day]) {
      salesByDay[day] = {
        count: 0,
        revenue: 0,
      };
    }
    salesByDay[day].count += ticket.quantity;
    salesByDay[day].revenue += ticket.price;
  });
  return salesByDay;
}

/**
 * Calculate sales by event from tickets with populated event data
 * @param {Array} tickets - Array of tickets with populated event_id
 * @returns {Object} Sales grouped by event
 */
function calculateSalesByEventFromTickets(tickets) {
  const salesByEvent = {};
  tickets.forEach((ticket) => {
    // Add defensive checks
    if (!ticket.event_id || !ticket.event_id._id) {
      console.warn("Ticket missing event_id or event_id._id:", ticket);
      return; // Skip this ticket
    }

    const eventId = ticket.event_id._id.toString();
    const eventTitle = ticket.event_id.title || "Unknown Event";

    if (!salesByEvent[eventId]) {
      salesByEvent[eventId] = {
        eventTitle,
        count: 0,
        revenue: 0,
      };
    }
    salesByEvent[eventId].count += ticket.quantity || 0;
    salesByEvent[eventId].revenue += ticket.price || 0;
  });
  return salesByEvent;
}

/**
 * Calculate total revenue from paid tickets
 * @param {Array} tickets - Array of tickets
 * @returns {number} Total revenue
 */
function calculateTotalRevenue(tickets) {
  return tickets
    .filter((ticket) => ticket.payment_status === "paid")
    .reduce((sum, ticket) => sum + ticket.price, 0);
}

/**
 * Calculate popular events based on ticket sales
 * @param {Array} tickets - Array of tickets
 * @returns {Array} Top 5 popular events
 */
function calculatePopularEvents(tickets) {
  const eventPopularity = {};
  tickets.forEach((ticket) => {
    // Add defensive checks
    if (!ticket.event_id || !ticket.event_id._id) {
      console.warn("Ticket missing event_id or event_id._id:", ticket);
      return; // Skip this ticket
    }

    const eventId = ticket.event_id._id.toString();
    if (!eventPopularity[eventId]) {
      eventPopularity[eventId] = {
        eventTitle: ticket.event_id.title || "Unknown Event",
        ticketsSold: 0,
        revenue: 0,
      };
    }
    eventPopularity[eventId].ticketsSold += ticket.quantity || 0;
    if (ticket.payment_status === "paid") {
      eventPopularity[eventId].revenue += ticket.price || 0;
    }
  });

  // Sort events by tickets sold and return top 5
  return Object.values(eventPopularity)
    .sort((a, b) => b.ticketsSold - a.ticketsSold)
    .slice(0, 5);
}

/**
 * Calculate customer retention metrics
 * @param {Array} tickets - Array of tickets
 * @returns {Object} Retention data
 */
function calculateCustomerRetention(tickets) {
  const userTicketCounts = {};
  tickets.forEach((ticket) => {
    // Add defensive checks
    if (!ticket.user_id || !ticket.user_id._id) {
      console.warn("Ticket missing user_id or user_id._id:", ticket);
      return; // Skip this ticket
    }

    const userId = ticket.user_id._id.toString();
    if (!userTicketCounts[userId]) {
      userTicketCounts[userId] = 0;
    }
    userTicketCounts[userId]++;
  });

  const retention = {
    singlePurchase: 0,
    multiplePurchases: 0,
  };

  Object.values(userTicketCounts).forEach((count) => {
    if (count === 1) {
      retention.singlePurchase++;
    } else {
      retention.multiplePurchases++;
    }
  });

  return retention;
}

/**
 * Calculate sales over time (last 6 months)
 * @param {Array} tickets - Array of tickets
 * @returns {Object} Sales data over time
 */
function calculateSalesOverTime(tickets) {
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  const salesOverTime = {};

  // Initialize with last 6 months
  for (let i = 0; i < 6; i++) {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    const monthStr = month.toISOString().substring(0, 7); // Format: YYYY-MM
    salesOverTime[monthStr] = {
      tickets: 0,
      revenue: 0,
    };
  }

  tickets
    .filter((ticket) => ticket.createdAt >= sixMonthsAgo)
    .forEach((ticket) => {
      const month = ticket.createdAt.toISOString().substring(0, 7); // Format: YYYY-MM
      if (!salesOverTime[month]) {
        salesOverTime[month] = {
          tickets: 0,
          revenue: 0,
        };
      }
      salesOverTime[month].tickets += ticket.quantity;
      if (ticket.payment_status === "paid") {
        salesOverTime[month].revenue += ticket.price;
      }
    });

  return salesOverTime;
}

/**
 * Get unique event count from tickets
 * @param {Array} tickets - Array of tickets
 * @returns {number} Number of unique events
 */
function getUniqueEventCount(tickets) {
  const uniqueEvents = new Set();
  tickets.forEach((ticket) => {
    if (ticket.event_id && ticket.event_id._id) {
      uniqueEvents.add(ticket.event_id._id.toString());
    }
  });
  return uniqueEvents.size;
}

/**
 * Get unique customer count from tickets
 * @param {Array} tickets - Array of tickets
 * @returns {number} Number of unique customers
 */
function getUniqueCustomerCount(tickets) {
  const uniqueCustomers = new Set();
  tickets.forEach((ticket) => {
    if (ticket.user_id && ticket.user_id._id) {
      uniqueCustomers.add(ticket.user_id._id.toString());
    }
  });
  return uniqueCustomers.size;
}

module.exports = {
  getSalesByEvent,
  getSalesByPeriod,
  getAnalytics,
  getOrganizerEventIds,
  calculateSalesByTicketType,
  calculateSalesByDay,
  calculateSalesByEventFromTickets,
  calculateTotalRevenue,
  calculatePopularEvents,
  calculateCustomerRetention,
  calculateSalesOverTime,
  getUniqueEventCount,
  getUniqueCustomerCount,
};