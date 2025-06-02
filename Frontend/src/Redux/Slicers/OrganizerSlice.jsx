import { createSlice } from "@reduxjs/toolkit";
import {
  // Event thunks
  createEvent,
  updateEvent,
  getOrganizerEvents,
  getOrganizerEventById,
  deleteOrganizerEvent,

  // Attendee thunks
  getEventAttendees,
  markAttendance,
  resendConfirmation,
  exportAttendeeList,

  // QR Code thunks
  generateQRCode,
  validateQRCode,

  // Discount thunks
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getEventDiscounts,
  validateDiscountCode,

  // Sales thunks
  getEventSales,
  getSalesByPeriod,
  getSalesAnalytics,

  // Organizer profile thunks
  fetchOrganizerProfile,
  updateOrganizerProfile,
  updateOrganizerSettings,
  getOrganizerDashboard,
  updateOrganizerPassword,
} from "../Thunks/organizerThunk";

// Initial state for the organizer slice
const initialState = {
  // Event states
  events: [],
  currentEvent: null,

  // Attendee states
  attendees: [],

  // Discount states
  discounts: {},
  currentDiscount: null,
  selectedEvent: null,
  validatedDiscount: null,
  discountValidation: null,

  // Sales states
  eventSales: null,
  periodSales: null,
  salesAnalytics: null,

  // Organizer profile states
  organizerProfile: null,
  settings: null,
  dashboardData: null,

  // UI states
  loading: false,
  error: null,
  success: false,
  message: "",
  qrCode: null,
};

