import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  dashboardAPI,
  settingsAPI,
  adminProfileAPI,
  eventApprovalsAPI,
  usersAPI,
  organizersAPI,
  refundRequestsAPI,
  financeAPI,
} from "./adminApi";

// Dashboard & Settings Thunks
export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardAPI.fetchStats();
      // console.log("Dashboard API response:", data);
      return data;
    } catch (error) {
      console.error(
        "Dashboard API error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard statistics"
      );
    }
  }
);

export const fetchSettings = createAsyncThunk(
  "admin/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const data = await settingsAPI.fetch();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch settings"
      );
    }
  }
);

export const updateSettings = createAsyncThunk(
  "admin/updateSettings",
  async (settingsData, { rejectWithValue }) => {
    try {
      const data = await settingsAPI.update(settingsData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update settings"
      );
    }
  }
);

// Admin Profile Thunks
export const fetchAdminProfile = createAsyncThunk(
  "admin/fetchAdminProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminProfileAPI.fetch();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin profile"
      );
    }
  }
);

export const updateAdminProfile = createAsyncThunk(
  "admin/updateAdminProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await adminProfileAPI.update(profileData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update admin profile"
      );
    }
  }
);

export const changeAdminPassword = createAsyncThunk(
  "admin/changeAdminPassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const data = await settingsAPI.changePassword(passwordData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }
);

// Event Approvals Thunks
export const fetchPendingEvents = createAsyncThunk(
  "admin/fetchPendingEvents",
  async (_, { rejectWithValue }) => {
    try {
      const data = await eventApprovalsAPI.fetchPending();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending events"
      );
    }
  }
);

export const fetchEventDetails = createAsyncThunk(
  "admin/fetchEventDetails",
  async (eventId, { rejectWithValue }) => {
    try {
      const data = await eventApprovalsAPI.fetchDetails(eventId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch event details"
      );
    }
  }
);

export const approveEvent = createAsyncThunk(
  "admin/approveEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const data = await eventApprovalsAPI.approve(eventId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve event"
      );
    }
  }
);

export const rejectEvent = createAsyncThunk(
  "admin/rejectEvent",
  async ({ eventId, reason }, { rejectWithValue }) => {
    try {
      const data = await eventApprovalsAPI.reject(eventId, reason);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject event"
      );
    }
  }
);

// Users & Organizers Thunks
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await usersAPI.fetchAll();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const fetchNonAdminUsers = createAsyncThunk(
  "admin/fetchNonAdminUsers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await usersAPI.fetchNonAdmin();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch non-admin users"
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "admin/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await usersAPI.fetchProfile(userId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "admin/updateUserStatus",
  async ({ userId, statusData }, { rejectWithValue }) => {
    try {
      const data = await usersAPI.updateStatus(userId, statusData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user status"
      );
    }
  }
);

export const fetchOrganizers = createAsyncThunk(
  "admin/fetchOrganizers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await organizersAPI.fetchAll();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch organizers"
      );
    }
  }
);

export const fetchOrganizerProfile = createAsyncThunk(
  "admin/fetchOrganizerProfile",
  async (organizerId, { rejectWithValue }) => {
    try {
      const data = await organizersAPI.fetchProfile(organizerId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch organizer profile"
      );
    }
  }
);

export const updateOrganizerStatus = createAsyncThunk(
  "admin/updateOrganizerStatus",
  async ({ organizerId, statusData }, { rejectWithValue }) => {
    try {
      const data = await organizersAPI.updateStatus(organizerId, statusData);
      return {
        organizerId,
        status: statusData.status,
        message: data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update organizer status"
      );
    }
  }
);

export const fetchOrganizerEvents = createAsyncThunk(
  "admin/fetchOrganizerEvents",
  async (organizerId, { rejectWithValue }) => {
    try {
      const data = await organizersAPI.fetchEvents(organizerId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch organizer events"
      );
    }
  }
);

// Refund Requests Thunks
export const fetchRefundRequests = createAsyncThunk(
  "admin/fetchRefundRequests",
  async (_, { rejectWithValue }) => {
    try {
      const data = await refundRequestsAPI.fetchAll();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch refund requests"
      );
    }
  }
);

export const approveRefundRequest = createAsyncThunk(
  "admin/approveRefundRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const data = await refundRequestsAPI.approve(requestId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve refund request"
      );
    }
  }
);

export const rejectRefundRequest = createAsyncThunk(
  "admin/rejectRefundRequest",
  async ({ requestId, reason }, { rejectWithValue }) => {
    try {
      const data = await refundRequestsAPI.reject(requestId, reason);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject refund request"
      );
    }
  }
);

// Transactions & Reports Thunks
export const fetchTransactions = createAsyncThunk(
  "admin/fetchTransactions",
  async (params, { rejectWithValue }) => {
    try {
      const data = await financeAPI.fetchTransactions(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch transactions"
      );
    }
  }
);

export const fetchRevenueReport = createAsyncThunk(
  "admin/fetchRevenueReport",
  async (params, { rejectWithValue }) => {
    try {
      const data = await financeAPI.fetchRevenueReport(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch revenue report"
      );
    }
  }
);

export const fetchPopularEvents = createAsyncThunk(
  "admin/fetchPopularEvents",
  async (params, { rejectWithValue }) => {
    try {
      const data = await financeAPI.fetchPopularEvents(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch popular events"
      );
    }
  }
);
