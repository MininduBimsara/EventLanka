const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Controllers (grouped)
const adminController = require("../controllers/Admin/adminController");
const eventsController = require("../controllers/Common/eventController");
const usersController = require("../controllers/Common/userController");
const financeController = require("../controllers/Admin/financeController");
const analyticsController = require("../controllers/Admin/analyticsController");

/* 📊 Admin Dashboard & Settings */
router.get("/dashboard", protect, adminOnly, adminController.getDashboardStats);
router.get("/settings", protect, adminOnly, adminController.getSettings);
router.put("/settings", protect, adminOnly, adminController.updateSettings);
router.put(
  "/settings/change-password",
  protect,
  adminOnly,
  adminController.changeAdminPassword
);

/* 📊 Analytics & Reports */
router.get(
  "/analytics",
  protect,
  adminOnly,
  analyticsController.getAnalyticsData
);

/* 👤 Admin Profile - Add debug logging */
router.get(
  "/profile",
  (req, res, next) => {
    console.log("🔍 Profile GET route reached, applying middleware...");
    next();
  },
  protect,
  adminOnly,
  (req, res, next) => {
    console.log("🔍 Profile GET: All middleware passed, calling controller...");
    next();
  },
  adminController.getAdminProfile
);

router.put(
  "/profile",
  (req, res, next) => {
    console.log("🔍 Profile PUT route reached, applying middleware...");
    next();
  },
  protect,
  adminOnly,
  (req, res, next) => {
    console.log("🔍 Profile PUT: All middleware passed, calling controller...");
    next();
  },
  adminController.updateAdminProfile
);

/* 📅 Event Approvals */
router.get(
  "/event-approvals",
  protect,
  adminOnly,
  eventsController.listPendingEvents
);
router.get(
  "/event-approvals/:id",
  protect,
  adminOnly,
  eventsController.getEventById
);
router.put(
  "/event-approvals/:id/approve",
  protect,
  adminOnly,
  eventsController.approveEvent
);
router.put(
  "/event-approvals/:id/reject",
  protect,
  adminOnly,
  eventsController.rejectEvent
);

/* 👥 Users & Organizers */
router.get("/users", protect, adminOnly, usersController.getUsers);
router.get("/users/:id", protect, adminOnly, usersController.getUserProfile);
router.put(
  "/users/:id/status",
  protect,
  adminOnly,
  usersController.updateUserStatus
);
router.get(
  "/non-admin-users",
  protect,
  adminOnly,
  usersController.getAllNonAdminUsers
);

router.get("/organizers", protect, adminOnly, usersController.getOrganizers);
router.get(
  "/organizers/:id",
  protect,
  adminOnly,
  usersController.getOrganizerProfile
);
router.put(
  "/organizers/:id/status",
  protect,
  adminOnly,
  usersController.updateOrganizerStatus
);
router.get(
  "/organizers/:id/events",
  protect,
  adminOnly,
  usersController.getOrganizerEvents
);

/* 💸 Refund Requests */
router.get(
  "/refund-requests",
  protect,
  adminOnly,
  financeController.listRefundRequests
);
router.put(
  "/refund-requests/:id/approve",
  protect,
  adminOnly,
  financeController.approveRefundRequest
);
router.put(
  "/refund-requests/:id/reject",
  protect,
  adminOnly,
  financeController.rejectRefundRequest
);

/* 💰 Transactions & Reports */
router.get(
  "/transactions",
  protect,
  adminOnly,
  financeController.getTransactions
);
router.get(
  "/reports/revenue",
  protect,
  adminOnly,
  financeController.getRevenueReport
);
router.get(
  "/reports/popular-events",
  protect,
  adminOnly,
  financeController.getPopularEvents
);


module.exports = router;
