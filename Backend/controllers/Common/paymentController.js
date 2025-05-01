// paymentController.js
const Payment = require("../../models/Payment");
const Order = require("../../models/Order");
const Ticket = require("../../models/Ticket");
const asyncHandler = require("express-async-handler");
const PDFDocument = require("pdfkit");
const axios = require("axios"); // Using axios for PayPal API calls

// PayPal Configuration
const PAYPAL_CLIENT_ID = process.env.VITE_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.VITE_PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

// Function to get PayPal access token
const getPayPalAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString("base64");
    const response = await axios({
      method: "post",
      url: `${PAYPAL_API_BASE}/v1/oauth2/token`,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: "grant_type=client_credentials",
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Error getting PayPal access token:", error);
    throw new Error("Failed to authenticate with PayPal");
  }
};

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

  // Find the order and populate the tickets to get the event_id
  const order = await Order.findById(orderId).populate("tickets");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Check if the order belongs to the user
  if (order.user_id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Use the amount from the request or fall back to order amount
  const paymentAmount = amount || order.total_amount;

  if (!paymentAmount || paymentAmount <= 0) {
    return res.status(400).json({ message: "Invalid order amount" });
  }

  try {
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Create PayPal order
    const response = await axios({
      method: "post",
      url: `${PAYPAL_API_BASE}/v2/checkout/orders`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: orderId,
            description: `Event tickets for ${order.tickets[0]?.event_id}`,
            amount: {
              currency_code: "USD", // Change to your currency
              value: paymentAmount.toString(),
            },
          },
        ],
        application_context: {
          brand_name: "EventLanka",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          return_url: `${req.headers.origin}/payment-success`,
          cancel_url: `${req.headers.origin}/checkout?orderId=${orderId}`,
        },
      },
    });

    // Return PayPal order ID to the client
    res.status(200).json({
      orderId: order._id,
      paypalOrderId: response.data.id,
      clientSecret: response.data.id, // Use the PayPal order ID as the client secret
      links: response.data.links,
    });
  } catch (error) {
    console.error(
      "Error creating PayPal order:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Error creating PayPal order",
      error: error.response?.data || error.message,
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

  // Find the order
  const order = await Order.findById(orderId).populate("tickets");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Check if the order belongs to the user
  if (order.user_id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  try {
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Capture the approved PayPal order
    const response = await axios({
      method: "post",
      url: `${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const captureData = response.data;

    // Verify the payment was completed successfully
    if (captureData.status !== "COMPLETED") {
      return res.status(400).json({
        message: "Payment was not completed successfully",
        paypalStatus: captureData.status,
      });
    }

    // Generate a transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    // Create a payment record
    const payment = await Payment.create({
      user_id: req.user._id,
      event_id: order.tickets[0].event_id,
      amount: order.total_amount,
      payment_method: "paypal",
      status: "completed",
      transaction_id: transactionId,
      payment_details: {
        paypal_order_id: paypalOrderId,
        paypal_payer_id: captureData.payer?.payer_id || "unknown",
        paypal_status: captureData.status,
      },
    });

    // Update the order status
    order.payment_status = "paid";
    order.status = "completed";
    order.paymentMethod = "paypal";
    order.payment_details = {
      transaction_id: transactionId,
      provider: "PayPal",
      paypal_order_id: paypalOrderId,
    };
    await order.save();

    // Update the tickets payment status
    await Ticket.updateMany(
      { _id: { $in: order.tickets } },
      { payment_status: "paid" }
    );

    // If there was a discount used, increment its usage count
    if (order.discount_id) {
      await Discount.findByIdAndUpdate(order.discount_id, {
        $inc: { usage_count: 1 },
      });
    }

    res.status(200).json({
      message: "Payment captured successfully",
      payment,
      order,
      paypalOrderId,
    });
  } catch (error) {
    console.error(
      "Error capturing PayPal payment:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Error capturing PayPal payment",
      error: error.response?.data || error.message,
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

  // Find the order and populate the tickets to get the event_id
  const order = await Order.findById(orderId).populate("tickets");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Check if the order belongs to the user
  if (order.user_id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Check if order has tickets
  if (!order.tickets || order.tickets.length === 0) {
    return res.status(400).json({ message: "Order has no tickets" });
  }

  // Generate a transaction ID
  const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Create a payment record
  const payment = await Payment.create({
    user_id: req.user._id,
    event_id: order.tickets[0].event_id,
    amount: amount,
    payment_method: paymentMethod,
    status: "completed",
    transaction_id: transactionId,
    payment_details:
      paymentMethod === "paypal"
        ? {
            paypal_order_id: paypalOrderId,
            paypal_payer_id: paypalPayerId || "unknown",
          }
        : {},
  });

  // Update the order status
  order.payment_status = "paid";
  order.status = "completed";
  order.paymentMethod = paymentMethod;
  order.payment_details = {
    transaction_id: transactionId,
    provider: paymentMethod === "paypal" ? "PayPal" : "Other",
    paypal_order_id: paypalOrderId || null,
  };
  await order.save();

  // Update the tickets payment status
  await Ticket.updateMany(
    { _id: { $in: order.tickets } },
    { payment_status: "paid" }
  );

  // If there was a discount used, increment its usage count
  if (order.discount_id) {
    try {
      await Discount.findByIdAndUpdate(order.discount_id, {
        $inc: { usage_count: 1 },
      });
    } catch (error) {
      console.log("No discount model or error updating discount", error);
    }
  }

  res.status(200).json({
    message: "Payment processed successfully",
    payment,
    order,
  });
});

// ===========================
// CONFIRM PAYMENT (This is still used by the front-end)
// ===========================

exports.confirmPayment = asyncHandler(async (req, res) => {
  const { paypalOrderId, orderId } = req.body;

  // Find the order
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Find the payment
  const payment = await Payment.findOne({
    "payment_details.paypal_order_id": paypalOrderId,
  });

  if (!payment) {
    return res.status(404).json({ message: "Payment record not found" });
  }

  // We've already processed the payment in the processPayment step,
  // So here we just return success
  res.status(200).json({
    message: "Payment confirmed successfully",
    order,
    payment,
  });
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

  const payments = await Payment.find({ user_id: req.user._id })
    .populate("event_id", "title date location")
    .sort({ createdAt: -1 });

  res.status(200).json(payments);
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
    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order belongs to the user
    if (order.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Find the payment record
    const payment = await Payment.findOne({
      "payment_details.payment_intent_id": paymentIntentId,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    // Return the payment status
    res.status(200).json({
      message: "Payment status retrieved successfully",
      status: payment.status,
      payment,
    });
  } catch (error) {
    console.error("Error checking payment status:", error.message);
    res.status(500).json({
      message: "Failed to check payment status",
      error: error.message,
    });
  }
});

// ===========================
// GENERATE RECEIPT
// ===========================
// Updated code for generateReceipt function
exports.generateReceipt = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;

  // Ensure the user is authenticated
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to download a receipt." });
  }

  // Find the payment by transaction ID
  const payment = await Payment.findOne({
    transaction_id: transactionId,
  }).populate("event_id", "title date location image_url");

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  // Check if the payment belongs to the user
  if (payment.user_id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Fetch related tickets
  const tickets = await Ticket.find({
    user_id: req.user._id,
    event_id: payment.event_id._id,
    payment_status: "paid",
  });

  // Calculate total quantity and price per ticket
  let totalQuantity = 0;
  let pricePerTicket = 0;

  if (tickets.length > 0) {
    totalQuantity = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    pricePerTicket = totalQuantity > 0 ? payment.amount / totalQuantity : 0;
  }

  // Create a PDF document with better page setup
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

  // Set response headers for PDF download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=receipt-${transactionId}.pdf`
  );

  // Pipe the PDF directly to the response
  doc.pipe(res);

  // Define colors
  const primaryColor = "#E65100"; // deep amber
  const secondaryColor = "#455A64"; // blue grey
  const lightGrey = "#ECEFF1";
  const textColor = "#263238";

  // Add a subtle background pattern
  doc.rect(0, 0, doc.page.width, doc.page.height).fill("#FAFAFA");

  // Create a header bar
  doc.rect(0, 0, doc.page.width, 120).fill(primaryColor);

  // Add company logo/name in white text
  doc
    .fillColor("#FFFFFF")
    .fontSize(32)
    .font("Helvetica-Bold")
    .text("EventLanka", 50, 50);

  // Add "RECEIPT" text
  doc
    .fillColor("#FFFFFF")
    .fontSize(16)
    .font("Helvetica")
    .text("OFFICIAL RECEIPT", 50, 85);

  // Add receipt ID on the right corner - adjust position and width
  doc
    .fillColor("#FFFFFF")
    .fontSize(12)
    .font("Helvetica")
    .text(`Receipt #:`, doc.page.width - 250, 50, {
      align: "right",
      width: 120,
    });

  doc
    .fillColor("#FFFFFF")
    .fontSize(12)
    .font("Helvetica")
    .text(`${transactionId}`, doc.page.width - 120, 50, {
      align: "left",
      width: 100,
    });

  // Add date on the right corner - adjust position and width
  doc
    .fillColor("#FFFFFF")
    .fontSize(10)
    .font("Helvetica")
    .text(
      `Date: ${new Date(payment.createdAt).toLocaleDateString()}`,
      doc.page.width - 250,
      65,
      { align: "right", width: 120 }
    );

  // Add time with better spacing
  doc
    .fillColor("#FFFFFF")
    .fontSize(10)
    .font("Helvetica")
    .text(
      `Time: ${new Date(payment.createdAt).toLocaleTimeString()}`,
      doc.page.width - 250,
      80,
      { align: "right", width: 120 }
    );

  // Main content starts below the header
  const startY = 150;
  let currentY = startY;

  // Event details in a nice box
  currentY += 10;
  doc
    .roundedRect(50, currentY, doc.page.width - 100, 100, 5)
    .fillAndStroke(lightGrey, "#E0E0E0");

  doc
    .fillColor(primaryColor)
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("Event Details", 70, currentY + 15);

  doc
    .fillColor(textColor)
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(`${payment.event_id?.title || "Event"}`, 70, currentY + 40);

  if (payment.event_id?.date) {
    doc
      .fillColor(secondaryColor)
      .fontSize(11)
      .font("Helvetica")
      .text(
        `Date: ${new Date(payment.event_id.date).toLocaleDateString()}`,
        70,
        currentY + 60
      );
  }

  if (payment.event_id?.location) {
    doc
      .fillColor(secondaryColor)
      .fontSize(11)
      .font("Helvetica")
      .text(`Location: ${payment.event_id.location}`, 70, currentY + 75);
  }

  // Customer information
  currentY += 120;
  doc
    .fillColor(primaryColor)
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("Customer Information", 50, currentY);

  currentY += 25;
  doc
    .fillColor(secondaryColor)
    .fontSize(11)
    .font("Helvetica")
    .text(
      `Name: ${req.user.name || req.user.username || "Customer"}`,
      50,
      currentY
    );

  currentY += 15;
  doc
    .fillColor(secondaryColor)
    .fontSize(11)
    .font("Helvetica")
    .text(`Email: ${req.user.email || "N/A"}`, 50, currentY);

  // Payment information on the right side
  doc
    .fillColor(primaryColor)
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("Payment Information", 300, currentY - 40);

  // FIXED: Added null/undefined check for payment method
  let displayPaymentMethod = "N/A";
  if (payment.payment_method) {
    displayPaymentMethod = payment.payment_method === "paypal" 
      ? "PayPal" 
      : payment.payment_method.charAt(0).toUpperCase() + payment.payment_method.slice(1);
  }

  doc
    .fillColor(secondaryColor)
    .fontSize(11)
    .font("Helvetica")
    .text(`Method: ${displayPaymentMethod}`, 300, currentY - 15);

  // FIXED: Added null/undefined check for payment status
  let displayStatus = "N/A";
  if (payment.status) {
    displayStatus = payment.status.charAt(0).toUpperCase() + payment.status.slice(1);
  } else if (payment.payment_status) {
    // Use payment_status field if status doesn't exist
    displayStatus = payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1);
  }

  doc
    .fillColor(secondaryColor)
    .fontSize(11)
    .font("Helvetica")
    .text(`Status: ${displayStatus}`, 300, currentY);

  // Draw a horizontal line
  currentY += 40;
  doc
    .strokeColor("#E0E0E0")
    .lineWidth(1)
    .moveTo(50, currentY)
    .lineTo(doc.page.width - 50, currentY)
    .stroke();

  // Order Details
  currentY += 30;
  doc
    .fillColor(primaryColor)
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("Order Details", 50, currentY);

  // Table header
  currentY += 25;
  const tableTop = currentY;

  // Draw table header background
  doc.rect(50, currentY, doc.page.width - 100, 20).fill(primaryColor);

  // Table header text
  doc
    .fillColor("#FFFFFF")
    .fontSize(11)
    .font("Helvetica-Bold")
    .text("Description", 60, currentY + 5)
    .text("Quantity", 250, currentY + 5)
    .text("Price", 350, currentY + 5)
    .text("Subtotal", 450, currentY + 5);

  currentY += 20;
  doc
    .rect(50, currentY, doc.page.width - 100, 25)
    .fillAndStroke(lightGrey, "#E0E0E0");

  // Description column
  doc
    .fillColor(textColor)
    .fontSize(11)
    .font("Helvetica")
    .text("Event Tickets", 60, currentY + 7, { width: 180 });

  // Quantity column - right aligned
  doc
    .fillColor(textColor)
    .fontSize(11)
    .font("Helvetica")
    .text(`${totalQuantity}`, 270, currentY + 7, { align: "right", width: 30 });

  // Price column - separate currency and amount
  doc
    .fillColor(textColor)
    .fontSize(11)
    .font("Helvetica")
    .text("LKR", 350, currentY + 7);

  doc
    .fillColor(textColor)
    .fontSize(11)
    .font("Helvetica")
    .text(
      pricePerTicket.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      }),
      400,
      currentY + 7,
      { align: "right", width: 40 }
    );

  // Subtotal column - separate currency and amount
  doc
    .fillColor(textColor)
    .fontSize(11)
    .font("Helvetica")
    .text("LKR", 450, currentY + 7);

  doc
    .fillColor(textColor)
    .fontSize(11)
    .font("Helvetica")
    .text(
      payment.amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      }),
      500,
      currentY + 7,
      { align: "right", width: 40 }
    );

  // Summary box
  currentY += 40;
  doc
    .roundedRect(doc.page.width - 200, currentY, 150, 70, 5)
    .fillAndStroke("#F5F5F5", "#E0E0E0");

  doc
    .fillColor(textColor)
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Payment Summary", doc.page.width - 180, currentY + 10);

  // Subtotal
  doc
    .fillColor(secondaryColor)
    .fontSize(10)
    .font("Helvetica")
    .text("Subtotal:", doc.page.width - 180, currentY + 30);

  // Currency and amount on separate text elements for better alignment
  doc
    .fillColor(textColor)
    .fontSize(10)
    .font("Helvetica")
    .text("LKR", doc.page.width - 90, currentY + 30);

  doc
    .fillColor(textColor)
    .fontSize(10)
    .font("Helvetica")
    .text(
      payment.amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      }),
      doc.page.width - 50,
      currentY + 30,
      { align: "right" }
    );

  // Total
  doc
    .fillColor(primaryColor)
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Total:", doc.page.width - 180, currentY + 50);

  // Currency and amount on separate text elements for better alignment
  doc
    .fillColor(primaryColor)
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("LKR", doc.page.width - 90, currentY + 50);

  doc
    .fillColor(primaryColor)
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(
      payment.amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      }),
      doc.page.width - 50,
      currentY + 50,
      { align: "right" }
    );

  // Footer
  const footerY = doc.page.height - 80;

  // Add a footer bar
  doc.rect(0, footerY, doc.page.width, 80).fill(primaryColor);

  doc
    .fillColor("#FFFFFF")
    .fontSize(11)
    .font("Helvetica")
    .text("Thank you for your purchase!", doc.page.width / 2, footerY + 20, {
      align: "center",
    });

  doc
    .fillColor("#FFFFFF")
    .fontSize(10)
    .font("Helvetica")
    .text(
      "For any queries, please contact support@eventlanka.com",
      doc.page.width / 2,
      footerY + 40,
      { align: "center" }
    );

  doc
    .fillColor("#FFFFFF")
    .fontSize(8)
    .font("Helvetica")
    .text(
      `Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
      doc.page.width / 2,
      footerY + 60,
      { align: "center" }
    );

  // Finalize the PDF
  doc.end();
});

module.exports = exports;
