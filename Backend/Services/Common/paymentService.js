const PaymentRepository = require("../../Repository/PaymentRepository");
const OrderRepository = require("../../Repository/OrderRepository");
const TicketRepository = require("../../Repository/TicketRepository");
const EventRepository = require("../../Repository/EventRepository");
const PDFDocument = require("pdfkit");
const axios = require("axios");

// Configuration
const getPayPalConfig = () => {
  const config = {
    PAYPAL_CLIENT_ID: process.env.VITE_PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.VITE_PAYPAL_CLIENT_SECRET,
    PAYPAL_API_BASE:
      process.env.NODE_ENV === "production"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com",
  };

  // Debug: Log configuration (remove in production)
  console.log("PayPal Config Check:", {
    clientIdExists: !!config.PAYPAL_CLIENT_ID,
    clientSecretExists: !!config.PAYPAL_CLIENT_SECRET,
    apiBase: config.PAYPAL_API_BASE,
    nodeEnv: process.env.NODE_ENV,
  });

  // Validate required environment variables
  if (!config.PAYPAL_CLIENT_ID || !config.PAYPAL_CLIENT_SECRET) {
    throw new Error("Missing PayPal credentials in environment variables");
  }

  return config;
};

/**
 * Get PayPal access token for API authentication
 * @returns {Promise<string>} Access token
 * @throws {Error} If authentication fails
 */
