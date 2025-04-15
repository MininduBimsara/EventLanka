const Discount = require("../../models/Discount"); // You'll need to create this model
const Event = require("../../models/Event");
const asyncHandler = require("express-async-handler");

// Create a new discount code
exports.create = asyncHandler(async (req, res) => {
  const {
    eventId,
    code,
    discountType,
    value,
    maxUses,
    expiryDate,
    minTicketCount,
    applicableTicketTypes,
  } = req.body;

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
      .json({ message: "Unauthorized to create discount codes" });
  }

  // Check if code already exists for this event
  const existingCode = await Discount.findOne({
    event_id: eventId,
    code: code.toUpperCase(),
  });

  if (existingCode) {
    return res
      .status(400)
      .json({ message: "Discount code already exists for this event" });
  }

  const discount = await Discount.create({
    event_id: eventId,
    code: code.toUpperCase(),
    discount_type: discountType, // percentage or fixed
    value: value,
    max_uses: maxUses || null,
    current_uses: 0,
    expiry_date: expiryDate || null,
    min_ticket_count: minTicketCount || 1,
    applicable_ticket_types: applicableTicketTypes || [], // Empty array means all ticket types
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

  const discounts = await Discount.find({ event_id: eventId });
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
  const event = await Event.findById(discount.event_id);
  if (
    event.organizer_id.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res
      .status(403)
      .json({ message: "Unauthorized to update discount codes" });
  }

  // Don't allow changing the code itself, only other properties
  delete updates.code;
  delete updates.event_id;
  delete updates.created_by;
  delete updates.current_uses;

  const updatedDiscount = await Discount.findByIdAndUpdate(
    discountId,
    updates,
    { new: true, runValidators: true }
  );

  res
    .status(200)
    .json({
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
  const event = await Event.findById(discount.event_id);
  if (
    event.organizer_id.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
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
    event_id: eventId,
    code: code.toUpperCase(),
    is_active: true,
  });

  if (!discount) {
    return res.status(404).json({ message: "Invalid discount code" });
  }

  // Check if code has expired
  if (discount.expiry_date && new Date() > new Date(discount.expiry_date)) {
    return res.status(400).json({ message: "Discount code has expired" });
  }

  // Check if code has reached maximum uses
  if (discount.max_uses && discount.current_uses >= discount.max_uses) {
    return res
      .status(400)
      .json({ message: "Discount code has reached maximum uses" });
  }

  // Check if minimum ticket count is met
  if (ticketCount < discount.min_ticket_count) {
    return res.status(400).json({
      message: `Minimum ${discount.min_ticket_count} tickets required for this discount code`,
    });
  }

  // Check if ticket type is applicable
  if (
    discount.applicable_ticket_types.length > 0 &&
    !discount.applicable_ticket_types.includes(ticketType)
  ) {
    return res.status(400).json({
      message: "Discount code not applicable for this ticket type",
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
    discountAmount = ((ticketPrice * discount.value) / 100) * ticketCount;
  } else {
    // fixed amount
    discountAmount = discount.value * ticketCount;
  }

  res.status(200).json({
    valid: true,
    discountAmount,
    discountType: discount.discount_type,
    discountValue: discount.value,
  });
});

module.exports = exports;