// Create the organizer slice
const organizerSlice = createSlice({
  name: "organizer",
  initialState,
  reducers: {
    // Reset the status state
    resetOrganizerStatus: (state) => {
      state.success = false;
      state.error = null;
      state.message = "";
    },
    // Clear current event
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    // Clear current discount
    clearCurrentDiscount: (state) => {
      state.currentDiscount = null;
      state.validatedDiscount = null;
    },
    // Clear attendees list
    clearAttendees: (state) => {
      state.attendees = [];
    },
    clearMessages: (state) => {
      state.success = false;
      state.message = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== EVENT REDUCERS =====
      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
        state.success = true;
        state.message = action.payload.message || "Event created successfully";
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Event reducers
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;

        // Get the updated event from the payload
        const updatedEvent = action.payload;

        // Find the event in the events array and update it
        const index = state.events.findIndex(
          (event) => event._id === updatedEvent._id
        );

        if (index !== -1) {
          state.events[index] = updatedEvent;
        }

        // Also update currentEvent if it matches
        if (state.currentEvent && state.currentEvent._id === updatedEvent._id) {
          state.currentEvent = updatedEvent;
        }

        state.success = true;
        state.message = "Event updated successfully";
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Events
      .addCase(getOrganizerEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrganizerEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(getOrganizerEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Event by ID
      .addCase(getOrganizerEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrganizerEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(getOrganizerEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Event
      .addCase(deleteOrganizerEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrganizerEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(
          (event) => event._id !== action.payload
        );
        if (state.currentEvent && state.currentEvent._id === action.payload) {
          state.currentEvent = null;
        }
        state.success = true;
        state.message = "Event deleted successfully";
      })
      .addCase(deleteOrganizerEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== ATTENDEE REDUCERS =====
      // Get Event Attendees
      .addCase(getEventAttendees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventAttendees.fulfilled, (state, action) => {
        state.loading = false;
        state.attendees = action.payload;
        state.error = null;
      })
      .addCase(getEventAttendees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark Attendance
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.attendees.findIndex(
          (attendee) => attendee._id === action.payload._id
        );
        if (index !== -1) {
          state.attendees[index] = action.payload;
        }
        state.success = true;
        state.message = "Attendance marked successfully";
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Resend Confirmation
      .addCase(resendConfirmation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendConfirmation.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.message = "Confirmation email resent successfully";
      })
      .addCase(resendConfirmation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Export Attendee List
      .addCase(exportAttendeeList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportAttendeeList.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.message = "Attendee list exported successfully";
      })
      .addCase(exportAttendeeList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== QR CODE REDUCERS =====
      // Generate QR Code
      .addCase(generateQRCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateQRCode.fulfilled, (state, action) => {
        state.loading = false;
        state.qrCode = action.payload.qrCode;
        state.success = true;
      })
      .addCase(generateQRCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Validate QR Code
      .addCase(validateQRCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateQRCode.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "QR code validated successfully";

        // If the validation returns an updated ticket, find and update it in the state
        if (action.payload.ticket) {
          const index = state.attendees.findIndex(
            (attendee) => attendee._id === action.payload.ticket.id
          );
          if (index !== -1) {
            state.attendees[index] = {
              ...state.attendees[index],
              attendance_status: "attended",
              check_in_time: action.payload.ticket.checkInTime,
            };
          }
        }
      })
      .addCase(validateQRCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== DISCOUNT REDUCERS =====
      // Create Discount
      .addCase(createDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDiscount.fulfilled, (state, action) => {
        state.loading = false;
        // Add to the appropriate event's discounts
        const eventId = action.payload.event;
        if (!state.discounts[eventId]) {
          state.discounts[eventId] = [];
        }
        state.discounts[eventId].push(action.payload);
        state.currentDiscount = action.payload;
        state.success = true;
        state.message = "Discount created successfully";
      })
      .addCase(createDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Discount
      .addCase(updateDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDiscount.fulfilled, (state, action) => {
        state.loading = false;
        // Update in the appropriate event's discounts
        const eventId = action.payload.event;
        if (state.discounts[eventId]) {
          const index = state.discounts[eventId].findIndex(
            (discount) => discount._id === action.payload._id
          );
          if (index !== -1) {
            state.discounts[eventId][index] = action.payload;
          }
        }
        state.currentDiscount = action.payload;
        state.success = true;
        state.message = "Discount updated successfully";
      })
      .addCase(updateDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Discount
      .addCase(deleteDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDiscount.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from all event discounts
        Object.keys(state.discounts).forEach((eventId) => {
          state.discounts[eventId] = state.discounts[eventId].filter(
            (discount) => discount._id !== action.payload
          );
        });
        if (
          state.currentDiscount &&
          state.currentDiscount._id === action.payload
        ) {
          state.currentDiscount = null;
        }
        state.success = true;
        state.message = "Discount deleted successfully";
      })
      .addCase(deleteDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Event Discounts
      .addCase(getEventDiscounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventDiscounts.fulfilled, (state, action) => {
        state.loading = false;
        state.discounts = action.payload.discounts;
      })
      .addCase(getEventDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Validate Discount Code
      .addCase(validateDiscountCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateDiscountCode.fulfilled, (state, action) => {
        state.loading = false;
        state.validatedDiscount = action.payload;
        state.success = true;
      })
      .addCase(validateDiscountCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.validatedDiscount = null;
      })

      // ===== SALES REDUCERS =====
      // Get Event Sales
      .addCase(getEventSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventSales.fulfilled, (state, action) => {
        state.loading = false;
        state.eventSales = action.payload;
      })
      .addCase(getEventSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Sales By Period
      .addCase(getSalesByPeriod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesByPeriod.fulfilled, (state, action) => {
        state.loading = false;
        state.periodSales = action.payload;
      })
      .addCase(getSalesByPeriod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Sales Analytics
      .addCase(getSalesAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.salesAnalytics = action.payload;
      })
      .addCase(getSalesAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== ORGANIZER PROFILE REDUCERS =====
      // Get Organizer Profile
      .addCase(fetchOrganizerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.organizerProfile = action.payload;
      })
      .addCase(fetchOrganizerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Organizer Profile
      .addCase(updateOrganizerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrganizerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.organizerProfile = action.payload;
        state.success = true;
        state.message = "Profile updated successfully";
      })
      .addCase(updateOrganizerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Organizer Settings
      .addCase(updateOrganizerSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrganizerSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.success = true;
        state.message = "Settings updated successfully";
      })
      .addCase(updateOrganizerSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Organizer Dashboard
      .addCase(getOrganizerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrganizerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(getOrganizerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Change Organizer Password
      .addCase(updateOrganizerPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrganizerPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.message = "Password changed successfully";
      })
      .addCase(updateOrganizerPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  resetOrganizerStatus,
  clearCurrentEvent,
  clearCurrentDiscount,
  clearAttendees,
  clearMessages,
} = organizerSlice.actions;

// Export reducer
export default organizerSlice.reducer;
