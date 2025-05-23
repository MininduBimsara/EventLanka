const analyticsService = require("../../Services/Admin/analyticsService");

/**
 * Get comprehensive analytics data
 */
exports.getAnalyticsData = async (req, res) => {
  try {
    console.log("Analytics API called with params:", req.query);

    // Extract date range from query parameters
    const { startDate, endDate } = req.query;
    const dateRange = { startDate, endDate };

    // Get analytics data from service
    const analyticsData = await analyticsService.getAnalyticsData(dateRange);

    console.log("Sending analytics response...");
    res.json(analyticsData);
  } catch (err) {
    console.error("Analytics data error:", err);
    res.status(500).json({
      error: "Server error in analytics data",
      message: err.message,
    });
  }
};

/**
 * Get revenue analytics for specific periods
 */
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const revenueData = await analyticsService.getRevenueBuckets(period);

    res.json({
      success: true,
      data: revenueData,
      period,
    });
  } catch (err) {
    console.error("Revenue analytics error:", err);
    res.status(500).json({
      error: "Server error in revenue analytics",
      message: err.message,
    });
  }
};

/**
 * Get category distribution analytics
 */
exports.getCategoryAnalytics = async (req, res) => {
  try {
    const categoryData = await analyticsService.getCategoryData();

    res.json({
      success: true,
      data: categoryData,
    });
  } catch (err) {
    console.error("Category analytics error:", err);
    res.status(500).json({
      error: "Server error in category analytics",
      message: err.message,
    });
  }
};

/**
 * Get top performers (events and organizers)
 */
exports.getTopPerformers = async (req, res) => {
  try {
    const [bestSellingEvents, topOrganizers] = await Promise.all([
      analyticsService.getBestSellingEvents(),
      analyticsService.getTopOrganizers(),
    ]);

    res.json({
      success: true,
      data: {
        bestSellingEvents,
        topOrganizers,
      },
    });
  } catch (err) {
    console.error("Top performers analytics error:", err);
    res.status(500).json({
      error: "Server error in top performers analytics",
      message: err.message,
    });
  }
};

/**
 * Get user growth analytics
 */
exports.getUserGrowthAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Set default date range if not provided
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    const end = endDate ? new Date(endDate) : new Date();

    const userGrowthData = await analyticsService.getUserGrowthData(start, end);

    res.json({
      success: true,
      data: userGrowthData,
      dateRange: { startDate: start, endDate: end },
    });
  } catch (err) {
    console.error("User growth analytics error:", err);
    res.status(500).json({
      error: "Server error in user growth analytics",
      message: err.message,
    });
  }
};

/**
 * Get platform statistics
 */
exports.getPlatformStatistics = async (req, res) => {
  try {
    const statistics = await analyticsService.getPlatformStatistics();

    res.json({
      success: true,
      data: statistics,
    });
  } catch (err) {
    console.error("Platform statistics error:", err);
    res.status(500).json({
      error: "Server error in platform statistics",
      message: err.message,
    });
  }
};

/**
 * Get revenue data with date range
 */
exports.getRevenueData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Set default date range if not provided
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    const end = endDate ? new Date(endDate) : new Date();

    const revenueData = await analyticsService.getRevenueData(start, end);

    res.json({
      success: true,
      data: revenueData,
      dateRange: { startDate: start, endDate: end },
    });
  } catch (err) {
    console.error("Revenue data error:", err);
    res.status(500).json({
      error: "Server error in revenue data",
      message: err.message,
    });
  }
};

/**
 * Get analytics summary for dashboard
 */
exports.getAnalyticsSummary = async (req, res) => {
  try {
    const { period = "month" } = req.query;

    // Get key metrics in parallel
    const [statistics, revenueData, categoryData] = await Promise.all([
      analyticsService.getPlatformStatistics(),
      analyticsService.getRevenueBuckets(period),
      analyticsService.getCategoryData(),
    ]);

    // Calculate summary metrics
    const totalRevenue = revenueData.reduce(
      (sum, item) => sum + item.revenue,
      0
    );
    const totalTransactions = revenueData.reduce(
      (sum, item) => sum + item.transactions,
      0
    );
    const averageTransactionValue =
      totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    res.json({
      success: true,
      data: {
        platformStats: statistics,
        revenueMetrics: {
          totalRevenue,
          totalTransactions,
          averageTransactionValue:
            Math.round(averageTransactionValue * 100) / 100,
        },
        topCategories: categoryData.slice(0, 3),
        period,
      },
    });
  } catch (err) {
    console.error("Analytics summary error:", err);
    res.status(500).json({
      error: "Server error in analytics summary",
      message: err.message,
    });
  }
};

/**
 * Get analytics for a specific date range with custom filters
 */
exports.getCustomAnalytics = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      includeRevenue = true,
      includeUsers = true,
      includeEvents = true,
      includeOrganizers = true,
    } = req.query;

    const dateRange = { startDate, endDate };
    const customData = {};

    // Build response based on requested data
    const promises = [];

    if (includeRevenue === "true") {
      promises.push(
        analyticsService
          .getRevenueData(
            startDate
              ? new Date(startDate)
              : new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
            endDate ? new Date(endDate) : new Date()
          )
          .then((data) => {
            customData.revenueData = data;
          })
      );
    }

    if (includeUsers === "true") {
      promises.push(
        analyticsService
          .getUserGrowthData(
            startDate
              ? new Date(startDate)
              : new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
            endDate ? new Date(endDate) : new Date()
          )
          .then((data) => {
            customData.userGrowthData = data;
          })
      );
    }

    if (includeEvents === "true") {
      promises.push(
        Promise.all([
          analyticsService.getCategoryData(),
          analyticsService.getBestSellingEvents(),
        ]).then(([categoryData, bestSellingEvents]) => {
          customData.categoryData = categoryData;
          customData.bestSellingEvents = bestSellingEvents;
        })
      );
    }

    if (includeOrganizers === "true") {
      promises.push(
        analyticsService.getTopOrganizers().then((data) => {
          customData.topOrganizers = data;
        })
      );
    }

    // Always include platform statistics
    promises.push(
      analyticsService.getPlatformStatistics().then((data) => {
        customData.statistics = data;
      })
    );

    await Promise.all(promises);

    res.json({
      success: true,
      data: customData,
      dateRange,
      filters: {
        includeRevenue,
        includeUsers,
        includeEvents,
        includeOrganizers,
      },
    });
  } catch (err) {
    console.error("Custom analytics error:", err);
    res.status(500).json({
      error: "Server error in custom analytics",
      message: err.message,
    });
  }
};
