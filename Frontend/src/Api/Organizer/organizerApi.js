import axios from "axios";

// Base URL for organizer API endpoints
const ORGANIZER_API_URL = "http://localhost:5000/api/organizer";

// Set default axios config
axios.defaults.withCredentials = true;

// ===== EVENT API FUNCTIONS =====
export const eventApi = {
  create: async (eventData) => {
    const config = {
      headers: {},
      withCredentials: true,
    };
    const response = await axios.post(
      `${ORGANIZER_API_URL}/events`,
      eventData,
      config
    );
    return response.data;
  },

  update: async (id, eventData) => {
    const config = {
      headers: {
        // Don't set Content-Type manually when sending FormData!
        // axios will set it automatically with the proper boundary
      },
    };
    const response = await axios.put(
      `${ORGANIZER_API_URL}/events/${id}`,
      eventData,
      config
    );
    return response.data;
  },

  getAll: async () => {
    const response = await axios.get(`${ORGANIZER_API_URL}/events`);
    return response.data;
  },

  getById: async (eventId) => {
    const config = {
      headers: {},
      withCredentials: true,
    };
    const response = await axios.get(
      `${ORGANIZER_API_URL}/events/${eventId}`,
      config
    );
    return response.data;
  },

  delete: async (eventId) => {
    const config = {
      headers: {},
      withCredentials: true,
    };
    await axios.delete(`${ORGANIZER_API_URL}/events/${eventId}`, config);
    return eventId;
  },
};

// ===== ATTENDEE API FUNCTIONS =====
export const attendeeApi = {
  getEventAttendees: async (eventId) => {
    const response = await axios.get(
      `${ORGANIZER_API_URL}/events/${eventId}/attendees`
    );
    return response.data;
  },

  markAttendance: async (attendeeId, attendanceData) => {
    const response = await axios.put(
      `${ORGANIZER_API_URL}/attendees/${attendeeId}/attendance`,
      attendanceData,
      {
        withCredentials: true,
      }
    );
    return response.data.ticket;
  },

  resendConfirmation: async (ticketId) => {
    const response = await axios.post(
      `${ORGANIZER_API_URL}/attendees/${ticketId}/resend-confirmation`
    );
    return { ticketId, ...response.data };
  },

  exportAttendeeList: async (eventId, format) => {
    if (format === "pdf") {
      // For PDFs, use window.open approach instead of Axios for streaming
      window.open(
        `${ORGANIZER_API_URL}/events/${eventId}/attendees/export/${format}`,
        "_blank"
      );
      return { eventId, format, success: true };
    } else {
      // For CSV and other formats, continue using Axios
      const response = await axios.get(
        `${ORGANIZER_API_URL}/events/${eventId}/attendees/export/${format}`,
        { responseType: "blob" }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link and click it to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `attendees-${eventId}.${format}`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      return { eventId, format, success: true };
    }
  },
};

// ===== QR CODE API FUNCTIONS =====
export const qrCodeApi = {
  generate: async (ticketId) => {
    const response = await axios.get(
      `${ORGANIZER_API_URL}/tickets/${ticketId}/qrcode`
    );
    return response.data;
  },

  validate: async (qrData) => {
    const response = await axios.post(
      `${ORGANIZER_API_URL}/tickets/validate-qrcode`,
      { qrData }
    );
    return response.data;
  },
};

// ===== DISCOUNT API FUNCTIONS =====
export const discountApi = {
  create: async (discountData) => {
    const config = {
      headers: {},
      withCredentials: true,
    };
    const response = await axios.post(
      `${ORGANIZER_API_URL}/discounts`,
      discountData,
      config
    );
    return response.data;
  },

  update: async (discountId, discountData) => {
    const config = {
      headers: {},
      withCredentials: true,
    };
    const response = await axios.put(
      `${ORGANIZER_API_URL}/discounts/${discountId}`,
      discountData,
      config
    );
    return response.data;
  },

  delete: async (discountId) => {
    const config = {
      headers: {},
      withCredentials: true,
    };
    await axios.delete(`${ORGANIZER_API_URL}/discounts/${discountId}`, config);
    return discountId;
  },

  getEventDiscounts: async (eventId) => {
    const config = {
      headers: {},
      withCredentials: true,
    };
    const response = await axios.get(
      `${ORGANIZER_API_URL}/events/${eventId}/discounts`,
      config
    );
    return { eventId, discounts: response.data };
  },

  validateCode: async (codeData) => {
    const response = await axios.post(
      `${ORGANIZER_API_URL}/discounts/validate`,
      codeData
    );
    return response.data;
  },
};

// ===== SALES API FUNCTIONS =====
export const salesApi = {
  getEventSales: async (eventId) => {
    const response = await axios.get(
      `${ORGANIZER_API_URL}/sales/event/${eventId}`
    );
    return response.data;
  },

  getSalesByPeriod: async (periodData) => {
    const response = await axios.get(`${ORGANIZER_API_URL}/sales/period`, {
      params: periodData,
    });
    return response.data;
  },

  getSalesAnalytics: async () => {
    const response = await axios.get(`${ORGANIZER_API_URL}/sales/analytics`);
    return response.data;
  },
};

// ===== ORGANIZER PROFILE API FUNCTIONS =====
export const organizerProfileApi = {
  fetch: async () => {
    const response = await axios.get(`${ORGANIZER_API_URL}/profile`);
    return response.data;
  },

  update: async (organizerData) => {
    let response;

    // If there's a new file, build FormData
    if (organizerData.profileImage instanceof File) {
      const formData = new FormData();
      Object.entries(organizerData).forEach(([key, val]) => {
        // Handle arrays specially (like categories)
        if (Array.isArray(val)) {
          formData.append(key, JSON.stringify(val));
        } else {
          // Append everything else, including the file
          formData.append(key, val);
        }
      });

      response = await axios.put(`${ORGANIZER_API_URL}/profile`, formData, {
        withCredentials: true,
      });
    } else {
      // JSON payload for non-file updates
      response = await axios.put(
        `${ORGANIZER_API_URL}/profile`,
        organizerData,
        {
          withCredentials: true,
        }
      );
    }

    return response.data.organizer;
  },

  updateSettings: async (settingsData) => {
    const response = await axios.put(
      `${ORGANIZER_API_URL}/settings`,
      settingsData,
      { withCredentials: true }
    );
    return response.data.user;
  },

  updatePassword: async (passwordData) => {
    const response = await axios.put(
      `${ORGANIZER_API_URL}/password`,
      passwordData,
      { withCredentials: true }
    );
    return response.data;
  },

  getDashboard: async () => {
    const response = await axios.get(`${ORGANIZER_API_URL}/dashboard`);
    return response.data;
  },
};