const getPayPalAccessToken = async () => {
  try {
    const config = getPayPalConfig();
    const auth = Buffer.from(
      `${config.PAYPAL_CLIENT_ID}:${config.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    console.log("Requesting PayPal access token..."); // Debug log

    const response = await axios({
      method: "post",
      url: `${config.PAYPAL_API_BASE}/v1/oauth2/token`,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: "grant_type=client_credentials",
      timeout: 10000, // 10 second timeout
    });

    console.log("PayPal access token obtained successfully"); // Debug log
    return response.data.access_token;
  } catch (error) {
    console.error("PayPal Access Token Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
      },
    });
    throw new Error(
      `Failed to authenticate with PayPal: ${
        error.response?.data?.error_description || error.message
      }`
    );
  }
};


/**
 * Update ticket availability in Event collection
 * @param {Array} tickets - Array of ticket objects
 * @throws {Error} If update fails
 */
const updateTicketAvailability = async (tickets) => {
  try {
    // Group tickets by event and ticket type
    const ticketGroups = {};

    for (const ticket of tickets) {
      const key = `${ticket.event_id}-${ticket.ticket_type}`;

      if (!ticketGroups[key]) {
        ticketGroups[key] = {
          eventId: ticket.event_id,
          ticketType: ticket.ticket_type,
          quantity: 0,
        };
      }

      ticketGroups[key].quantity += ticket.quantity;
    }

    // Update each event's ticket type availability using repository
    for (const key in ticketGroups) {
      const { eventId, ticketType, quantity } = ticketGroups[key];
      await EventRepository.updateTicketTypeAvailability(
        eventId,
        ticketType,
        quantity
      );
    }
  } catch (error) {
    throw new Error("Failed to update ticket availability");
  }
};

/**
 * Validate order ownership and existence
 * @param {string} orderId - Order ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Order object with populated tickets
 * @throws {Error} If order not found or unauthorized
 */
const validateOrderOwnership = async (orderId, userId) => {
  const order = await OrderRepository.findByIdWithPopulatedTickets(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.user_id.toString() !== userId.toString()) {
    throw new Error("Not authorized to access this order");
  }

  return order;
};

/**
 * Create PayPal order
 * @param {string} orderId - Internal order ID
 * @param {number} amount - Payment amount
 * @param {string} userId - User ID
 * @param {string} returnUrl - Success return URL
 * @param {string} cancelUrl - Cancel return URL
 * @returns {Promise<Object>} PayPal order response
 */
const createPayPalOrder = async (
  orderId,
  amount,
  userId,
  returnUrl,
  cancelUrl
) => {
  console.log("Creating PayPal order with params:", {
    orderId,
    amount,
    userId,
    returnUrl,
    cancelUrl,
  });

  try {
    // Validate order ownership
    const order = await validateOrderOwnership(orderId, userId);
    console.log("Order validation successful:", {
      orderId: order._id,
      totalAmount: order.total_amount,
      ticketCount: order.tickets?.length,
    });

    // Use provided amount or fall back to order amount
    const paymentAmount = amount || order.total_amount;

    if (!paymentAmount || paymentAmount <= 0) {
      throw new Error("Invalid order amount");
    }

    console.log("Payment amount determined:", paymentAmount);

    const config = getPayPalConfig();
    const accessToken = await getPayPalAccessToken();

    const eventTitle = order.tickets[0]?.event_id?.title || "Unknown Event";

    const paypalOrderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderId,
          description: `Event tickets for ${eventTitle}`,
          amount: {
            currency_code: "USD",
            value: paymentAmount.toFixed(2), // Ensure 2 decimal places
          },
        },
      ],
      application_context: {
        brand_name: "EventLanka",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    };

    console.log(
      "Sending PayPal order request:",
      JSON.stringify(paypalOrderData, null, 2)
    );

    const response = await axios({
      method: "post",
      url: `${config.PAYPAL_API_BASE}/v2/checkout/orders`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: paypalOrderData,
      timeout: 15000, // 15 second timeout
    });

    console.log("PayPal order created successfully:", {
      id: response.data.id,
      status: response.data.status,
      linksCount: response.data.links?.length,
    });

    return {
      orderId: order._id,
      paypalOrderId: response.data.id,
      clientSecret: response.data.id,
      links: response.data.links,
    };
  } catch (error) {
    console.error("Create PayPal Order Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      orderId,
      amount,
      userId,
    });

    // More specific error messages
    if (error.response?.status === 400) {
      throw new Error(
        `PayPal API validation error: ${JSON.stringify(error.response.data)}`
      );
    } else if (error.response?.status === 401) {
      throw new Error("PayPal authentication failed - check your credentials");
    } else if (error.response?.status >= 500) {
      throw new Error("PayPal service temporarily unavailable");
    } else {
      throw new Error(
        `Error creating PayPal order: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }
};

/**
 * Update order after successful payment
 * @param {Object} order - Order object
 * @param {string} transactionId - Transaction ID
 * @param {string} paymentMethod - Payment method
 * @param {string} paypalOrderId - PayPal order ID (optional)
 */
const updateOrderAfterPayment = async (
  order,
  transactionId,
  paymentMethod,
  paypalOrderId = null
) => {
  const paymentData = {
    payment_status: "paid",
    status: "completed",
    paymentMethod: paymentMethod,
    payment_details: {
      transaction_id: transactionId,
      provider: paymentMethod === "paypal" ? "PayPal" : "Other",
      paypal_order_id: paypalOrderId,
    },
  };

  await OrderRepository.updatePaymentDetails(order._id, paymentData);
};

/**
 * Update tickets after successful payment
 * @param {Array} ticketIds - Array of ticket IDs
 */
const updateTicketsAfterPayment = async (ticketIds) => {
  await TicketRepository.updatePaymentStatusByIds(ticketIds, "paid");
};

/**
 * Update discount usage count
 * @param {string} discountId - Discount ID
 */
const updateDiscountUsage = async (discountId) => {
  try {
    // This would need a DiscountRepository if you have one
    const Discount = require("../models/Discount");
    await Discount.findByIdAndUpdate(discountId, {
      $inc: { usage_count: 1 },
    });
  } catch (error) {
    // Silently handle if Discount model doesn't exist
    console.log("No discount model or error updating discount", error);
  }
};

/**
 * Capture PayPal payment
 * @param {string} orderId - Internal order ID
 * @param {string} paypalOrderId - PayPal order ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Payment and order data
 */
const capturePayPalPayment = async (orderId, paypalOrderId, userId) => {
  // Validate order ownership
  const order = await validateOrderOwnership(orderId, userId);

  try {
    const config = getPayPalConfig();
    const accessToken = await getPayPalAccessToken();

    // Capture the approved PayPal order
    const response = await axios({
      method: "post",
      url: `${config.PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const captureData = response.data;

    // Verify payment completion
    if (captureData.status !== "COMPLETED") {
      throw new Error(
        `Payment was not completed successfully. Status: ${captureData.status}`
      );
    }

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    // Create payment record using repository
    const payment = await PaymentRepository.create({
      user_id: userId,
      event_id: order.tickets[0].event_id,
      amount: order.total_amount,
      payment_method: "paypal",
      payment_status: "completed",
      transaction_id: transactionId,
      payment_details: {
        paypal_order_id: paypalOrderId,
        paypal_payer_id: captureData.payer?.payer_id || "unknown",
        paypal_status: captureData.status,
      },
    });

    // Update order
    await updateOrderAfterPayment(
      order,
      transactionId,
      "paypal",
      paypalOrderId
    );

    // Update tickets
    await updateTicketsAfterPayment(order.tickets);

    // Update ticket availability
    await updateTicketAvailability(order.tickets);

    // Update discount usage if applicable
    if (order.discount_id) {
      await updateDiscountUsage(order.discount_id);
    }

    return {
      payment,
      order,
      paypalOrderId,
    };
  } catch (error) {
    throw new Error(
      `Error capturing PayPal payment: ${error.response?.data || error.message}`
    );
  }
};

/**
 * Process legacy payment (for backward compatibility)
 * @param {Object} paymentData - Payment information
 * @returns {Promise<Object>} Payment and order data
 */
const processLegacyPayment = async (paymentData) => {
  const {
    orderId,
    amount,
    paymentMethod,
    paypalOrderId,
    paypalPayerId,
    userId,
  } = paymentData;

  // Validate order ownership
  const order = await validateOrderOwnership(orderId, userId);

  if (!order.tickets || order.tickets.length === 0) {
    throw new Error("Order has no tickets");
  }

  // Generate transaction ID
  const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Create payment record using repository
  const payment = await PaymentRepository.create({
    user_id: userId,
    event_id: order.tickets[0].event_id,
    amount: amount,
    payment_method: paymentMethod,
    payment_status: "completed",
    transaction_id: transactionId,
    payment_details:
      paymentMethod === "paypal"
        ? {
            paypal_order_id: paypalOrderId,
            paypal_payer_id: paypalPayerId || "unknown",
          }
        : {},
  });

  // Update order
  await updateOrderAfterPayment(
    order,
    transactionId,
    paymentMethod,
    paypalOrderId
  );

  // Update tickets
  await updateTicketsAfterPayment(order.tickets);

  // Update ticket availability
  await updateTicketAvailability(order.tickets);

  // Update discount usage if applicable
  if (order.discount_id) {
    await updateDiscountUsage(order.discount_id);
  }

  return {
    payment,
    order,
  };
};

/**
 * Confirm payment status
 * @param {string} paypalOrderId - PayPal order ID
 * @param {string} orderId - Internal order ID
 * @returns {Promise<Object>} Order and payment data
 */
const confirmPayment = async (paypalOrderId, orderId) => {
  const order = await OrderRepository.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  const payment = await PaymentRepository.findByPayPalOrderId(paypalOrderId);

  if (!payment) {
    throw new Error("Payment record not found");
  }

  return {
    order,
    payment,
  };
};

/**
 * Get payment history for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of payment records
 */
const getPaymentHistory = async (userId) => {
  return await PaymentRepository.findByUserId(userId, {
    populate: {
      event: "title date location",
    },
    sort: { createdAt: -1 },
  });
};

/**
 * Check payment status
 * @param {string} paymentIntentId - Payment intent ID
 * @param {string} orderId - Order ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Payment status data
 */
const checkPaymentStatus = async (paymentIntentId, orderId, userId) => {
  try {
    // Validate order ownership first
    const order = await validateOrderOwnership(orderId, userId);

    // Try multiple ways to find the payment record using repository methods
    let payment = null;

    // Method 1: Search by PayPal order ID
    payment = await PaymentRepository.findByPayPalOrderIdWithEvent(
      paymentIntentId
    );

    // Method 2: If not found, search by transaction ID pattern
    if (!payment) {
      payment = await PaymentRepository.findByTransactionIdWithEvent(
        paymentIntentId
      );
    }

    // Method 3: If still not found, search by user and event
    if (!payment && order) {
      payment = await PaymentRepository.findUserRecentCompletedPayment(
        userId,
        order.tickets[0]?.event_id
      );
    }

    if (!payment) {
      return {
        success: false,
        message: "Payment record not found",
        payment: null,
      };
    }

    // Verify payment belongs to the user
    if (payment.user_id.toString() !== userId.toString()) {
      throw new Error("Not authorized to access this payment");
    }

    return {
      success: true,
      status: payment.payment_status,
      payment: payment,
      message: "Payment found successfully",
    };
  } catch (error) {
    console.error("Error in checkPaymentStatus:", error);
    throw new Error(`Failed to check payment status: ${error.message}`);
  }
};

/**
 * Generate payment receipt PDF
 * @param {string} transactionId - Transaction ID
 * @param {Object} user - User object
 * @returns {Promise<Object>} Payment and ticket data for PDF generation
 */
const getReceiptData = async (transactionId, user) => {
  // Find payment by transaction ID using repository
  const payment = await PaymentRepository.findByTransactionIdWithPopulatedEvent(
    transactionId
  );

  if (!payment) {
    throw new Error("Payment not found");
  }

  // Check payment ownership
  if (payment.user_id.toString() !== user._id.toString()) {
    throw new Error("Not authorized to access this receipt");
  }

  // Fetch related tickets using repository
  const tickets = await TicketRepository.findPaidByUserAndEvent(
    user._id,
    payment.event_id._id
  );

  // Calculate ticket details
  let totalQuantity = 0;
  let pricePerTicket = 0;

  if (tickets.length > 0) {
    totalQuantity = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    pricePerTicket = totalQuantity > 0 ? payment.amount / totalQuantity : 0;
  }

  return {
    payment,
    tickets,
    totalQuantity,
    pricePerTicket,
    user,
  };
};

/**
 * Generate PDF receipt document
 * @param {Object} receiptData - Receipt data from getReceiptData
 * @returns {PDFDocument} PDF document instance
 */
const generateReceiptPDF = (receiptData) => {
  const { payment, totalQuantity, pricePerTicket, user } = receiptData;

  // Create a PDF document with better page setup
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

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

  // Add receipt ID on the right corner
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
    .text(`${payment.transaction_id}`, doc.page.width - 120, 50, {
      align: "left",
      width: 100,
    });

  // Add date and time
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

  // Event details box
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
    .text(`Name: ${user.name || user.username || "Customer"}`, 50, currentY);

  currentY += 15;
  doc
    .fillColor(secondaryColor)
    .fontSize(11)
    .font("Helvetica")
    .text(`Email: ${user.email || "N/A"}`, 50, currentY);

  // Payment information
  doc
    .fillColor(primaryColor)
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("Payment Information", 300, currentY - 40);

  let displayPaymentMethod = "N/A";
  if (payment.payment_method) {
    displayPaymentMethod =
      payment.payment_method === "paypal"
        ? "PayPal"
        : payment.payment_method.charAt(0).toUpperCase() +
          payment.payment_method.slice(1);
  }

  doc
    .fillColor(secondaryColor)
    .fontSize(11)
    .font("Helvetica")
    .text(`Method: ${displayPaymentMethod}`, 300, currentY - 15);

  let displayStatus = "N/A";
  if (payment.status) {
    displayStatus =
      payment.status.charAt(0).toUpperCase() + payment.status.slice(1);
  } else if (payment.payment_status) {
    displayStatus =
      payment.payment_status.charAt(0).toUpperCase() +
      payment.payment_status.slice(1);
  }

  doc
    .fillColor(secondaryColor)
    .fontSize(11)
    .font("Helvetica")
    .text(`Status: ${displayStatus}`, 300, currentY);

  // Draw horizontal line
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

  // Table content
  doc
    .fillColor(textColor)
    .fontSize(11)
    .font("Helvetica")
    .text("Event Tickets", 60, currentY + 7, { width: 180 });

  doc
    .fillColor(textColor)
    .fontSize(11)
    .font("Helvetica")
    .text(`${totalQuantity}`, 270, currentY + 7, {
      align: "right",
      width: 30,
    });

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

  return doc;
};

// Export all functions as a module
module.exports = {
  getPayPalAccessToken,
  updateTicketAvailability,
  validateOrderOwnership,
  createPayPalOrder,
  capturePayPalPayment,
  processLegacyPayment,
  updateOrderAfterPayment,
  updateTicketsAfterPayment,
  updateDiscountUsage,
  confirmPayment,
  getPaymentHistory,
  checkPaymentStatus,
  getReceiptData,
  generateReceiptPDF,
};
