import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin"; // Admin API URL

// Dashboard & Settings Thunks
export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard`);
      return response.data;
    } catch (error) {
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
      const response = await axios.get(`${API_URL}/settings`);
      return response.data;
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
      const response = await axios.put(`${API_URL}/settings`, settingsData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update settings"
      );
    }
  }
);

export const changeAdminPassword = createAsyncThunk(
  "admin/changeAdminPassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/settings/change-password`,
        passwordData
      );
      return response.data;
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
      const response = await axios.get(`${API_URL}/event-approvals`);
      return response.data;
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
      const response = await axios.get(`${API_URL}/event-approvals/${eventId}`);
      return response.data;
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
      const response = await axios.put(
        `${API_URL}/event-approvals/${eventId}/approve`
      );
      return response.data;
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
      const response = await axios.put(
        `${API_URL}/event-approvals/${eventId}/reject`,
        { reason }
      );
      return response.data;
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
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "admin/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      return response.data;
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
      const response = await axios.put(
        `${API_URL}/users/${userId}/status`,
        statusData
      );
      return response.data;
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
      const response = await axios.get(`${API_URL}/organizers`);
      return response.data;
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
      const response = await axios.get(`${API_URL}/organizers/${organizerId}`);
      return response.data;
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
      const response = await axios.put(
        `${API_URL}/organizers/${organizerId}/status`,
        statusData
      );
      return response.data;
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
      const response = await axios.get(
        `${API_URL}/organizers/${organizerId}/events`
      );
      return response.data;
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
      const response = await axios.get(`${API_URL}/refund-requests`);
      return response.data;
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
      const response = await axios.put(
        `${API_URL}/refund-requests/${requestId}/approve`
      );
      return response.data;
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
      const response = await axios.put(
        `${API_URL}/refund-requests/${requestId}/reject`,
        { reason }
      );
      return response.data;
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
      const queryParams = new URLSearchParams(params).toString();
      const url = params
        ? `${API_URL}/transactions?${queryParams}`
        : `${API_URL}/transactions`;
      const response = await axios.get(url);
      return response.data;
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
      const queryParams = new URLSearchParams(params).toString();
      const url = params
        ? `${API_URL}/reports/revenue?${queryParams}`
        : `${API_URL}/reports/revenue`;
      const response = await axios.get(url);
      return response.data;
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
      const queryParams = new URLSearchParams(params).toString();
      const url = params
        ? `${API_URL}/reports/popular-events?${queryParams}`
        : `${API_URL}/reports/popular-events`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch popular events"
      );
    }
  }
);

