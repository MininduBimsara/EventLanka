// Add this to your existing controller (like orderController.js) or create a new refundController.js
const RefundRequest = require("../../models/RefundRequest");
const Order = require("../../models/Order");
const asyncHandler = require("express-async-handler");

/**
 * Create a refund request for a paid order
 * @route POST /api/refunds/request
 * @access Private (User)
 */
exports.createRefundRequest = asyncHandler(async (req, res) => {
  const { orderId, reason } = req.body;

  // Validation
  if (!orderId || !reason) {
    return res.status(400).json({
      message: "Order ID and reason are required",
    });
  }

  // Ensure the user is authenticated
  if (!req.user) {
    return res.status(401).json({
      message: "You must be logged in to request a refund.",
    });
  }

  // Find the order
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Check if the order belongs to the user
  if (order.user_id.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "Not authorized to request refund for this order" });
  }

  // Check if the order has been paid
  if (order.payment_status !== "paid") {
    return res.status(400).json({
      message: "Only paid orders can be refunded",
    });
  }

  // Check if a refund request already exists for this order
  const existingRequest = await RefundRequest.findOne({ order_id: orderId });
  if (existingRequest) {
    return res.status(400).json({
      message: "A refund request already exists for this order",
      status: existingRequest.status,
    });
  }

  // Create the refund request
  const refundRequest = await RefundRequest.create({
    user_id: req.user._id,
    order_id: orderId,
    amount: order.total_amount,
    reason: reason,
    status: "pending", // Initial status is pending
    request_date: Date.now(),
  });

  // Update the order status to reflect that a refund is in progress
  order.status = "refund_requested";
  await order.save();

  res.status(201).json({
    message: "Refund request submitted successfully",
    refundRequest,
  });
});

/**
 * Get all refund requests for the logged-in user
 * @route GET /api/refunds
 * @access Private (User)
 */
exports.getUserRefundRequests = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "You must be logged in to view refund requests.",
    });
  }

  const refundRequests = await RefundRequest.find({ user_id: req.user._id })
    .populate("order_id")
    .sort({ request_date: -1 });

  res.status(200).json(refundRequests);
});

/**
 * Get details of a specific refund request
 * @route GET /api/refunds/:id
 * @access Private (User)
 */
exports.getRefundRequestById = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "You must be logged in to view this refund request.",
    });
  }

  const refundRequest = await RefundRequest.findById(req.params.id).populate(
    "order_id"
  );

  if (
    !refundRequest ||
    refundRequest.user_id.toString() !== req.user._id.toString()
  ) {
    return res.status(404).json({
      message: "Refund request not found or unauthorized",
    });
  }

  res.status(200).json(refundRequest);
});

/**
 * Cancel a pending refund request
 * @route DELETE /api/refunds/:id
 * @access Private (User)
 */
exports.cancelRefundRequest = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "You must be logged in to cancel a refund request.",
    });
  }

  const refundRequest = await RefundRequest.findById(req.params.id);

  if (
    !refundRequest ||
    refundRequest.user_id.toString() !== req.user._id.toString()
  ) {
    return res.status(404).json({
      message: "Refund request not found or unauthorized",
    });
  }

  // Only allow cancellation if status is pending
  if (refundRequest.status !== "pending") {
    return res.status(400).json({
      message: `Cannot cancel a refund request that is already ${refundRequest.status}`,
    });
  }

  // Update the order status back to completed
  const order = await Order.findById(refundRequest.order_id);
  if (order) {
    order.status = "completed";
    await order.save();
  }

  // Delete the refund request
  await refundRequest.deleteOne();

  res.status(200).json({
    message: "Refund request cancelled successfully",
  });
});
