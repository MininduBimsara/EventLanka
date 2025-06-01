// api/paymentApi.js
import axios from "axios";

// Base URL for payment API endpoints
const PAYMENT_API_URL = "http://localhost:5000/api/payments";

// Set default axios config
axios.defaults.withCredentials = true;

class PaymentAPI {
  /**
   * Create PayPal order for payment processing
   * @param {string} orderId - Order ID
   * @param {number} amount - Payment amount
   * @returns {Promise} API response
   */
  static async createPayPalOrder(orderId, amount) {
    const response = await axios.post(
      `${PAYMENT_API_URL}/create-paypal-order`,
      { orderId, amount }
    );
    return response.data;
  }

  /**
   * Capture PayPal order after user approval
   * @param {string} orderId - Order ID
   * @param {string} paypalOrderId - PayPal order ID
   * @returns {Promise} API response
   */
  static async capturePayPalOrder(orderId, paypalOrderId) {
    const response = await axios.post(
      `${PAYMENT_API_URL}/capture-paypal-order`,
      { orderId, paypalOrderId }
    );
    return response.data;
  }

  /**
   * Process payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise} API response
   */
  static async processPayment(paymentData) {
    const response = await axios.post(
      `${PAYMENT_API_URL}/process`,
      paymentData
    );
    return response.data;
  }

  /**
   * Confirm payment after processing
   * @param {string} paymentIntentId - Payment intent ID
   * @param {string} orderId - Order ID
   * @returns {Promise} API response
   */
  static async confirmPayment(paymentIntentId, orderId) {
    const response = await axios.post(`${PAYMENT_API_URL}/confirm`, {
      paypalOrderId: paymentIntentId,
      orderId,
    });
    return response.data;
  }

  /**
   * Fetch payment history for the user
   * @returns {Promise} API response
   */
  static async fetchPaymentHistory() {
    const response = await axios.get(`${PAYMENT_API_URL}/history`);
    return response.data;
  }

  /**
   * Download payment receipt
   * @param {string} transactionId - Transaction ID
   * @returns {Promise} Success indicator
   */
  static async downloadReceipt(transactionId) {
    // Use window.open approach for direct download
    window.open(`${PAYMENT_API_URL}/receipt/${transactionId}`, "_blank");
    return { success: true, transactionId };
  }

  /**
   * Check payment status
   * @param {string} paymentIntentId - Payment intent ID
   * @param {string} orderId - Order ID
   * @returns {Promise} API response
   */
  static async checkPaymentStatus(paymentIntentId, orderId) {
    const response = await axios.get(
      `${PAYMENT_API_URL}/status/${paymentIntentId}?orderId=${orderId}`,
      { timeout: 10000 } // 10 second timeout
    );
    return response.data;
  }
}

export default PaymentAPI;
