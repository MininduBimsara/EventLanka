const Order = require("../../models/Order");
const Ticket = require("../../models/Ticket");

/**
 * Create a new order
 * @param {Object} orderData - Order data
 * @param {Object} user - Current user
 * @returns {Object} Created order
 */
const createOrder = async (orderData, user) => {
  const {
    event_id,
    tickets,
    total_amount,
    discount_id,
    discount_amount,
    payment_method,
  } = orderData;

  if (!user) {
    throw new Error("You must be logged in to create an order.");
  }

  if (!tickets || !tickets.length) {
    throw new Error("No tickets provided for the order.");
  }

  // Generate a unique order number
  const orderNumber = generateOrderNumber();

  // Create tickets first
  const ticketIds = await createTickets(tickets, user._id, event_id);

  // Create the order with ticket IDs
  const order = await Order.create({
    order_number: orderNumber,
    user_id: user._id,
    tickets: ticketIds,
    total_amount: total_amount,
    discount_id: discount_id || null,
    discount_amount: discount_amount || 0,
    payment_method: payment_method,
    payment_status: "pending",
    status: "pending",
  });

  return order;
};

/**
 * Generate a unique order number
 * @returns {String} Order number
 */
const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Create tickets for an order
 * @param {Array} tickets - Ticket data
 * @param {String} userId - User ID
 * @param {String} eventId - Event ID
 * @returns {Array} Created ticket IDs
 */
const createTickets = async (tickets, userId, eventId) => {
  const ticketIds = [];

  for (const ticketData of tickets) {
    const ticket = await Ticket.create({
      user_id: userId,
      event_id: eventId,
      ticket_type: ticketData.ticket_type,
      quantity: ticketData.quantity,
      payment_status: "pending",
    });

    ticketIds.push(ticket._id);
  }

  return ticketIds;
};

/**
 * Update an existing order
 * @param {String} orderId - Order ID
 * @param {Object} updateData - Updated order data
 * @param {Object} user - Current user
 * @returns {Object} Updated order
 */
const updateOrder = async (orderId, updateData, user) => {
  if (!user) {
    throw new Error("You must be logged in to update an order.");
  }

  const {
    tickets,
    totalAmount,
    discountId,
    discountAmount,
    paymentMethod,
    status,
  } = updateData;

  const order = await Order.findById(orderId);

  if (!order || order.user_id.toString() !== user._id.toString()) {
    throw new Error("Order not found or unauthorized");
  }

  // Update fields if provided
  if (tickets) {
    order.tickets = tickets;
    await Ticket.updateMany(
      { _id: { $in: tickets } },
      { payment_status: "pending" }
    );
  }

  if (totalAmount !== undefined) order.total_amount = totalAmount;
  if (discountId !== undefined) order.discount_id = discountId;
  if (discountAmount !== undefined) order.discount_amount = discountAmount;
  if (paymentMethod !== undefined) order.payment_method = paymentMethod;
  if (status !== undefined) order.status = status;

  await order.save();

  return order;
};

/**
 * Get all orders for a user
 * @param {Object} user - Current user
 * @returns {Array} User orders
 */
const getOrders = async (user) => {
  if (!user) {
    throw new Error("You must be logged in to view orders.");
  }

  return await Order.find({ user_id: user._id })
    .populate({
      path: "tickets",
      populate: {
        path: "event_id",
        model: "Event",
      },
    })
    .populate("discount_id");
};

/**
 * Get a single order by ID
 * @param {String} orderId - Order ID
 * @param {Object} user - Current user
 * @returns {Object} Order
 */
const getOrderById = async (orderId, user) => {
  if (!user) {
    throw new Error("You must be logged in to view this order.");
  }

  const order = await Order.findById(orderId)
    .populate({
      path: "tickets",
      populate: {
        path: "event_id",
        model: "Event",
      },
    })
    .populate("discount_id");

  if (!order || order.user_id.toString() !== user._id.toString()) {
    throw new Error("Order not found or unauthorized");
  }

  return order;
};

/**
 * Cancel an order
 * @param {String} orderId - Order ID
 * @param {Object} user - Current user
 * @returns {Object} Cancelled order
 */
const cancelOrder = async (orderId, user) => {
  if (!user) {
    throw new Error("You must be logged in to cancel an order.");
  }

  const order = await Order.findById(orderId);

  if (!order || order.user_id.toString() !== user._id.toString()) {
    throw new Error("Order not found or unauthorized");
  }

  // Only allow cancellation if payment status is not 'paid'
  if (order.payment_status === "paid") {
    throw new Error(
      "Paid orders cannot be cancelled directly. Please request a refund."
    );
  }

  // Update the order status
  order.status = "cancelled";
  await order.save();

  // Update associated tickets
  await Ticket.updateMany(
    { _id: { $in: order.tickets } },
    { payment_status: "refunded" }
  );

  return order;
};

/**
 * Delete an order
 * @param {String} orderId - Order ID
 * @param {Object} user - Current user
 * @returns {Boolean} Success status
 */
const deleteOrder = async (orderId, user) => {
  if (!user) {
    throw new Error("You must be logged in to delete an order.");
  }

  const order = await Order.findById(orderId);

  if (!order || order.user_id.toString() !== user._id.toString()) {
    throw new Error("Order not found or unauthorized");
  }

  // Only allow deletion if payment status is not 'paid'
  if (order.payment_status === "paid") {
    throw new Error(
      "Paid orders cannot be deleted directly. Please request a refund."
    );
  }

  // Delete the order
  await order.deleteOne();

  // Update associated tickets
  await Ticket.updateMany(
    { _id: { $in: order.tickets } },
    { payment_status: "available" }
  );

  return true;
};

module.exports = {
  createOrder,
  updateOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  deleteOrder,
};
