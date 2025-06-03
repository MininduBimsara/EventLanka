// Import repositories
const OrderRepository = require("../../Repository/OrderRepository");
const TicketRepository = require("../../Repository/TicketRepository");

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

  // Create tickets first using repository
  const ticketIds = await createTickets(tickets, user._id, event_id);

  // Create the order with ticket IDs using repository
  const orderCreateData = {
    order_number: orderNumber,
    user_id: user._id,
    tickets: ticketIds,
    total_amount: total_amount,
    discount_id: discount_id || null,
    discount_amount: discount_amount || 0,
    payment_method: payment_method,
    payment_status: "pending",
    status: "pending",
  };

  const order = await OrderRepository.create(orderCreateData);

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
  const ticketsData = tickets.map((ticketData) => ({
    user_id: userId,
    event_id: eventId,
    ticket_type: ticketData.ticket_type,
    quantity: ticketData.quantity,
    payment_status: "pending",
  }));

  const createdTickets = await TicketRepository.createMany(ticketsData);
  return createdTickets.map((ticket) => ticket._id);
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

  const order = await OrderRepository.findById(orderId);

  if (!order || order.user_id.toString() !== user._id.toString()) {
    throw new Error("Order not found or unauthorized");
  }

  // Prepare update data
  const orderUpdateData = {};

  if (tickets) {
    orderUpdateData.tickets = tickets;
    // Update associated tickets
    await TicketRepository.updatePaymentStatusByIds(tickets, "pending");
  }

  if (totalAmount !== undefined) orderUpdateData.total_amount = totalAmount;
  if (discountId !== undefined) orderUpdateData.discount_id = discountId;
  if (discountAmount !== undefined)
    orderUpdateData.discount_amount = discountAmount;
  if (paymentMethod !== undefined)
    orderUpdateData.payment_method = paymentMethod;
  if (status !== undefined) orderUpdateData.status = status;

  const updatedOrder = await OrderRepository.updateById(
    orderId,
    orderUpdateData
  );

  return updatedOrder;
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

  return await OrderRepository.findByUserId(user._id, {
    tickets: true,
    discount: true,
  });
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

  const order = await OrderRepository.findById(orderId, {
    tickets: true,
    discount: true,
  });

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

  const order = await OrderRepository.findById(orderId);

  if (!order || order.user_id.toString() !== user._id.toString()) {
    throw new Error("Order not found or unauthorized");
  }

  // Only allow cancellation if payment status is not 'paid'
  if (order.payment_status === "paid") {
    throw new Error(
      "Paid orders cannot be cancelled directly. Please request a refund."
    );
  }

  // Update the order status using repository
  const cancelledOrder = await OrderRepository.updateStatus(
    orderId,
    "cancelled"
  );

  // Update associated tickets using repository
  await TicketRepository.updatePaymentStatusByIds(order.tickets, "refunded");

  return cancelledOrder;
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

  const order = await OrderRepository.findById(orderId);

  if (!order || order.user_id.toString() !== user._id.toString()) {
    throw new Error("Order not found or unauthorized");
  }

  // Only allow deletion if payment status is not 'paid'
  if (order.payment_status === "paid") {
    throw new Error(
      "Paid orders cannot be deleted directly. Please request a refund."
    );
  }

  // Delete the order using repository
  await OrderRepository.deleteById(orderId);

  // Update associated tickets to make them available again
  await TicketRepository.updatePaymentStatusByIds(order.tickets, "available");

  return true;
};

/**
 * Get order statistics for admin/analytics
 * @param {Object} filter - Optional filter criteria
 * @returns {Object} Order statistics
 */
const getOrderStatistics = async (filter = {}) => {
  return await OrderRepository.getStatistics(filter);
};

/**
 * Get orders by status
 * @param {String} status - Order status
 * @param {Object} options - Query options
 * @returns {Array} Orders with specified status
 */
const getOrdersByStatus = async (status, options = {}) => {
  return await OrderRepository.findByStatus(status, options);
};

/**
 * Get orders by payment status
 * @param {String} paymentStatus - Payment status
 * @param {Object} options - Query options
 * @returns {Array} Orders with specified payment status
 */
const getOrdersByPaymentStatus = async (paymentStatus, options = {}) => {
  return await OrderRepository.findByPaymentStatus(paymentStatus, options);
};

/**
 * Update order payment status
 * @param {String} orderId - Order ID
 * @param {String} paymentStatus - New payment status
 * @param {Object} user - Current user (optional for admin operations)
 * @returns {Object} Updated order
 */
const updateOrderPaymentStatus = async (
  orderId,
  paymentStatus,
  user = null
) => {
  // If user is provided, check authorization
  if (user) {
    const order = await OrderRepository.findById(orderId);
    if (!order || order.user_id.toString() !== user._id.toString()) {
      throw new Error("Order not found or unauthorized");
    }
  }

  const updatedOrder = await OrderRepository.updatePaymentStatus(
    orderId,
    paymentStatus
  );

  // Update associated tickets if payment is successful
  if (paymentStatus === "paid") {
    const order = await OrderRepository.findById(orderId);
    await TicketRepository.updatePaymentStatusByIds(order.tickets, "paid");
    // Also update order status to completed
    await OrderRepository.updateStatus(orderId, "completed");
  }

  return updatedOrder;
};

/**
 * Get orders within a date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Object} options - Query options
 * @returns {Array} Orders within date range
 */
const getOrdersByDateRange = async (startDate, endDate, options = {}) => {
  return await OrderRepository.findByDateRange(startDate, endDate, options);
};

/**
 * Get user's orders for a specific event
 * @param {String} userId - User ID
 * @param {String} eventId - Event ID
 * @param {Object} options - Query options
 * @returns {Array} User's orders for the event
 */
const getUserOrdersForEvent = async (userId, eventId, options = {}) => {
  return await OrderRepository.findByUserAndEvent(userId, eventId, options);
};

/**
 * Check if order exists
 * @param {String} orderId - Order ID
 * @returns {Boolean} True if order exists
 */
const orderExists = async (orderId) => {
  return await OrderRepository.exists(orderId);
};

/**
 * Count orders with optional filter
 * @param {Object} filter - MongoDB filter object
 * @returns {Number} Count of orders
 */
const countOrders = async (filter = {}) => {
  return await OrderRepository.count(filter);
};

// Export all functions
module.exports = {
  createOrder,
  updateOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  deleteOrder,
  getOrderStatistics,
  getOrdersByStatus,
  getOrdersByPaymentStatus,
  updateOrderPaymentStatus,
  getOrdersByDateRange,
  getUserOrdersForEvent,
  orderExists,
  countOrders,
  generateOrderNumber,
  createTickets,
};
