// src/api/adminApi.js
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/admin`;

// Set default axios config
axios.defaults.withCredentials = true;

// Create axios instance with default config
const adminApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: true,
});

// API functions
export const adminAnalyticsApi = {
  // Fetch analytics data
  fetchAnalytics: async (filters = {}) => {
    try {
      const { dateRange } = filters;
      const params = {};

      // Add date range parameters if they exist
      if (dateRange?.start) params.startDate = dateRange.start;
      if (dateRange?.end) params.endDate = dateRange.end;

      const response = await adminApiClient.get("/analytics", { params });
      return response.data;
    } catch (error) {
      // Handle timeout errors
      if (error.code === "ECONNABORTED") {
        throw new Error("Request timed out. Please try again.");
      }

      throw new Error(
        error.response?.data?.error || "Failed to fetch analytics data"
      );
    }
  },

  // Add other admin API calls here
  fetchUsers: async (filters = {}) => {
    try {
      const response = await adminApiClient.get("/users", { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch users data"
      );
    }
  },

  fetchEvents: async (filters = {}) => {
    try {
      const response = await adminApiClient.get("/events", { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch events data"
      );
    }
  },
};

export default adminAnalyticsApi;
