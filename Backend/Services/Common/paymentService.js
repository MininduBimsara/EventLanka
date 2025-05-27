// services/PaymentService.js
const Payment = require("../../models/Payment");
const Order = require("../../models/Order");
const Ticket = require("../../models/Ticket");
const Event = require("../../models/Event");
const PDFDocument = require("pdfkit");
const axios = require("axios");

class PaymentService {
  constructor() {
    this.PAYPAL_CLIENT_ID = process.env.VITE_PAYPAL_CLIENT_ID;
    this.PAYPAL_CLIENT_SECRET = process.env.VITE_PAYPAL_CLIENT_SECRET;
    this.PAYPAL_API_BASE =
      process.env.NODE_ENV === "production"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";
  }

  /**
   * Get PayPal access token for API authentication
   * @returns {Promise<string>} Access token
   * @throws {Error} If authentication fails
   */
  async getPayPalAccessToken() {
    try {
      const auth = Buffer.from(
        `${this.PAYPAL_CLIENT_ID}:${this.PAYPAL_CLIENT_SECRET}`
      ).toString("base64");

      const response = await axios({
        method: "post",
        url: `${this.PAYPAL_API_BASE}/v1/oauth2/token`,
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: "grant_type=client_credentials",
      });

      return response.data.access_token;
    } catch (error) {
      throw new Error("Failed to authenticate with PayPal");
    }
  }

