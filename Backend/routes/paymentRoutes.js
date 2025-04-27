const express = require("express");
const paymentController = require("../controllers/Common/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware to authenticate users
router.use(protect);

// Payment routes
router.post("/process", paymentController.processPayment);
router.get("/history", paymentController.getPaymentHistory);

router.post("/create-paypal-order", paymentController.createPayPalOrder);
router.post(
  "/capture-paypal-order",
  paymentController.capturePayPalOrder
);

module.exports = router;
