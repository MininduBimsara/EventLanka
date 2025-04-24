const Discount = require("../../models/Discount");
const Event = require("../../models/Event");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

// Create a new discount code
exports.create = asyncHandler(async (req, res) => {
  const {
    applicable_events,
    code,
    description,
    discount_type,
    discount_value,
    usage_limit,
    start_date,
    end_date,
    minimum_purchase_amount,
  } = req.body;

  // Check if user is authorized (event organizer or admin)
  const events = await Event.find({ _id: { $in: applicable_events } });
  if (!events || events.length === 0) {
    return res.status(404).json({ message: "One or more events not found" });
  }

  const unauthorizedEvent = events.find(
    (event) =>
      event.organizer_id.toString() !== req.user.id && req.user.role !== "admin"
  );
  if (unauthorizedEvent) {
    return res.status(403).json({
      message: "Unauthorized to create discount codes for one or more events",
    });
  }

  // Check if code already exists
  const existingCode = await Discount.findOne({ code: code.toUpperCase() });
  if (existingCode) {
    return res.status(400).json({ message: "Discount code already exists" });
  }

  const discount = await Discount.create({
    applicable_events,
    code: code.toUpperCase(),
    description: description || "",
    discount_type,
    discount_value,
    usage_limit: usage_limit || null,
    usage_count: 0,
    start_date: start_date || Date.now(),
    end_date,
    minimum_purchase_amount: minimum_purchase_amount || 0,
    is_active: true,
    created_by: req.user.id,
  });

  res
    .status(201)
    .json({ message: "Discount code created successfully", discount });
});

// Get all discount codes for an event
exports.getAll = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  // Validate eventId
  if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  // Check if user is authorized (event organizer or admin)
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (
    event.organizer_id.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res
      .status(403)
      .json({ message: "Unauthorized to view discount codes" });
  }

  const discounts = await Discount.find({ applicable_events: eventId });
  res.status(200).json(discounts);
});

// Update a discount code
exports.update = asyncHandler(async (req, res) => {
  const { discountId } = req.params;
  const updates = req.body;

  const discount = await Discount.findById(discountId);
  if (!discount) {
    return res.status(404).json({ message: "Discount code not found" });
  }

  // Check if user is authorized (event organizer or admin)
  const events = await Event.find({ _id: { $in: discount.applicable_events } });
  const unauthorizedEvent = events.find(
    (event) =>
      event.organizer_id.toString() !== req.user.id && req.user.role !== "admin"
  );
  if (unauthorizedEvent) {
    return res
      .status(403)
      .json({ message: "Unauthorized to update discount codes" });
  }

  // Don't allow changing the code itself, only other properties
  delete updates.code;
  delete updates.created_by;
  delete updates.usage_count;

  const updatedDiscount = await Discount.findByIdAndUpdate(
    discountId,
    updates,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    message: "Discount code updated successfully",
    discount: updatedDiscount,
  });
});

// Delete a discount code
exports.delete = asyncHandler(async (req, res) => {
  const { discountId } = req.params;

  const discount = await Discount.findById(discountId);
  if (!discount) {
    return res.status(404).json({ message: "Discount code not found" });
  }

  // Check if user is authorized (event organizer or admin)
  const events = await Event.find({ _id: { $in: discount.applicable_events } });
  const unauthorizedEvent = events.find(
    (event) =>
      event.organizer_id.toString() !== req.user.id && req.user.role !== "admin"
  );
  if (unauthorizedEvent) {
    return res
      .status(403)
      .json({ message: "Unauthorized to delete discount codes" });
  }

  await discount.deleteOne();
  res.status(200).json({ message: "Discount code deleted successfully" });
});

// Validate a discount code
exports.validateCode = asyncHandler(async (req, res) => {
  const { eventId, code, ticketCount, ticketType } = req.body;

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const discount = await Discount.findOne({
    applicable_events: eventId,
    code: code.toUpperCase(),
    is_active: true,
  });

  if (!discount) {
    return res.status(404).json({ message: "Invalid discount code" });
  }

  // Check if code has expired
  if (discount.end_date && new Date() > new Date(discount.end_date)) {
    return res.status(400).json({ message: "Discount code has expired" });
  }

  // Check if code has reached maximum uses
  if (discount.usage_limit && discount.usage_count >= discount.usage_limit) {
    return res
      .status(400)
      .json({ message: "Discount code has reached maximum uses" });
  }

  // Check if minimum purchase amount is met
  if (ticketCount < discount.minimum_purchase_amount) {
    return res.status(400).json({
      message: `Minimum ${discount.minimum_purchase_amount} tickets required for this discount code`,
    });
  }

  // Calculate discount amount
  let discountAmount = 0;
  const ticketTypeDetails = event.ticket_types.find(
    (t) => t.type === ticketType
  );

  if (!ticketTypeDetails) {
    return res.status(400).json({ message: "Invalid ticket type" });
  }

  const ticketPrice = ticketTypeDetails.price;

  if (discount.discount_type === "percentage") {
    discountAmount =
      ((ticketPrice * discount.discount_value) / 100) * ticketCount;
  } else {
    // fixed amount
    discountAmount = discount.discount_value * ticketCount;
  }

  res.status(200).json({
    valid: true,
    discountAmount,
    discountType: discount.discount_type,
    discountValue: discount.discount_value,
  });
});

module.exports = exports;
