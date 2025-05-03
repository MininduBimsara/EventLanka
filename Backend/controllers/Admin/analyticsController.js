const Payment = require("../../models/Payment");
const Event = require("../../models/Event");
const User = require("../../models/User");

exports.getAnalyticsData = async (req, res) => {
  try {
    // Get date range from query parameters or use default (last 12 months)
    const { startDate, endDate } = req.query;
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().setMonth(new Date().getMonth() - 12));
    const end = endDate ? new Date(endDate) : new Date();

    // Revenue data - monthly breakdown
    const revenueData = await Payment.aggregate([
      {
        $match: {
          payment_status: "completed", // FIXED: changed status to payment_status
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log("Raw Revenue Data:", revenueData);
    console.log("Formatted Revenue Data:", formattedRevenueData);

    // Transform to format needed by frontend
    const formattedRevenueData = revenueData.map((item) => {
      const date = new Date(item._id + "-01");
      return {
        month: date.toLocaleString("default", { month: "short" }),
        revenue: item.revenue,
      };
    });

    // Category data - events by category
    const categoryData = await Event.aggregate([
      { $match: { event_status: "approved" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const formattedCategoryData = categoryData.map((item) => ({
      name: item._id || "Uncategorized",
      value: item.count,
    }));

    console.log("Category Data:", categoryData);
    console.log("Formatted Category Data:", formattedCategoryData);

    // Best selling events
    const bestSellingEvents = await Payment.aggregate([
      { $match: { payment_status: "completed" } }, // FIXED: changed status to payment_status
      {
        $group: {
          _id: "$event_id", // FIXED: changed $event to $event_id
          sales: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 5 },
    ]);

    // Lookup event details
    const populatedEvents = await Promise.all(
      bestSellingEvents.map(async (event) => {
        const eventDetails = await Event.findById(event._id);
        return {
          id: event._id,
          name: eventDetails ? eventDetails.title : "Unknown Event",
          sales: event.sales,
          revenue: event.revenue,
        };
      })
    );

    console.log("Best Selling Events Raw:", bestSellingEvents);
    console.log("Best Selling Events Populated:", populatedEvents);

    // Top organizers
    const topOrganizers = await Event.aggregate([
      { $match: { event_status: "approved" } },
      {
        $group: {
          _id: "$organizer_id", // FIXED: changed $organizer to $organizer_id
          eventCount: { $sum: 1 },
        },
      },
      { $sort: { eventCount: -1 } },
      { $limit: 5 },
    ]);

    // Calculate revenue for each organizer
    const organizers = await Promise.all(
      topOrganizers.map(async (org) => {
        const user = await User.findById(org._id);

        // Get events by this organizer
        const events = await Event.find({ organizer_id: org._id }); // FIXED: changed organizer to organizer_id
        const eventIds = events.map((e) => e._id);

        // Calculate total revenue for these events
        const revenueData = await Payment.aggregate([
          {
            $match: {
              event_id: { $in: eventIds }, // FIXED: changed event to event_id
              payment_status: "completed", // FIXED: changed status to payment_status
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$amount" },
            },
          },
        ]);

        const totalRevenue = revenueData[0]?.totalRevenue || 0;

        return {
          id: org._id,
          name: user
            ? `${user.firstName} ${user.lastName}`
            : "Unknown Organizer",
          eventCount: org.eventCount,
          totalRevenue,
        };
      })
    );

    console.log("Top Organizers Raw:", topOrganizers);
    console.log("Top Organizers Processed:", organizers);

    // User growth data
    const userGrowthData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          users: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedUserGrowthData = userGrowthData.map((item) => {
      const date = new Date(item._id + "-01");
      return {
        month: date.toLocaleString("default", { month: "short" }),
        users: item.users,
      };
    });

    console.log("User Growth Raw:", userGrowthData);
    console.log("User Growth Formatted:", formattedUserGrowthData);

    // General platform statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      lastLogin: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    });

    console.log("Sample User:", await User.findOne());

    res.json({
      revenueData: formattedRevenueData,
      categoryData: formattedCategoryData,
      bestSellingEvents: populatedEvents,
      topOrganizers: organizers,
      userGrowthData: formattedUserGrowthData,
      statistics: {
        totalUsers,
        activeUsers,
        retentionRate: Math.round((activeUsers / totalUsers) * 100) || 0,
      },
    });
  } catch (err) {
    console.error("Analytics data error:", err);
    res.status(500).json({ error: "Server error in analytics data" });
  }
};
