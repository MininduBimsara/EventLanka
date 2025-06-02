import { createSlice } from "@reduxjs/toolkit";
import {
  // Dashboard & Settings
  fetchDashboardStats,
  fetchSettings,
  updateSettings,
  // Admin Profile
  fetchAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  // Event Approvals
  fetchPendingEvents,
  fetchEventDetails,
  approveEvent,
  rejectEvent,
  // Users & Organizers
  fetchUsers,
  fetchNonAdminUsers,
  fetchUserProfile,
  updateUserStatus,
  fetchOrganizers,
  fetchOrganizerProfile,
  updateOrganizerStatus,
  fetchOrganizerEvents,
  // Refund Requests
  fetchRefundRequests,
  approveRefundRequest,
  rejectRefundRequest,
  // Finance & Reports
  fetchTransactions,
  fetchRevenueReport,
  fetchPopularEvents,
} from "../Thunks/adminThunks";

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
        state.users.usersList = action.payload;
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
