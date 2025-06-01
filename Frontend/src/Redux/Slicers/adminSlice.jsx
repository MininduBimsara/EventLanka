adminSlice.jsx
852 lines

jsx

i need separate api layers to a separate file

Edit
I'll help you separate the API layer from your Redux slice. This will create a cleaner architecture with better separation of concerns.


adminApi.js - Admin API Layer
Code 
Now, here's the updated Redux slice file that uses the separated API layer:


adminSlice.jsx - Updated Redux Slice
Code 



Continue

Edit

adminSlice.jsx - Updated Redux Slice
Code ∙ Version 2 
Perfect! I've successfully separated your API layer from the Redux slice. Here's what I've created:

adminApi.js - Dedicated API Layer
This file contains:

Organized API functions grouped by functionality (dashboard, settings, users, etc.)
Reusable axios instance with base configuration
Clean function signatures that are easy to understand and maintain
Proper error handling at the API level
Updated adminSlice.jsx - Clean Redux Slice
The updated slice now:

Imports API functions instead of making direct axios calls
Focuses purely on state management and Redux logic
Maintains the same functionality while being much cleaner
Easier to test since API calls are separated
Benefits of this separation:
Better maintainability - API logic is centralized
Reusability - API functions can be used outside of Redux if needed
Easier testing - You can mock the API layer easily
Cleaner code - Redux slice focuses only on state management
Better error handling - Centralized API error handling
Type safety - Easier to add TypeScript types later if needed
Usage:
Just replace your current adminSlice.jsx with the updated version and create the new adminApi.js file. The Redux slice will work exactly the same way from your components, but now with a much cleaner architecture!

The API layer is now completely separate and can be easily extended or modified without touching the Redux logic.





this v2 is not full version here.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
  profile: {
    data: null,
    loading: false,
    updateSuccess: false,
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
    resetProfileUpdateSuccess(state) {
      state.profile.updateSuccess = false;
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

      // Platform Settings
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

      // Admin Profile
      .addCase(fetchAdminProfile.pending, (state) => {
        state.profile.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.profile.loading = false;
        state.profile.data = action.payload;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.profile.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAdminProfile.pending, (state) => {
        state.profile.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.profile.loading = false;
        state.profile.data = action.payload.adminProfile;
        state.profile.updateSuccess = true;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.profile.loading = false;
        state.error = action.payload;
      })

      // Password Change
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
      // Non-Admin Users
      .addCase(fetchNonAdminUsers.pending, (state) => {
        state.users.loading = true;
        state.error = null;
      })
      .addCase(fetchNonAdminUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.usersList = action.payload; // Assuming this is where non-admin users are stored
      })
      .addCase(fetchNonAdminUsers.rejected, (state, action) => {
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
        state.error = null;
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
  resetProfileUpdateSuccess,
  clearCurrentUser,
  clearCurrentOrganizer,
  clearCurrentEvent,
} = adminSlice.actions;

// Export reducer
export default adminSlice.reducer;
