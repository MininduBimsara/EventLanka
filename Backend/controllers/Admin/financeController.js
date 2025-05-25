const financeService = require("../../Services/Admin/financeService");

class FinanceController {
  /**
   * List all refund requests
   */
  async listRefundRequests(req, res) {
    try {
      const refunds = await financeService.getAllRefundRequests();
      res.status(200).json({
        success: true,
        data: refunds,
        message: "Refund requests fetched successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || "Error fetching refund requests",
      });
    }
  }

  /**
   * Approve a refund request
   */
  async approveRefundRequest(req, res) {
    try {
      const { id } = req.params;
      const { note } = req.body;

      const refund = await financeService.approveRefundRequest(id, note);

      res.status(200).json({
        success: true,
        data: refund,
        message: "Refund request approved successfully",
      });
    } catch (error) {
      const statusCode = error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || "Error approving refund request",
      });
    }
  }

  /**
   * Reject a refund request
   */
  async rejectRefundRequest(req, res) {
    try {
      const { id } = req.params;
      const { note } = req.body;

      const refund = await financeService.rejectRefundRequest(id, note);

      res.status(200).json({
        success: true,
        data: refund,
        message: "Refund request rejected successfully",
      });
    } catch (error) {
      const statusCode = error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || "Error rejecting refund request",
      });
    }
  }

  /**
   * Get transactions with filtering
   */
  async getTransactions(req, res) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        payment_method: req.query.payment_method,
        status: req.query.status,
      };

      const transactions = await financeService.getTransactions(filters);

      res.status(200).json({
        success: true,
        data: transactions,
        count: transactions.length,
        message: "Transactions fetched successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || "Error fetching transactions",
      });
    }
  }

  /**
   * Generate revenue report
   */
  async getRevenueReport(req, res) {
    try {
      const dateRange = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      };

      const report = await financeService.generateRevenueReport(dateRange);

      res.status(200).json({
        success: true,
        data: report,
        message: "Revenue report generated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || "Error generating revenue report",
      });
    }
  }

  /**
   * Get popular events
   */
  async getPopularEvents(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const events = await financeService.getPopularEvents(limit);

      res.status(200).json({
        success: true,
        data: events,
        count: events.length,
        message: "Popular events fetched successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || "Error fetching popular events",
      });
    }
  }

  /**
   * Get dashboard summary (bonus endpoint)
   */
  async getDashboardSummary(req, res) {
    try {
      const summary = await financeService.getDashboardSummary();

      res.status(200).json({
        success: true,
        data: summary,
        message: "Dashboard summary fetched successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || "Error fetching dashboard summary",
      });
    }
  }
}

module.exports = new FinanceController();
