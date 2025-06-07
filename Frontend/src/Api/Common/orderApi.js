// api/orderApi.js
import axios from "axios";

// Base URL for orders API endpoints
const ORDERS_API_URL = `${import.meta.env.VITE_API_URL}/api/orders`;

// Set default axios config
axios.defaults.withCredentials = true;

class OrderAPI {
  /**
   * Create a new order
   * @param {Object} orderData - Order creation data
   * @returns {Promise} API response
   */
  static async createOrder(orderData) {
    const response = await axios.post(ORDERS_API_URL, orderData);
    return response.data;
  }

  /**
   * Fetch all orders for the user
   * @returns {Promise} API response
   */
  static async fetchOrders() {
    const response = await axios.get(ORDERS_API_URL);
    return response.data;
  }

  /**
   * Fetch a specific order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise} API response
   */
  static async fetchOrderById(orderId) {
    const response = await axios.get(`${ORDERS_API_URL}/${orderId}`);
    return response.data;
  }

  /**
   * Cancel an order
   * @param {string} orderId - Order ID
   * @returns {Promise} API response
   */
  static async cancelOrder(orderId) {
    const response = await axios.put(`${ORDERS_API_URL}/${orderId}/cancel`);
    return response.data;
  }

  /**
   * Update an existing order
   * @param {string} orderId - Order ID
   * @param {Object} orderData - Updated order data
   * @returns {Promise} API response
   */
  static async updateOrder(orderId, orderData) {
    const response = await axios.put(`${ORDERS_API_URL}/${orderId}`, orderData);
    return response.data;
  }

  /**
   * Delete an order
   * @param {string} orderId - Order ID
   * @returns {Promise} Order ID of deleted order
   */
  static async deleteOrder(orderId) {
    await axios.delete(`${ORDERS_API_URL}/${orderId}`);
    return orderId; // Return the ID for state management
  }

  /**
   * Get order statistics
   * @returns {Promise} API response with order statistics
   */
  static async getOrderStats() {
    const response = await axios.get(`${ORDERS_API_URL}/stats`);
    return response.data;
  }

  /**
   * Get orders by status
   * @param {string} status - Order status
   * @returns {Promise} API response
   */
  static async getOrdersByStatus(status) {
    const response = await axios.get(`${ORDERS_API_URL}/status/${status}`);
    return response.data;
  }

  /**
   * Get order summary
   * @param {string} orderId - Order ID
   * @returns {Promise} API response with order summary
   */
  static async getOrderSummary(orderId) {
    const response = await axios.get(`${ORDERS_API_URL}/${orderId}/summary`);
    return response.data;
  }

  /**
   * Apply discount to order
   * @param {string} orderId - Order ID
   * @param {string} discountCode - Discount code
   * @returns {Promise} API response
   */
  static async applyDiscount(orderId, discountCode) {
    const response = await axios.post(`${ORDERS_API_URL}/${orderId}/discount`, {
      discountCode,
    });
    return response.data;
  }

  /**
   * Get order history with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} API response
   */
  static async getOrderHistory(page = 1, limit = 10) {
    const response = await axios.get(
      `${ORDERS_API_URL}/history?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  /**
   * Export orders to PDF/CSV
   * @param {string} format - Export format ('pdf' or 'csv')
   * @param {Array} orderIds - Array of order IDs to export (optional)
   * @returns {Promise} Success indicator
   */
  static async exportOrders(format = "pdf", orderIds = []) {
    const params = orderIds.length > 0 ? `?ids=${orderIds.join(",")}` : "";
    window.open(`${ORDERS_API_URL}/export/${format}${params}`, "_blank");
    return { success: true, format };
  }
}

export default OrderAPI;