// Initial state
const initialState = {
  dashboard: {
    stats: null,
    loading: false,
  },
  settings: {
    data: null,
    loading: false,
    updateSuccess: false,
    passwordChangeSuccess: false,
  },
  events: {
    pendingEvents: [],
    currentEvent: null,
    loading: false,
  },
  users: {
    usersList: [],
    currentUser: null,
    organizersList: [],
    currentOrganizer: null,
    organizerEvents: [],
    loading: false,
  },
  refunds: {
    refundRequests: [],
    loading: false,
  },
  finance: {
    transactions: [],
    revenueReport: null,
    popularEvents: [],
    loading: false,
  },
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminErrors(state) {
      state.error = null;
    },
    resetUpdateSuccess(state) {
      state.settings.updateSuccess = false;
    },
    resetPasswordChangeSuccess(state) {
      state.settings.passwordChangeSuccess = false;
    },
    clearCurrentUser(state) {
      state.users.currentUser = null;
    },
    clearCurrentOrganizer(state) {
      state.users.currentOrganizer = null;
    },
    clearCurrentEvent(state) {
      state.events.currentEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboard.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboard.loading = false;
        state.error = action.payload;
      })

      // Settings
      .addCase(fetchSettings.pending, (state) => {
        state.settings.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settings.loading = false;
        state.settings.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.settings.loading = false;
        state.error = action.payload;
      })

      .addCase(updateSettings.pending, (state) => {
        state.settings.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings.loading = false;
        state.settings.data = action.payload;
        state.settings.updateSuccess = true;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.settings.loading = false;
        state.error = action.payload;
      })

      .addCase(changeAdminPassword.pending, (state) => {
        state.settings.loading = true;
        state.error = null;
      })
      .addCase(changeAdminPassword.fulfilled, (state) => {
        state.settings.loading = false;
        state.settings.passwordChangeSuccess = true;
      })
      .addCase(changeAdminPassword.rejected, (state, action) => {
        state.settings.loading = false;
        state.error = action.payload;
      })

      // Event approvals
      .addCase(fetchPendingEvents.pending, (state) => {
        state.events.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingEvents.fulfilled, (state, action) => {
        state.events.loading = false;
        state.events.pendingEvents = action.payload;
      })
      .addCase(fetchPendingEvents.rejected, (state, action) => {
        state.events.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchEventDetails.pending, (state) => {
        state.events.loading = true;
        state.error = null;
      })
      .addCase(fetchEventDetails.fulfilled, (state, action) => {
        state.events.loading = false;
        state.events.currentEvent = action.payload;
      })
      .addCase(fetchEventDetails.rejected, (state, action) => {
        state.events.loading = false;
        state.error = action.payload;
      })

      .addCase(approveEvent.pending, (state) => {
        state.events.loading = true;
        state.error = null;
      })
      .addCase(approveEvent.fulfilled, (state, action) => {
        state.events.loading = false;
        // Update the event status in the pendingEvents array
        state.events.pendingEvents = state.events.pendingEvents.filter(
          (event) => event._id !== action.payload._id
        );
        if (
          state.events.currentEvent &&
          state.events.currentEvent._id === action.payload._id
        ) {
          state.events.currentEvent = action.payload;
        }
      })
      .addCase(approveEvent.rejected, (state, action) => {
        state.events.loading = false;
        state.error = action.payload;
      })

      .addCase(rejectEvent.pending, (state) => {
        state.events.loading = true;
        state.error = null;
      })
      .addCase(rejectEvent.fulfilled, (state, action) => {
        state.events.loading = false;
        // Update the event status in the pendingEvents array
        state.events.pendingEvents = state.events.pendingEvents.filter(
          (event) => event._id !== action.payload._id
        );
        if (
          state.events.currentEvent &&
          state.events.currentEvent._id === action.payload._id
        ) {
          state.events.currentEvent = action.payload;
        }
      })
      .addCase(rejectEvent.rejected, (state, action) => {
        state.events.loading = false;
        state.error = action.payload;
      })

      // Users
      .addCase(fetchUsers.pending, (state) => {
        state.users.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.usersList = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserProfile.pending, (state) => {
        state.users.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.currentUser = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.users.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUserStatus.pending, (state) => {
        state.users.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.users.loading = false;
        // Update the user in the usersList
        state.users.usersList = state.users.usersList.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
        if (
          state.users.currentUser &&
          state.users.currentUser._id === action.payload._id
        ) {
          state.users.currentUser = action.payload;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.users.loading = false;
        state.error = action.payload;
      })

      // Organizers
      .addCase(fetchOrganizers.pending, (state) => {
        state.users.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.organizersList = action.payload;
      })
      .addCase(fetchOrganizers.rejected, (state, action) => {
        state.users.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchOrganizerProfile.pending, (state) => {
        state.users.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizerProfile.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.currentOrganizer = action.payload;
      })
      .addCase(fetchOrganizerProfile.rejected, (state, action) => {
        state.users.loading = false;
        state.error = action.payload;
      })

      .addCase(updateOrganizerStatus.pending, (state) => {
        state.users.loading = true;
        state.error = null;
      })
      .addCase(updateOrganizerStatus.fulfilled, (state, action) => {
        state.users.loading = false;
        // Update the organizer in the organizersList
        state.users.organizersList = state.users.organizersList.map(
          (organizer) =>
            organizer._id === action.payload._id ? action.payload : organizer
        );
        if (
          state.users.currentOrganizer &&
          state.users.currentOrganizer._id === action.payload._id
        ) {
          state.users.currentOrganizer = action.payload;
        }
      })
      .addCase(updateOrganizerStatus.rejected, (state, action) => {
        state.users.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchOrganizerEvents.pending, (state) => {
        state.users.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizerEvents.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.organizerEvents = action.payload;
      })
      .addCase(fetchOrganizerEvents.rejected, (state, action) => {
        state.users.loading = false;
        state.error = action.payload;
      })

      // Refund requests
      .addCase(fetchRefundRequests.pending, (state) => {
        state.refunds.loading = true;
        state.error = null;
      })
      .addCase(fetchRefundRequests.fulfilled, (state, action) => {
        state.refunds.loading = false;
        state.refunds.refundRequests = action.payload;
      })
      .addCase(fetchRefundRequests.rejected, (state, action) => {
        state.refunds.loading = false;
        state.error = action.payload;
      })

      .addCase(approveRefundRequest.pending, (state) => {
        state.refunds.loading = true;
        state.error = null;
      })
      .addCase(approveRefundRequest.fulfilled, (state, action) => {
        state.refunds.loading = false;
        // Update the refund request in the refundRequests array
        state.refunds.refundRequests = state.refunds.refundRequests.map(
          (request) =>
            request._id === action.payload._id ? action.payload : request
        );
      })
      .addCase(approveRefundRequest.rejected, (state, action) => {
        state.refunds.loading = false;
        state.error = action.payload;
      })

      .addCase(rejectRefundRequest.pending, (state) => {
        state.refunds.loading = true;
        state.error = null;
      })
      .addCase(rejectRefundRequest.fulfilled, (state, action) => {
        state.refunds.loading = false;
        // Update the refund request in the refundRequests array
        state.refunds.refundRequests = state.refunds.refundRequests.map(
          (request) =>
            request._id === action.payload._id ? action.payload : request
        );
      })
      .addCase(rejectRefundRequest.rejected, (state, action) => {
        state.refunds.loading = false;
        state.error = action.payload;
      })

      // Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.finance.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.finance.loading = false;
        state.finance.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.finance.loading = false;
        state.error = action.payload;
      })

      // Revenue report
      .addCase(fetchRevenueReport.pending, (state) => {
        state.finance.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueReport.fulfilled, (state, action) => {
        state.finance.loading = false;
        state.finance.revenueReport = action.payload;
      })
      .addCase(fetchRevenueReport.rejected, (state, action) => {
        state.finance.loading = false;
        state.error = action.payload;
      })

      // Popular events
      .addCase(fetchPopularEvents.pending, (state) => {
        state.finance.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularEvents.fulfilled, (state, action) => {
        state.finance.loading = false;
        state.finance.popularEvents = action.payload;
      })
      .addCase(fetchPopularEvents.rejected, (state, action) => {
        state.finance.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearAdminErrors,
  resetUpdateSuccess,
  resetPasswordChangeSuccess,
  clearCurrentUser,
  clearCurrentOrganizer,
  clearCurrentEvent,
} = adminSlice.actions;

// Export reducer
export default adminSlice.reducer;
