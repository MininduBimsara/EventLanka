// api/ticketApi.js
import axios from "axios";

// Base URL for tickets API endpoints
const TICKETS_API_URL = "http://localhost:5000/api/tickets";

// Set default axios config
axios.defaults.withCredentials = true;

class TicketAPI {
  /**
   * Buy a new ticket
   * @param {Object} ticketData - Ticket purchase data
   * @returns {Promise} API response
   */
  static async buyTicket(ticketData) {
    const response = await axios.post(TICKETS_API_URL, ticketData);
    return response.data;
  }

  /**
   * Fetch all tickets for the logged-in user
   * @returns {Promise} API response
   */
  static async fetchTickets() {
    const response = await axios.get(TICKETS_API_URL);
    return response.data;
  }

  /**
   * Fetch a specific ticket by ID
   * @param {string} ticketId - Ticket ID
   * @returns {Promise} API response
   */
  static async fetchTicketById(ticketId) {
    const response = await axios.get(`${TICKETS_API_URL}/${ticketId}`);
    return response.data;
  }

  /**
   * Cancel/delete a ticket
   * @param {string} ticketId - Ticket ID
   * @returns {Promise} Ticket ID of cancelled ticket
   */
  static async cancelTicket(ticketId) {
    await axios.delete(`${TICKETS_API_URL}/${ticketId}`);
    return ticketId; // Return the ID for state management
  }

  /**
   * Generate QR code for a ticket
   * @param {string} ticketId - Ticket ID
   * @returns {Promise} API response with QR code
   */
  static async generateTicketQRCode(ticketId) {
    const response = await axios.get(`${TICKETS_API_URL}/${ticketId}/qrcode`);
    return response.data;
  }

  /**
   * Download ticket as PDF
   * @param {string} ticketId - Ticket ID
   * @returns {Promise} Success indicator
   */
  static async downloadTicketPDF(ticketId) {
    // Use window.open approach for direct download
    window.open(`${TICKETS_API_URL}/${ticketId}/download/pdf`, "_blank");
    return { ticketId, success: true };
  }

  /**
   * Update ticket information
   * @param {string} ticketId - Ticket ID
   * @param {Object} updateData - Data to update
   * @returns {Promise} API response
   */
  static async updateTicket(ticketId, updateData) {
    const response = await axios.put(
      `${TICKETS_API_URL}/${ticketId}`,
      updateData
    );
    return response.data;
  }

  /**
   * Get ticket statistics
   * @returns {Promise} API response with ticket statistics
   */
  static async getTicketStats() {
    const response = await axios.get(`${TICKETS_API_URL}/stats`);
    return response.data;
  }

  /**
   * Validate ticket
   * @param {string} ticketId - Ticket ID
   * @returns {Promise} API response with validation result
   */
  static async validateTicket(ticketId) {
    const response = await axios.post(
      `${TICKETS_API_URL}/${ticketId}/validate`
    );
    return response.data;
  }
}

export default TicketAPI;
