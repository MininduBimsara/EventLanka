import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/admin`; // Admin API URL

// Set default axios config
axios.defaults.withCredentials = true;

// Create axios instance for admin API
const adminAPI = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Dashboard & Settings API
export const dashboardAPI = {
  fetchStats: async () => {
    const response = await adminAPI.get("/dashboard");
    return response.data;
  },
};

export const settingsAPI = {
  fetch: async () => {
    const response = await adminAPI.get("/settings");
    return response.data;
  },

  update: async (settingsData) => {
    const response = await adminAPI.put("/settings", settingsData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await adminAPI.put(
      "/settings/change-password",
      passwordData
    );
    return response.data;
  },
};

// Admin Profile API
export const adminProfileAPI = {
  fetch: async () => {
    const response = await adminAPI.get("/profile");
    return response.data;
  },

  update: async (profileData) => {
    const response = await adminAPI.put("/profile", profileData);
    return response.data;
  },
};

// Event Approvals API
export const eventApprovalsAPI = {
  fetchPending: async () => {
    const response = await adminAPI.get("/event-approvals");
    return response.data;
  },

  fetchDetails: async (eventId) => {
    const response = await adminAPI.get(`/event-approvals/${eventId}`);
    return response.data;
  },

  approve: async (eventId) => {
    const response = await adminAPI.put(`/event-approvals/${eventId}/approve`);
    return response.data;
  },

  reject: async (eventId, reason) => {
    const response = await adminAPI.put(`/event-approvals/${eventId}/reject`, {
      reason,
    });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  fetchAll: async () => {
    const response = await adminAPI.get("/users");
    return response.data;
  },

  fetchNonAdmin: async () => {
    const response = await adminAPI.get("/non-admin-users");
    return response.data;
  },

  fetchProfile: async (userId) => {
    const response = await adminAPI.get(`/users/${userId}`);
    return response.data;
  },

  updateStatus: async (userId, statusData) => {
    const response = await adminAPI.put(`/users/${userId}/status`, statusData);
    return response.data;
  },
};

// Organizers API
export const organizersAPI = {
  fetchAll: async () => {
    const response = await adminAPI.get("/organizers");
    return response.data;
  },

  fetchProfile: async (organizerId) => {
    const response = await adminAPI.get(`/organizers/${organizerId}`);
    return response.data;
  },

  updateStatus: async (organizerId, statusData) => {
    const response = await adminAPI.put(
      `/organizers/${organizerId}/status`,
      statusData
    );
    return response.data;
  },

  fetchEvents: async (organizerId) => {
    const response = await adminAPI.get(`/organizers/${organizerId}/events`);
    return response.data;
  },
};

// Refund Requests API
export const refundRequestsAPI = {
  fetchAll: async () => {
    const response = await adminAPI.get("/refund-requests");
    return response.data;
  },

  approve: async (requestId) => {
    const response = await adminAPI.put(
      `/refund-requests/${requestId}/approve`
    );
    return response.data;
  },

  reject: async (requestId, reason) => {
    const response = await adminAPI.put(
      `/refund-requests/${requestId}/reject`,
      { reason }
    );
    return response.data;
  },
};

// Finance & Reports API
export const financeAPI = {
  fetchTransactions: async (params) => {
    const queryParams = params ? new URLSearchParams(params).toString() : "";
    const url = queryParams ? `/transactions?${queryParams}` : "/transactions";
    const response = await adminAPI.get(url);
    return response.data;
  },

  fetchRevenueReport: async (params) => {
    const queryParams = params ? new URLSearchParams(params).toString() : "";
    const url = queryParams
      ? `/reports/revenue?${queryParams}`
      : "/reports/revenue";
    const response = await adminAPI.get(url);
    return response.data;
  },

  fetchPopularEvents: async (params) => {
    const queryParams = params ? new URLSearchParams(params).toString() : "";
    const url = queryParams
      ? `/reports/popular-events?${queryParams}`
      : "/reports/popular-events";
    const response = await adminAPI.get(url);
    return response.data;
  },
};

// Export the axios instance for custom requests if needed
export { adminAPI };
export default adminAPI;
