const salesService = require("../../Services/Organizer/salesService");
const asyncHandler = require("express-async-handler");

// Get sales data for a specific event
exports.getSalesByEvent = asyncHandler(async (req, res) => {
  try {
    const { eventId } = req.params;
    const salesData = await salesService.getSalesByEvent(
      eventId,
      req.user.id,
      req.user.role
    );

    res.status(200).json(salesData);
  } catch (error) {
    if (error.message === "Event not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Unauthorized to view sales data") {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// Get sales data within a time frame
exports.getSalesByPeriod = asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const salesData = await salesService.getSalesByPeriod(
      startDate,
      endDate,
      req.user.id,
      req.user.role
    );

    res.status(200).json(salesData);
  } catch (error) {
    if (error.message === "Unauthorized to view sales data") {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// Get analytics data
exports.getAnalytics = asyncHandler(async (req, res) => {
  try {
    const analyticsData = await salesService.getAnalytics(
      req.user.id,
      req.user.role
    );

    res.status(200).json(analyticsData);
  } catch (error) {
    if (error.message === "Unauthorized to view analytics") {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = exports;