  /**
   * Update ticket availability in Event collection
   * @param {Array} tickets - Array of ticket objects
   * @throws {Error} If update fails
   */
  async updateTicketAvailability(tickets) {
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

      // Update each event's ticket type availability
      for (const key in ticketGroups) {
        const { eventId, ticketType, quantity } = ticketGroups[key];

        await Event.findOneAndUpdate(
          {
            _id: eventId,
            "ticket_types.type": ticketType,
          },
          {
            $inc: { "ticket_types.$.availability": -quantity },
          }
        );
      }
    } catch (error) {
      throw new Error("Failed to update ticket availability");
    }
  }

  /**
   * Validate order ownership and existence
   * @param {string} orderId - Order ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Order object with populated tickets
   * @throws {Error} If order not found or unauthorized
   */
  async validateOrderOwnership(orderId, userId) {
    const order = await Order.findById(orderId).populate("tickets");

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.user_id.toString() !== userId.toString()) {
      throw new Error("Not authorized to access this order");
    }

    return order;
  }

  /**
   * Create PayPal order
   * @param {string} orderId - Internal order ID
   * @param {number} amount - Payment amount
   * @param {string} userId - User ID
   * @param {string} returnUrl - Success return URL
   * @param {string} cancelUrl - Cancel return URL
   * @returns {Promise<Object>} PayPal order response
   */
  async createPayPalOrder(orderId, amount, userId, returnUrl, cancelUrl) {
    // Validate order ownership
    const order = await this.validateOrderOwnership(orderId, userId);

    // Use provided amount or fall back to order amount
    const paymentAmount = amount || order.total_amount;

    if (!paymentAmount || paymentAmount <= 0) {
      throw new Error("Invalid order amount");
    }

    try {
      const accessToken = await this.getPayPalAccessToken();

      const response = await axios({
        method: "post",
        url: `${this.PAYPAL_API_BASE}/v2/checkout/orders`,
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
                currency_code: "USD",
                value: paymentAmount.toString(),
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
        },
      });

      return {
        orderId: order._id,
        paypalOrderId: response.data.id,
        clientSecret: response.data.id,
        links: response.data.links,
      };
    } catch (error) {
      throw new Error(
        `Error creating PayPal order: ${error.response?.data || error.message}`
      );
    }
  }

  /**
   * Capture PayPal payment
   * @param {string} orderId - Internal order ID
   * @param {string} paypalOrderId - PayPal order ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Payment and order data
   */
  async capturePayPalPayment(orderId, paypalOrderId, userId) {
    // Validate order ownership
    const order = await this.validateOrderOwnership(orderId, userId);

    try {
      const accessToken = await this.getPayPalAccessToken();

      // Capture the approved PayPal order
      const response = await axios({
        method: "post",
        url: `${this.PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`,
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

      // Create payment record
      const payment = await Payment.create({
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
      await this.updateOrderAfterPayment(
        order,
        transactionId,
        "paypal",
        paypalOrderId
      );

      // Update tickets
      await this.updateTicketsAfterPayment(order.tickets);

      // Update ticket availability
      await this.updateTicketAvailability(order.tickets);

      // Update discount usage if applicable
      if (order.discount_id) {
        await this.updateDiscountUsage(order.discount_id);
      }

      return {
        payment,
        order,
        paypalOrderId,
      };
    } catch (error) {
      throw new Error(
        `Error capturing PayPal payment: ${
          error.response?.data || error.message
        }`
      );
    }
  }

  /**
   * Process legacy payment (for backward compatibility)
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Payment and order data
   */
  async processLegacyPayment(paymentData) {
    const {
      orderId,
      amount,
      paymentMethod,
      paypalOrderId,
      paypalPayerId,
      userId,
    } = paymentData;

    // Validate order ownership
    const order = await this.validateOrderOwnership(orderId, userId);

    if (!order.tickets || order.tickets.length === 0) {
      throw new Error("Order has no tickets");
    }

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    // Create payment record
    const payment = await Payment.create({
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
    await this.updateOrderAfterPayment(
      order,
      transactionId,
      paymentMethod,
      paypalOrderId
    );

    // Update tickets
    await this.updateTicketsAfterPayment(order.tickets);

    // Update ticket availability
    await this.updateTicketAvailability(order.tickets);

    // Update discount usage if applicable
    if (order.discount_id) {
      await this.updateDiscountUsage(order.discount_id);
    }

    return {
      payment,
      order,
    };
  }

  /**
   * Update order after successful payment
   * @param {Object} order - Order object
   * @param {string} transactionId - Transaction ID
   * @param {string} paymentMethod - Payment method
   * @param {string} paypalOrderId - PayPal order ID (optional)
   */
  async updateOrderAfterPayment(
    order,
    transactionId,
    paymentMethod,
    paypalOrderId = null
  ) {
    order.payment_status = "paid";
    order.status = "completed";
    order.paymentMethod = paymentMethod;
    order.payment_details = {
      transaction_id: transactionId,
      provider: paymentMethod === "paypal" ? "PayPal" : "Other",
      paypal_order_id: paypalOrderId,
    };
    await order.save();
  }

  /**
   * Update tickets after successful payment
   * @param {Array} ticketIds - Array of ticket IDs
   */
  async updateTicketsAfterPayment(ticketIds) {
    await Ticket.updateMany(
      { _id: { $in: ticketIds } },
      { payment_status: "paid" }
    );
  }

  /**
   * Update discount usage count
   * @param {string} discountId - Discount ID
   */
  async updateDiscountUsage(discountId) {
    try {
      const Discount = require("../models/Discount");
      await Discount.findByIdAndUpdate(discountId, {
        $inc: { usage_count: 1 },
      });
    } catch (error) {
      // Silently handle if Discount model doesn't exist
      console.log("No discount model or error updating discount", error);
    }
  }

  /**
   * Confirm payment status
   * @param {string} paypalOrderId - PayPal order ID
   * @param {string} orderId - Internal order ID
   * @returns {Promise<Object>} Order and payment data
   */
  async confirmPayment(paypalOrderId, orderId) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const payment = await Payment.findOne({
      "payment_details.paypal_order_id": paypalOrderId,
    });

    if (!payment) {
      throw new Error("Payment record not found");
    }

    return {
      order,
      payment,
    };
  }

  /**
   * Get payment history for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of payment records
   */
  async getPaymentHistory(userId) {
    return await Payment.find({ user_id: userId })
      .populate("event_id", "title date location")
      .sort({ createdAt: -1 });
  }

  /**
   * Check payment status
   * @param {string} paymentIntentId - Payment intent ID
   * @param {string} orderId - Order ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Payment status data
   */
  async checkPaymentStatus(paymentIntentId, orderId, userId) {
    // Validate order ownership
    const order = await this.validateOrderOwnership(orderId, userId);

    // Find payment record
    const payment = await Payment.findOne({
      "payment_details.payment_intent_id": paymentIntentId,
    });

    if (!payment) {
      throw new Error("Payment record not found");
    }

    return {
      status: payment.status,
      payment,
    };
  }

  /**
   * Generate payment receipt PDF
   * @param {string} transactionId - Transaction ID
   * @param {Object} user - User object
   * @returns {Promise<Object>} Payment and ticket data for PDF generation
   */
  async getReceiptData(transactionId, user) {
    // Find payment by transaction ID
    const payment = await Payment.findOne({
      transaction_id: transactionId,
    }).populate("event_id", "title date location image_url");

    if (!payment) {
      throw new Error("Payment not found");
    }

    // Check payment ownership
    if (payment.user_id.toString() !== user._id.toString()) {
      throw new Error("Not authorized to access this receipt");
    }

    // Fetch related tickets
    const tickets = await Ticket.find({
      user_id: user._id,
      event_id: payment.event_id._id,
      payment_status: "paid",
    });

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
  }

  /**
   * Generate PDF receipt document
   * @param {Object} receiptData - Receipt data from getReceiptData
   * @returns {PDFDocument} PDF document instance
   */
  generateReceiptPDF(receiptData) {
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
  }
}

module.exports = new PaymentService();
