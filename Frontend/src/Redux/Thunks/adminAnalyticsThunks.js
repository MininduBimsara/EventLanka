import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminAnalyticsApi } from "../../Api/Admin/adminAnalyticsAPI";

// Keep track of the last request to avoid duplicates
let lastRequest = null;

// Create async thunk for fetching analytics data with duplicate prevention
export const fetchAnalyticsData = createAsyncThunk(
  "analytics/fetchData",
  async (filters, { rejectWithValue }) => {
    try {
      const { dateRange } = filters || {};
      const params = {};

      // Add date range parameters if they exist
      if (dateRange?.start) params.startDate = dateRange.start;
      if (dateRange?.end) params.endDate = dateRange.end;

      // Create a request signature to check for duplicates
      const requestSignature = JSON.stringify(params);

      // Check if this is the same as the last request
      if (requestSignature === lastRequest) {
        return null; // Return null to skip processing
      }

      // Update last request signature
      lastRequest = requestSignature;

      const data = await adminAnalyticsApi.fetchAnalytics(filters);
      return data;
    } catch (error) {
      console.error("Error in fetchAnalyticsData:", error);
      return rejectWithValue(error.message);
    }
  },
  {
    // Condition function to prevent unnecessary API calls
    condition: (filters, { getState }) => {
      const state = getState();
      // Check if we're currently loading data
      if (state.analytics.loading) {
        return false;
      }
      return true;
    },
  }
);

// Thunk for fetching users data
export const fetchUsersData = createAsyncThunk(
  "analytics/fetchUsers",
  async (filters, { rejectWithValue }) => {
    try {
      const data = await adminAnalyticsApi.fetchUsers(filters);
      return data;
    } catch (error) {
      console.error("Error in fetchUsersData:", error);
      return rejectWithValue(error.message);
    }
  }
);
