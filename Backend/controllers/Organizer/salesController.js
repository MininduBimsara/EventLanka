const Ticket = require("../../models/Ticket");
const Event = require("../../models/Event");
const User = require("../../models/User");
const asyncHandler = require("express-async-handler");

// Get sales data for a specific event
exports.getSalesByEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  // Check if user is authorized (event organizer or admin)
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (
    event.organizer_id.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Unauthorized to view sales data" });
  }

  // Get all tickets for the event
  const tickets = await Ticket.find({
    event_id: eventId,
    payment_status: "paid", // Only count paid tickets
  });

  // Calculate total sales
  const totalSales = tickets.reduce((sum, ticket) => sum + ticket.price, 0);

  // Calculate sales by ticket type
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

  res.status(200).json({
    eventId,
    totalSales,
    ticketsSold: tickets.reduce((sum, ticket) => sum + ticket.quantity, 0),
    salesByTicketType,
  });
});

// Get sales data within a time frame
exports.getSalesByPeriod = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  // Check if user is authorized (must be an organizer or admin)
  if (req.user.role !== "organizer" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized to view sales data" });
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
  if (req.user.role === "organizer") {
    const organizerEvents = await Event.find({
      organizer_id: req.user.id,
    }).select("_id");
    const eventIds = organizerEvents.map((event) => event._id);
    query.event_id = { $in: eventIds };
  }

  // Get tickets in the date range
  const tickets = await Ticket.find(query).populate("event_id", "title");

  // Calculate sales by day
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

  // Calculate sales by event
  const salesByEvent = {};
  tickets.forEach((ticket) => {
    const eventId = ticket.event_id._id.toString();
    const eventTitle = ticket.event_id.title;

    if (!salesByEvent[eventId]) {
      salesByEvent[eventId] = {
        eventTitle,
        count: 0,
        revenue: 0,
      };
    }
    salesByEvent[eventId].count += ticket.quantity;
    salesByEvent[eventId].revenue += ticket.price;
  });

  res.status(200).json({
    startDate: startDate || "All time",
    endDate: endDate || "Present",
    totalSales: tickets.reduce((sum, ticket) => sum + ticket.price, 0),
    ticketsSold: tickets.reduce((sum, ticket) => sum + ticket.quantity, 0),
    salesByDay,
    salesByEvent,
  });
});

// Get analytics data
exports.getAnalytics = asyncHandler(async (req, res) => {
  // Check if user is authorized (must be an organizer or admin)
  if (req.user.role !== "organizer" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized to view analytics" });
  }

  // For organizers, only show their events
  const query = {};
  if (req.user.role === "organizer") {
    const organizerEvents = await Event.find({
      organizer_id: req.user.id,
    }).select("_id");
    const eventIds = organizerEvents.map((event) => event._id);
    query.event_id = { $in: eventIds };
  }

  // Get all tickets
  const tickets = await Ticket.find(query)
    .populate("event_id", "title date location")
    .populate("user_id", "email");

  // Calculate various analytics

  // 1. Total revenue
  const totalRevenue = tickets
    .filter((ticket) => ticket.payment_status === "paid")
    .reduce((sum, ticket) => sum + ticket.price, 0);

  // 2. Popular events
  const eventPopularity = {};
  tickets.forEach((ticket) => {
    const eventId = ticket.event_id._id.toString();
    if (!eventPopularity[eventId]) {
      eventPopularity[eventId] = {
        eventTitle: ticket.event_id.title,
        ticketsSold: 0,
        revenue: 0,
      };
    }
    eventPopularity[eventId].ticketsSold += ticket.quantity;
    if (ticket.payment_status === "paid") {
      eventPopularity[eventId].revenue += ticket.price;
    }
  });

  // Sort events by tickets sold
  const popularEvents = Object.values(eventPopularity)
    .sort((a, b) => b.ticketsSold - a.ticketsSold)
    .slice(0, 5); // Top 5

  // 3. User retention (return customers)
  const userTicketCounts = {};
  tickets.forEach((ticket) => {
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

  // 4. Sales over time (last 6 months)
  const today = new Date();
  const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));

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

  res.status(200).json({
    totalRevenue,
    totalTicketsSold: tickets.reduce((sum, ticket) => sum + ticket.quantity, 0),
    totalEvents: Object.keys(eventPopularity).length,
    totalCustomers: Object.keys(userTicketCounts).length,
    popularEvents,
    customerRetention: retention,
    salesOverTime,
  });
});

module.exports = exports;
