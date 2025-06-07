// paymentController.js (Updated to use PaymentService)
const PaymentService = require("../../Services/Common/paymentService");
const asyncHandler = require("express-async-handler");


// ===========================
// CREATE PAYPAL ORDER
// ===========================
exports.createPayPalOrder = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;

  // Ensure the user is authenticated
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to process payment." });
  }

  try {
    const origin =
      req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173"; // Fallback for dev
    const returnUrl = `${origin}/payment-success`;
    const cancelUrl = `${origin}/checkout?orderId=${orderId}`;


    const result = await PaymentService.createPayPalOrder(
      orderId,
      amount,
      req.user._id,
      returnUrl,
      cancelUrl
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error creating PayPal order",
      error: error.message,
    });
  }
});

// ===========================
// CAPTURE PAYPAL PAYMENT
// ===========================
exports.capturePayPalOrder = asyncHandler(async (req, res) => {
  const { orderId, paypalOrderId } = req.body;

  // Ensure the user is authenticated
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to process payment." });
  }

  try {
    const result = await PaymentService.capturePayPalPayment(
      orderId,
      paypalOrderId,
      req.user._id
    );

    res.status(200).json({
      message: "Payment captured successfully",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error capturing PayPal payment",
      error: error.message,
    });
  }
});

// ===========================
// PROCESS PAYMENT (Legacy method for compatibility)
// ===========================
exports.processPayment = asyncHandler(async (req, res) => {
  const { orderId, amount, paymentMethod, paypalOrderId, paypalPayerId } =
    req.body;

  // Ensure the user is authenticated
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to process payment." });
  }

  try {
    const paymentData = {
      orderId,
      amount,
      paymentMethod,
      paypalOrderId,
      paypalPayerId,
      userId: req.user._id,
    };

    const result = await PaymentService.processLegacyPayment(paymentData);

    res.status(200).json({
      message: "Payment processed successfully",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error processing payment",
      error: error.message,
    });
  }
});

// ===========================
// CONFIRM PAYMENT
// ===========================
exports.confirmPayment = asyncHandler(async (req, res) => {
  const { paypalOrderId, orderId } = req.body;

  try {
    const result = await PaymentService.confirmPayment(paypalOrderId, orderId);

    res.status(200).json({
      message: "Payment confirmed successfully",
      ...result,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
});

// ===========================
// GET PAYMENT HISTORY (For Logged-in User)
// ===========================
exports.getPaymentHistory = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to view payment history." });
  }

  try {
    const payments = await PaymentService.getPaymentHistory(req.user._id);
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching payment history",
      error: error.message,
    });
  }
});

// ===========================
// CHECK PAYMENT STATUS
// ===========================
exports.checkPaymentStatus = asyncHandler(async (req, res) => {
  const { paymentIntentId } = req.params;
  const { orderId } = req.query;

  // Ensure the user is authenticated
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to check payment status." });
  }

  try {
    const result = await PaymentService.checkPaymentStatus(
      paymentIntentId,
      orderId,
      req.user._id
    );

    res.status(200).json({
      message: "Payment status retrieved successfully",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to check payment status",
      error: error.message,
    });
  }
});

// ===========================
// GENERATE RECEIPT
// ===========================
exports.generateReceipt = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;

  // Ensure the user is authenticated
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to download a receipt." });
  }

  try {
    // Set CORS headers explicitly for this endpoint
    res.header(
      "Access-Control-Allow-Origin",
      req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
      "Access-Control-Expose-Headers",
      "Content-Disposition, Content-Type, Content-Length"
    );

    // Get receipt data from service
    const receiptData = await PaymentService.getReceiptData(
      transactionId,
      req.user
    );

    // Generate PDF using service
    const doc = PaymentService.generateReceiptPDF(receiptData);

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt-${transactionId}.pdf`
    );
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // Handle any errors during PDF generation
    doc.on("error", (error) => {
      // console.error("PDF generation error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          message: "Error generating PDF",
          error: error.message,
        });
      }
    });

    // Pipe the PDF directly to the response
    doc.pipe(res);

    // Finalize the PDF
    doc.end();
  } catch (error) {
    // console.error("Receipt generation error:", error);

    // Make sure we haven't already sent headers
    if (!res.headersSent) {
      res.status(500).json({
        message: "Error generating receipt",
        error: error.message,
      });
    }
  }
});

module.exports = exports;
