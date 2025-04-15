// orderController.js
const Order = require("../../models/Order");
const Ticket = require("../../models/Ticket");
const Discount = require("../../models/Discount");
const Payment = require("../../models/Payment");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid"); // For generating order numbers

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

// discountController.js
const Discount = require("../../models/Discount");
const Event = require("../../models/Event");
const asyncHandler = require("express-async-handler");

// ===========================
// VERIFY DISCOUNT CODE
// ===========================
exports.verifyDiscountCode = asyncHandler(async (req, res) => {
  const { code, eventId, subtotal } = req.body;

  // Find the discount code
  const discount = await Discount.findOne({
    code: code.toUpperCase(),
    is_active: true,
  });

  if (!discount) {
    return res.status(404).json({ message: "Invalid discount code" });
  }

  // Check if the discount is expired
  const now = new Date();
  if (now < discount.start_date || now > discount.end_date) {
    return res.status(400).json({ message: "Discount code has expired" });
  }

  // Check usage limit
  if (
    discount.usage_limit !== null &&
    discount.usage_count >= discount.usage_limit
  ) {
    return res
      .status(400)
      .json({ message: "Discount code usage limit reached" });
  }

  // Check minimum purchase amount
  if (subtotal < discount.minimum_purchase_amount) {
    return res.status(400).json({
      message: `Minimum purchase amount of $${discount.minimum_purchase_amount} required for this discount`,
    });
  }

  // Check if applicable to the event
  if (
    discount.applicable_events.length > 0 &&
    !discount.applicable_events.includes(eventId)
  ) {
    return res
      .status(400)
      .json({ message: "Discount not applicable to this event" });
  }

  // Calculate discount value
  let discountValue = 0;
  if (discount.discount_type === "percentage") {
    discountValue = (subtotal * discount.discount_value) / 100;
  } else {
    discountValue = discount.discount_value;
  }

  res.status(200).json({
    message: "Discount code applied successfully",
    ...discount._doc,
    calculated_value: discountValue,
  });
});

// ===========================
// CREATE DISCOUNT CODE (Admin Only)
// ===========================
exports.createDiscountCode = asyncHandler(async (req, res) => {
  // Ensure the user is an admin
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Not authorized to create discount codes" });
  }

  const {
    code,
    description,
    discount_type,
    discount_value,
    start_date,
    end_date,
    usage_limit,
    minimum_purchase_amount,
    applicable_events,
  } = req.body;

  // Check if discount code already exists
  const existingDiscount = await Discount.findOne({ code: code.toUpperCase() });
  if (existingDiscount) {
    return res.status(400).json({ message: "Discount code already exists" });
  }

  // Create the discount code
  const discount = await Discount.create({
    code: code.toUpperCase(),
    description,
    discount_type,
    discount_value,
    start_date,
    end_date,
    usage_limit,
    minimum_purchase_amount,
    applicable_events,
    created_by: req.user._id,
  });

  res.status(201).json({
    message: "Discount code created successfully",
    discount,
  });
});

// paymentController.js
const Payment = require("../../models/Payment");
const Order = require("../../models/Order");
const Ticket = require("../../models/Ticket");
const asyncHandler = require("express-async-handler");

// ===========================
// PROCESS PAYMENT
// ===========================
exports.processPayment = asyncHandler(async (req, res) => {
  const { orderId, amount, paymentMethod } = req.body;

  // Ensure the user is authenticated
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to process payment." });
  }

  // Find the order
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Check if the order belongs to the user
  if (order.user_id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // In a real application, you would integrate with a payment gateway like Stripe or PayPal here
  // For this example, we'll simulate a successful payment

  // Generate a transaction ID
  const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Create a payment record
  const payment = await Payment.create({
    user_id: req.user._id,
    event_id: order.tickets[0].event_id, // Assuming all tickets are for the same event
    amount: amount,
    payment_method: paymentMethod,
    status: "completed", // In production, this would depend on the payment gateway response
    transaction_id: transactionId,
  });

  // Update the order status
  order.payment_status = "paid";
  order.status = "completed";
  order.payment_details = {
    transaction_id: transactionId,
    provider: paymentMethod === "creditCard" ? "Stripe" : "PayPal",
    card_last4: paymentMethod === "creditCard" ? "4242" : null, // In production, this would come from the payment gateway
  };
  await order.save();

  // Update the tickets payment status
  await Ticket.updateMany(
    { _id: { $in: order.tickets } },
    { payment_status: "paid" }
  );

  // If there was a discount used, increment its usage count
  if (order.discount_id) {
    await Discount.findByIdAndUpdate(order.discount_id, {
      $inc: { usage_count: 1 },
    });
  }

  res.status(200).json({
    message: "Payment processed successfully",
    payment,
    order,
  });
});

// ===========================
// GET PAYMENT HISTORY (For Logged-in User)
// ===========================
exports.getPaymentHistory = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to view payment history." });
  }

  const payments = await Payment.find({ user_id: req.user._id })
    .populate("event_id", "title date location")
    .sort({ createdAt: -1 });

  res.status(200).json(payments);
});
