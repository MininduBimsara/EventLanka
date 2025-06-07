// api/paymentApi.js
import axios from "axios";

// Base URL for payment API endpoints
const PAYMENT_API_URL = `${import.meta.env.VITE_API_URL}/api/payments`;

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
    try {
      console.log("Making request to create PayPal order:", {
        orderId,
        amount,
      });

      const response = await axios.post(
        `${PAYMENT_API_URL}/create-paypal-order`,
        { orderId, amount },
        {
          timeout: 30000, // 30 second timeout
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("PayPal order creation successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("PayPal API Error Details:");
      console.error("- Status:", error.response?.status);
      console.error("- Data:", error.response?.data);
      console.error("- Headers:", error.response?.headers);
      console.error("- Request config:", error.config);

      // Re-throw the error with more context
      throw error;
    }
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
    // Method 1: Try blob download
    try {
      console.log("Attempting blob download for receipt:", transactionId);

      const response = await axios.get(
        `${PAYMENT_API_URL}/receipt/${transactionId}`,
        {
          responseType: "blob",
          timeout: 15000,
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt_${transactionId}.pdf`);
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => window.URL.revokeObjectURL(url), 100);

      console.log("Blob download successful");
      return { success: true, transactionId, method: "blob" };
    } catch (blobError) {
      console.warn("Blob download failed, trying fallback:", blobError.message);

      // Method 2: Fallback to window.open
      try {
        const downloadUrl = `${PAYMENT_API_URL}/receipt/${transactionId}`;
        const newWindow = window.open(downloadUrl, "_blank");

        if (
          !newWindow ||
          newWindow.closed ||
          typeof newWindow.closed == "undefined"
        ) {
          throw new Error("Popup blocked");
        }

        console.log("Window.open download successful");
        return { success: true, transactionId, method: "window" };
      } catch (windowError) {
        console.warn(
          "Window.open failed, trying iframe method:",
          windowError.message
        );

        // Method 3: Hidden iframe method
        try {
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = `${PAYMENT_API_URL}/receipt/${transactionId}`;

          document.body.appendChild(iframe);

          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 5000);

          console.log("Iframe download initiated");
          return { success: true, transactionId, method: "iframe" };
        } catch (iframeError) {
          console.error("All download methods failed:", iframeError);
          throw new Error(
            "All download methods failed. Please contact support or try a different browser."
          );
        }
      }
    }
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
