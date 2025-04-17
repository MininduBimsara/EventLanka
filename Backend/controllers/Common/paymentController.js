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
