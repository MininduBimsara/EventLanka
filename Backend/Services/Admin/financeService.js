const RefundRequest = require("../../models/RefundRequest");
const Payment = require("../../models/Payment");
const Event = require("../../models/Event");

class FinanceService {
  /**
   * Get all refund requests
   * @returns {Promise<Array>} Array of refund requests
   */
  async getAllRefundRequests() {
    try {
      const refunds = await RefundRequest.find();
      return refunds;
    } catch (error) {
      throw new Error(`Failed to fetch refund requests: ${error.message}`);
    }
  }

  /**
   * Approve a refund request
   * @param {string} refundId - The ID of the refund request
   * @param {string} note - Optional note for the approval
   * @returns {Promise<Object>} Updated refund request
   */
  async approveRefundRequest(refundId, note = "") {
    try {
      const refund = await RefundRequest.findByIdAndUpdate(
        refundId,
        {
          status: "approved",
          note: note,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!refund) {
        throw new Error("Refund request not found");
      }

      return refund;
    } catch (error) {
      throw new Error(`Failed to approve refund request: ${error.message}`);
    }
  }

  /**
   * Reject a refund request
   * @param {string} refundId - The ID of the refund request
   * @param {string} note - Optional note for the rejection
   * @returns {Promise<Object>} Updated refund request
   */
  async rejectRefundRequest(refundId, note = "") {
    try {
      const refund = await RefundRequest.findByIdAndUpdate(
        refundId,
        {
          status: "rejected",
          note: note,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!refund) {
        throw new Error("Refund request not found");
      }

      return refund;
    } catch (error) {
      throw new Error(`Failed to reject refund request: ${error.message}`);
    }
  }

  /**
   * Get transactions with filtering options
   * @param {Object} filters - Filter options
   * @param {string} filters.startDate - Start date for filtering
   * @param {string} filters.endDate - End date for filtering
   * @param {string} filters.payment_method - Payment method filter
   * @param {string} filters.status - Status filter
   * @returns {Promise<Array>} Array of transactions
   */
  async getTransactions(filters = {}) {
    try {
      const { startDate, endDate, payment_method, status } = filters;
      const filter = {};

      // Date range filtering
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }

      // Payment method filtering
      if (payment_method) {
        filter.payment_method = payment_method;
      }

      // Status filtering
      if (status) {
        filter.status = status;
      }

      const transactions = await Payment.find(filter)
        .populate("user_id", "username email")
        .populate("event_id", "title description")
        .sort({ createdAt: -1 }); // Sort by newest first

      return transactions;
    } catch (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  }

  /**
   * Generate revenue report
   * @param {Object} dateRange - Date range for the report
   * @param {string} dateRange.startDate - Start date
   * @param {string} dateRange.endDate - End date
   * @returns {Promise<Array>} Revenue report data
   */
  async generateRevenueReport(dateRange = {}) {
    try {
      const { startDate, endDate } = dateRange;
      const match = { status: "completed" };

      // Apply date filtering if provided
      if (startDate || endDate) {
        match.createdAt = {};
        if (startDate) match.createdAt.$gte = new Date(startDate);
        if (endDate) match.createdAt.$lte = new Date(endDate);
      }

      const report = await Payment.aggregate([
        { $match: match },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            totalRevenue: { $sum: "$amount" },
            transactionCount: { $sum: 1 },
            averageAmount: { $avg: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Calculate total summary
      const totalSummary = await Payment.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
            totalTransactions: { $sum: 1 },
            averageTransaction: { $avg: "$amount" },
          },
        },
      ]);

      return {
        monthlyData: report,
        summary: totalSummary[0] || {
          totalRevenue: 0,
          totalTransactions: 0,
          averageTransaction: 0,
        },
      };
    } catch (error) {
      throw new Error(`Failed to generate revenue report: ${error.message}`);
    }
  }

  /**
   * Get popular events based on various criteria
   * @param {number} limit - Number of events to return (default: 5)
   * @returns {Promise<Array>} Array of popular events
   */
  async getPopularEvents(limit = 5) {
    try {
      // Get events with payment counts
      const popularEvents = await Event.aggregate([
        { $match: { event_status: "approved" } },
        {
          $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "event_id",
            as: "payments",
          },
        },
        {
          $addFields: {
            paymentCount: { $size: "$payments" },
            totalRevenue: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$payments",
                      cond: { $eq: ["$$this.status", "completed"] },
                    },
                  },
                  as: "payment",
                  in: "$$payment.amount",
                },
              },
            },
          },
        },
        {
          $sort: { paymentCount: -1, totalRevenue: -1 },
        },
        {
          $limit: limit,
        },
        {
          $project: {
            title: 1,
            description: 1,
            event_date: 1,
            location: 1,
            price: 1,
            paymentCount: 1,
            totalRevenue: 1,
            event_status: 1,
          },
        },
      ]);

      return popularEvents;
    } catch (error) {
      throw new Error(`Failed to fetch popular events: ${error.message}`);
    }
  }

  /**
   * Get financial dashboard summary
   * @returns {Promise<Object>} Dashboard summary data
   */
  async getDashboardSummary() {
    try {
      const today = new Date();
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

      // Current month revenue
      const currentMonthRevenue = await Payment.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: thisMonth },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]);

      // Last month revenue for comparison
      const lastMonthRevenue = await Payment.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: {
              $gte: lastMonth,
              $lt: thisMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]);

      // Pending refund requests
      const pendingRefunds = await RefundRequest.countDocuments({
        status: "pending",
      });

      // Active events
      const activeEvents = await Event.countDocuments({
        event_status: "approved",
      });

      const currentRevenue = currentMonthRevenue[0]?.total || 0;
      const lastRevenue = lastMonthRevenue[0]?.total || 0;
      const revenueGrowth =
        lastRevenue > 0
          ? ((currentRevenue - lastRevenue) / lastRevenue) * 100
          : 0;

      return {
        currentMonthRevenue: currentRevenue,
        currentMonthTransactions: currentMonthRevenue[0]?.count || 0,
        revenueGrowthPercentage: Math.round(revenueGrowth * 100) / 100,
        pendingRefunds,
        activeEvents,
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard summary: ${error.message}`);
    }
  }
}

module.exports = new FinanceService();
