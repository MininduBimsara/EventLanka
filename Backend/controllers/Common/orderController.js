// orderController.js
const Order = require("../../models/Order");
const Ticket = require("../../models/Ticket");

const asyncHandler = require("express-async-handler");

// ===========================
// CREATE AN ORDER
// ===========================
exports.createOrder = asyncHandler(async (req, res) => {
  const { tickets, totalAmount, discountId, discountAmount, paymentMethod } =
    req.body;

  // Ensure the user is authenticated
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to create an order." });
  }

  // Validate that tickets are provided
  if (!tickets || !tickets.length) {
    return res
      .status(400)
      .json({ message: "No tickets provided for the order." });
  }

  // Generate a unique order number
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Create the order
  const order = await Order.create({
    order_number: orderNumber,
    user_id: req.user._id,
    tickets: tickets,
    total_amount: totalAmount,
    discount_id: discountId || null,
    discount_amount: discountAmount || 0,
    payment_method: paymentMethod,
    payment_status: "pending", // Will be updated after payment processing
    status: "pending",
  });

  // Update tickets with the order information
  await Ticket.updateMany(
    { _id: { $in: tickets } },
    { payment_status: "pending" }
  );

  res.status(201).json({
    message: "Order created successfully",
    order,
  });
});

// ===========================
// UPDATE AN ORDER
// ===========================
exports.updateOrder = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to update an order." });
  }

  const { id } = req.params;
  const { tickets, totalAmount, discountId, discountAmount, paymentMethod, status } = req.body;

  const order = await Order.findById(id);

  if (!order || order.user_id.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: "Order not found or unauthorized" });
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

  res.status(200).json({ message: "Order updated successfully", order });
});

// ===========================
// GET ALL ORDERS (For Logged-in User)
// ===========================
exports.getOrders = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to view orders." });
  }

  const orders = await Order.find({ user_id: req.user._id })
    .populate("tickets")
    .populate("discount_id");

  res.status(200).json(orders);
});

// ===========================
// GET A SINGLE ORDER (By ID)
// ===========================
exports.getOrderById = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to view this order." });
  }

  const order = await Order.findById(req.params.id)
    .populate("tickets")
    .populate("discount_id");

  if (!order || order.user_id.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: "Order not found or unauthorized" });
  }

  res.status(200).json(order);
});

// ===========================
// CANCEL AN ORDER
// ===========================
exports.cancelOrder = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to cancel an order." });
  }

  const order = await Order.findById(req.params.id);

  if (!order || order.user_id.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: "Order not found or unauthorized" });
  }

  // Only allow cancellation if payment status is not 'paid'
  if (order.payment_status === "paid") {
    return res
      .status(400)
      .json({
        message:
          "Paid orders cannot be cancelled directly. Please request a refund.",
      });
  }

  // Update the order status
  order.status = "cancelled";
  await order.save();

  // Update associated tickets
  await Ticket.updateMany(
    { _id: { $in: order.tickets } },
    { payment_status: "refunded" }
  );

  res.status(200).json({ message: "Order cancelled successfully", order });
});

// ===========================
// DELETE AN ORDER
// ===========================
exports.deleteOrder = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to delete an order." });
  }

  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order || order.user_id.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: "Order not found or unauthorized" });
  }

  // Only allow deletion if payment status is not 'paid'
  if (order.payment_status === "paid") {
    return res.status(400).json({
      message: "Paid orders cannot be deleted directly. Please request a refund.",
    });
  }

  // Delete the order
  await order.remove();

  // Update associated tickets
  await Ticket.updateMany(
    { _id: { $in: order.tickets } },
    { payment_status: "available" }
  );

  res.status(200).json({ message: "Order deleted successfully" });
});

module.exports = exports;