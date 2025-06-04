const RefundRequestRepository = require("../../Repository/RefundRequestRepository");
const PaymentRepository = require("../../Repository/PaymentRepository");
const EventRepository = require("../../Repository/EventRepository");

/**
 * Get all refund requests
 * @returns {Promise<Array>} Array of refund requests
 */
const getAllRefundRequests = async () => {
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
};

/**
 * Approve a refund request
 * @param {string} refundId - The ID of the refund request
 * @param {string} note - Optional note for the approval
 * @returns {Promise<Object>} Updated refund request
 */
const approveRefundRequest = async (refundId, note = "") => {
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
};

/**
 * Reject a refund request
 * @param {string} refundId - The ID of the refund request
 * @param {string} note - Optional note for the rejection
 * @returns {Promise<Object>} Updated refund request
 */
const rejectRefundRequest = async (refundId, note = "") => {
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
};

/**
 * Get transactions with filtering options
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Array of transactions
 */
const getTransactions = async (filters = {}) => {
  try {
    const { startDate, endDate, payment_method, status } = filters;
    const filter = {};

    if (payment_method) {
      filter.payment_method = payment_method;
    }

    if (status) {
      filter.payment_status = status;
    }

    let transactions;

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
};

/**
 * Generate revenue report
 * @param {Object} dateRange - Date range for the report
 * @returns {Promise<Object>} Revenue report data
 */
const generateRevenueReport = async (dateRange = {}) => {
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
      reportData = await PaymentRepository.getRevenueByDateRange(
        new Date(0),
        new Date(),
        "month"
      );
    }

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
};

/**
 * Get popular events based on payment data
 * @param {number} limit - Number of events to return
 * @returns {Promise<Array>} Array of popular events
 */
const getPopularEvents = async (limit = 5) => {
  try {
    const completedPayments = await PaymentRepository.findCompleted({
      populate: {
        event: "title description date location price event_status",
      },
    });

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
};

/**
 * Get financial dashboard summary
 * @returns {Promise<Object>} Dashboard summary data
 */
const getDashboardSummary = async () => {
  try {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const currentMonthPayments = await PaymentRepository.findByDateRange(
      thisMonth,
      today,
      {}
    );
    const currentMonthCompleted = currentMonthPayments.filter(
      (p) => p.payment_status === "completed"
    );

    const lastMonthPayments = await PaymentRepository.findByDateRange(
      lastMonth,
      thisMonth,
      {}
    );
    const lastMonthCompleted = lastMonthPayments.filter(
      (p) => p.payment_status === "completed"
    );

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

    const pendingRefunds = await RefundRequestRepository.count({
      status: "pending",
    });

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
};

module.exports = {
  getAllRefundRequests,
  approveRefundRequest,
  rejectRefundRequest,
  getTransactions,
  generateRevenueReport,
  getPopularEvents,
  getDashboardSummary,
};
