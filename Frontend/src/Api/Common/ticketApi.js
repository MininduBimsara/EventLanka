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
    // Method 1: Try blob download (silent download)
    try {
      console.log("Attempting blob download for ticket:", ticketId);

      const response = await axios.get(
        `${TICKETS_API_URL}/${ticketId}/download/pdf`,
        {
          responseType: "blob",
          timeout: 15000, // Shorter timeout for fallback
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ticket_${ticketId}.pdf`);
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => window.URL.revokeObjectURL(url), 100);

      console.log("Blob download successful");
      return { ticketId, success: true, method: "blob" };
    } catch (blobError) {
      console.warn("Blob download failed, trying fallback:", blobError.message);

      // Method 2: Fallback to window.open (opens in new tab)
      try {
        const downloadUrl = `${TICKETS_API_URL}/${ticketId}/download/pdf`;
        const newWindow = window.open(downloadUrl, "_blank");

        if (
          !newWindow ||
          newWindow.closed ||
          typeof newWindow.closed == "undefined"
        ) {
          throw new Error("Popup blocked");
        }

        console.log("Window.open download successful");
        return { ticketId, success: true, method: "window" };
      } catch (windowError) {
        console.warn(
          "Window.open failed, trying iframe method:",
          windowError.message
        );

        // Method 3: Hidden iframe method
        try {
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = `${TICKETS_API_URL}/${ticketId}/download/pdf`;

          document.body.appendChild(iframe);

          // Remove iframe after download starts
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 5000);

          console.log("Iframe download initiated");
          return { ticketId, success: true, method: "iframe" };
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
