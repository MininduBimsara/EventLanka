const discountService = require("../../services/discountService");
const asyncHandler = require("express-async-handler");

// Create a new discount code
exports.create = asyncHandler(async (req, res) => {
  try {
    const discount = await discountService.createDiscount(
      req.body,
      req.user.id,
      req.user.role
    );

    res.status(201).json({
      message: "Discount code created successfully",
      discount,
    });
  } catch (error) {
    const errorMessages = {
      "One or more events not found": 404,
      "Unauthorized to manage discount codes for one or more events": 403,
      "Discount code already exists": 400,
      "Invalid discount type. Must be 'percentage' or 'fixed'": 400,
      "Discount value must be greater than 0": 400,
      "Percentage discount cannot exceed 100%": 400,
      "Start date must be before end date": 400,
    };

    const statusCode = errorMessages[error.message] || 500;
    res.status(statusCode).json({
      message: error.message,
      ...(statusCode === 500 && { error: error.message }),
    });
  }
});

// Get all discount codes for an event
exports.getAll = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  try {
    const discounts = await discountService.getDiscountsByEvent(
      eventId,
      req.user.id,
      req.user.role
    );

    res.status(200).json(discounts);
  } catch (error) {
    const errorMessages = {
      "Invalid event ID": 400,
      "One or more events not found": 404,
      "Unauthorized to manage discount codes for one or more events": 403,
    };

    const statusCode = errorMessages[error.message] || 500;
    res.status(statusCode).json({
      message:
        error.message ===
        "Unauthorized to manage discount codes for one or more events"
          ? "Unauthorized to view discount codes"
          : error.message,
      ...(statusCode === 500 && { error: error.message }),
    });
  }
});

// Update a discount code
exports.update = asyncHandler(async (req, res) => {
  const { discountId } = req.params;

  try {
    const updatedDiscount = await discountService.updateDiscount(
      discountId,
      req.body,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      message: "Discount code updated successfully",
      discount: updatedDiscount,
    });
  } catch (error) {
    const errorMessages = {
      "Discount code not found": 404,
      "Unauthorized to manage discount codes for one or more events": 403,
      "Invalid discount type. Must be 'percentage' or 'fixed'": 400,
      "Discount value must be greater than 0": 400,
      "Percentage discount cannot exceed 100%": 400,
      "Start date must be before end date": 400,
    };

    const statusCode = errorMessages[error.message] || 500;
    res.status(statusCode).json({
      message:
        error.message ===
        "Unauthorized to manage discount codes for one or more events"
          ? "Unauthorized to update discount codes"
          : error.message,
      ...(statusCode === 500 && { error: error.message }),
    });
  }
});

// Delete a discount code
exports.delete = asyncHandler(async (req, res) => {
  const { discountId } = req.params;

  try {
    await discountService.deleteDiscount(
      discountId,
      req.user.id,
      req.user.role
    );

    res.status(200).json({ message: "Discount code deleted successfully" });
  } catch (error) {
    const errorMessages = {
      "Discount code not found": 404,
      "Unauthorized to manage discount codes for one or more events": 403,
    };

    const statusCode = errorMessages[error.message] || 500;
    res.status(statusCode).json({
      message:
        error.message ===
        "Unauthorized to manage discount codes for one or more events"
          ? "Unauthorized to delete discount codes"
          : error.message,
      ...(statusCode === 500 && { error: error.message }),
    });
  }
});

// Validate a discount code for specific event and ticket details
exports.validateCodeForEvent = asyncHandler(async (req, res) => {
  const { eventId, code, ticketCount, ticketType } = req.body;

  try {
    const validationResult = await discountService.validateDiscountForEvent(
      eventId,
      code,
      ticketCount,
      ticketType
    );

    res.status(200).json(validationResult);
  } catch (error) {
    const errorMessages = {
      "Event not found": 404,
      "Invalid discount code": 404,
      "Discount code has expired": 400,
      "Discount code has reached maximum uses": 400,
      "Invalid ticket type": 400,
    };

    const statusCode = errorMessages[error.message] || 500;

    // Handle minimum ticket requirement errors
    if (
      error.message.includes("Minimum") &&
      error.message.includes("tickets required")
    ) {
      return res.status(400).json({ message: error.message });
    }

    res.status(statusCode).json({
      message: error.message,
      ...(statusCode === 500 && { error: error.message }),
    });
  }
});

// Validate a discount code (general validation)
exports.validateCode = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  try {
    const validationResult = await discountService.validateDiscountCode(
      code,
      subtotal
    );

    res.status(200).json(validationResult);
  } catch (error) {
    const errorMessages = {
      "Invalid discount code": 404,
      "Discount code has expired": 400,
      "Discount code has reached maximum uses": 400,
    };

    const statusCode = errorMessages[error.message] || 500;

    // Handle minimum purchase amount errors
    if (error.message.includes("Minimum purchase amount")) {
      return res.status(400).json({
        valid: false,
        message: error.message,
      });
    }

    // Return validation format for client-side handling
    if (statusCode <= 400) {
      return res.status(statusCode).json({
        valid: false,
        message: error.message,
      });
    }

    res.status(statusCode).json({
      valid: false,
      message: "Failed to validate discount code",
      error: error.message,
    });
  }
});

// Apply discount code (increment usage count)
exports.applyDiscount = asyncHandler(async (req, res) => {
  const { discountId } = req.body;

  try {
    const discount = await discountService.applyDiscountCode(discountId);

    res.status(200).json({
      message: "Discount applied successfully",
      discount: {
        id: discount._id,
        code: discount.code,
        usage_count: discount.usage_count,
        usage_limit: discount.usage_limit,
      },
    });
  } catch (error) {
    const statusCode = error.message === "Discount not found" ? 404 : 500;
    res.status(statusCode).json({
      message: error.message,
      ...(statusCode === 500 && { error: error.message }),
    });
  }
});

// Get discount usage statistics
exports.getStats = asyncHandler(async (req, res) => {
  const { discountId } = req.params;

  try {
    const stats = await discountService.getDiscountStats(
      discountId,
      req.user.id,
      req.user.role
    );

    res.status(200).json(stats);
  } catch (error) {
    const errorMessages = {
      "Discount code not found": 404,
      "Unauthorized to manage discount codes for one or more events": 403,
    };

    const statusCode = errorMessages[error.message] || 500;
    res.status(statusCode).json({
      message:
        error.message ===
        "Unauthorized to manage discount codes for one or more events"
          ? "Unauthorized to view discount statistics"
          : error.message,
      ...(statusCode === 500 && { error: error.message }),
    });
  }
});

module.exports = exports;
