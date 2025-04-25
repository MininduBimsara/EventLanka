const RefundRequest = require("../../models/RefundRequest");
const Payment = require("../../models/Payment");
const Event = require("../../models/Event");

exports.listRefundRequests = async (req, res) => {
  try {
    const refunds = await RefundRequest.find();
    res.json(refunds);
  } catch (err) {
    res.status(500).json({ error: "Error fetching refund requests" });
  }
};

exports.approveRefundRequest = async (req, res) => {
  try {
    const refund = await RefundRequest.findByIdAndUpdate(
      req.params.id,
      { status: "approved", note: req.body.note },
      { new: true }
    );
    if (!refund) return res.status(404).json({ error: "Refund not found" });
    res.json({ message: "Approved", refund });
  } catch (err) {
    res.status(500).json({ error: "Error approving refund" });
  }
};

exports.rejectRefundRequest = async (req, res) => {
  try {
    const refund = await RefundRequest.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", note: req.body.note },
      { new: true }
    );
    if (!refund) return res.status(404).json({ error: "Refund not found" });
    res.json({ message: "Rejected", refund });
  } catch (err) {
    res.status(500).json({ error: "Error rejecting refund" });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, payment_method, status } = req.query;
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (payment_method) filter.payment_method = payment_method;
    if (status) filter.status = status;

    const transactions = await Payment.find(filter)
      .populate("user_id", "username") // Populate user_id with the user's name
      .populate("event_id", "title"); // Populate event_id with the event's name

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
};

exports.getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = { status: "completed" };
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
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: "Error generating report" });
  }
};

exports.getPopularEvents = async (req, res) => {
  try {
    const events = await Event.find({ event_status: "approved" }).limit(5);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Error fetching popular events" });
  }
};
