const Ticket = require("../../models/Ticket"); // Import the Ticket model
const Event = require("../../models/Event"); // Import the Event model (to check event validity)
const Order = require("../../models/Order"); // Import the Order model (to create an order)
const User = require("../../models/User"); // Import the User model (to check user validity)
const asyncHandler = require("express-async-handler");

// ===========================
// CREATE A TICKET (Buy Ticket)
// ===========================

// Modified buyTicket function in ticketController.js
exports.buyTicket = asyncHandler(async (req, res) => {
  const { eventId, ticketType, quantity } = req.body;

  // Ensure the user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "You must be logged in to buy a ticket." });
  }

  // Find the event to ensure it exists
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // Check if the requested ticket type exists
  const ticketOption = event.ticket_types.find((t) => t.type === ticketType);
  if (!ticketOption) {
    return res.status(400).json({ message: "Invalid ticket type" });
  }

  // Ensure enough tickets are available
  if (ticketOption.availability < quantity) {
    return res.status(400).json({ message: "Not enough tickets available" });
  }

  // Calculate the total price
  const totalPrice = ticketOption.price * quantity;

  // Create the ticket
  const ticket = await Ticket.create({
    user_id: req.user._id,
    event_id: eventId,
    ticket_type: ticketType,
    quantity: quantity,
    price: totalPrice,
    qr_code: null, // In a real app, you'd generate this
    payment_status: "pending",
  });

  // Reduce ticket availability
  ticketOption.availability -= quantity;
  await event.save();

  // Generate a unique order number
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Automatically create an order for this ticket
  const order = await Order.create({
    order_number: orderNumber,
    user_id: req.user._id,
    tickets: [ticket._id], // Array with the new ticket ID
    total_amount: totalPrice,
    discount_id: null, // No discount by default
    discount_amount: 0,
    payment_method: "pending", // This will be updated during payment
    payment_status: "pending",
    status: "pending"
  });

  res.status(201).json({ 
    message: "Ticket purchased successfully", 
    ticket,
    order,
    // You might want to include payment details or next steps here
  });
});

// ===========================
// GET ALL TICKETS (For Logged-in User)
// ===========================
exports.getTickets = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to view tickets." });
  }

  const tickets = await Ticket.find({ user_id: req.user._id }).populate(
    "event_id",
    "title date location"
  );
  res.status(200).json(tickets);
});

// ===========================
// GET A SINGLE TICKET (By ID)
// ===========================
exports.getTicketById = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to view this ticket." });
  }

  const ticket = await Ticket.findById(req.params.id).populate(
    "event_id",
    "title date location"
  );

  if (!ticket || ticket.user_id.toString() !== req.user._id.toString()) {
    return res
      .status(404)
      .json({ message: "Ticket not found or unauthorized" });
  }

  res.status(200).json(ticket);
});

// ===========================
// DELETE A TICKET (Cancel a Ticket)
// ===========================
exports.cancelTicket = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to cancel a ticket." });
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket || ticket.user_id.toString() !== req.user._id.toString()) {
    return res
      .status(404)
      .json({ message: "Ticket not found or unauthorized" });
  }

  // Find the event to restore ticket availability
  const event = await Event.findById(ticket.event_id);
  if (event) {
    const ticketOption = event.ticket_types.find(
      (t) => t.type === ticket.ticket_type
    );
    if (ticketOption) {
      ticketOption.availability += ticket.quantity;
      await event.save();
    }
  }

  await ticket.deleteOne();
  res.status(200).json({ message: "Ticket canceled successfully" });
});
