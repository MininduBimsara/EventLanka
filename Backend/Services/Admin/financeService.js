const RefundRequestRepository = require("../../Repository/RefundRequestRepository");
const PaymentRepository = require("../../Repository/PaymentRepository");
const EventRepository = require("../../Repository/EventRepository");

class FinanceService {
  /**
   * Get all refund requests
   * @returns {Promise<Array>} Array of refund requests
   */
  async getAllRefundRequests() {
    try {
      const refunds = await RefundRequestRepository.findAll(
        {},
        {
          populate: {
            user: "username email",
            event: "title date location",
            ticket: "ticket_type",
          },
        }
      );
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
      const refund = await RefundRequestRepository.updateStatus(
        refundId,
        "approved",
        note
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
      const refund = await RefundRequestRepository.updateStatus(
        refundId,
        "rejected",
        note
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

      // Payment method filtering
      if (payment_method) {
        filter.payment_method = payment_method;
      }

      // Status filtering
      if (status) {
        filter.payment_status = status;
      }

      let transactions;

      // Date range filtering
      if (startDate || endDate) {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        transactions = await PaymentRepository.findByDateRange(start, end, {
          populate: {
            user: "username email",
            event: "title description",
          },
          sort: { createdAt: -1 },
        });

        // Apply additional filters if date range was used
        if (Object.keys(filter).length > 0) {
          transactions = transactions.filter((transaction) => {
            let matches = true;
            if (
              filter.payment_method &&
              transaction.payment_method !== filter.payment_method
            ) {
              matches = false;
            }
            if (
              filter.payment_status &&
              transaction.payment_status !== filter.payment_status
            ) {
              matches = false;
            }
            return matches;
          });
        }
      } else {
        transactions = await PaymentRepository.findAll(filter, {
          populate: {
            user: "username email",
            event: "title description",
          },
          sort: { createdAt: -1 },
        });
      }

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
   * @returns {Promise<Object>} Revenue report data
   */
  async generateRevenueReport(dateRange = {}) {
    try {
      const { startDate, endDate } = dateRange;

      let reportData;
      if (startDate || endDate) {
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        reportData = await PaymentRepository.getRevenueByDateRange(
          start,
          end,
          "month"
        );
      } else {
        // Get all-time revenue data
        reportData = await PaymentRepository.getRevenueByDateRange(
          new Date(0),
          new Date(),
          "month"
        );
      }

      // Get summary statistics
      const summaryFilter = {};
      if (startDate || endDate) {
        const dateFilter = {};
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);
        summaryFilter.createdAt = dateFilter;
      }

      const summary = await PaymentRepository.getStatistics({
        ...summaryFilter,
        payment_status: "completed",
      });

      return {
        monthlyData: reportData.map((item) => ({
          month: `${item._id.year}-${String(item._id.period).padStart(2, "0")}`,
          totalRevenue: item.revenue,
          transactionCount: item.count,
          averageAmount: item.revenue / item.count,
        })),
        summary: {
          totalRevenue: summary.totalRevenue,
          totalTransactions: summary.completedPayments,
          averageTransaction: summary.averagePaymentAmount,
        },
      };
    } catch (error) {
      throw new Error(`Failed to generate revenue report: ${error.message}`);
    }
  }

  /**
   * Get popular events based on payment data
   * @param {number} limit - Number of events to return (default: 5)
   * @returns {Promise<Array>} Array of popular events
   */
  async getPopularEvents(limit = 5) {
    try {
      // Get all completed payments grouped by event
      const completedPayments = await PaymentRepository.findCompleted({
        populate: {
          event: "title description date location price event_status",
        },
      });

      // Group payments by event and calculate metrics
      const eventMetrics = {};
      completedPayments.forEach((payment) => {
        const eventId = payment.event_id._id.toString();
        if (!eventMetrics[eventId]) {
          eventMetrics[eventId] = {
            event: payment.event_id,
            paymentCount: 0,
            totalRevenue: 0,
          };
        }
        eventMetrics[eventId].paymentCount++;
        eventMetrics[eventId].totalRevenue += payment.amount;
      });

      // Convert to array and sort by payment count, then by revenue
      const popularEvents = Object.values(eventMetrics)
        .filter((metric) => metric.event.event_status === "approved")
        .sort((a, b) => {
          if (b.paymentCount !== a.paymentCount) {
            return b.paymentCount - a.paymentCount;
          }
          return b.totalRevenue - a.totalRevenue;
        })
        .slice(0, limit)
        .map((metric) => ({
          _id: metric.event._id,
          title: metric.event.title,
          description: metric.event.description,
          event_date: metric.event.date,
          location: metric.event.location,
          price: metric.event.price,
          paymentCount: metric.paymentCount,
          totalRevenue: metric.totalRevenue,
          event_status: metric.event.event_status,
        }));

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
      const currentMonthPayments = await PaymentRepository.findByDateRange(
        thisMonth,
        today,
        {}
      );
      const currentMonthCompleted = currentMonthPayments.filter(
        (p) => p.payment_status === "completed"
      );

      // Last month revenue for comparison
      const lastMonthPayments = await PaymentRepository.findByDateRange(
        lastMonth,
        thisMonth,
        {}
      );
      const lastMonthCompleted = lastMonthPayments.filter(
        (p) => p.payment_status === "completed"
      );

      // Calculate revenues
      const currentRevenue = currentMonthCompleted.reduce(
        (sum, p) => sum + p.amount,
        0
      );
      const lastRevenue = lastMonthCompleted.reduce(
        (sum, p) => sum + p.amount,
        0
      );

      const revenueGrowth =
        lastRevenue > 0
          ? ((currentRevenue - lastRevenue) / lastRevenue) * 100
          : 0;

      // Pending refund requests
      const pendingRefunds = await RefundRequestRepository.count({
        status: "pending",
      });

      // Active events
      const activeEvents = await EventRepository.count({
        event_status: "approved",
      });

      return {
        currentMonthRevenue: currentRevenue,
        currentMonthTransactions: currentMonthCompleted.length,
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
