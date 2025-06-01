import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  eventApi,
  attendeeApi,
  qrCodeApi,
  discountApi,
  salesApi,
  organizerProfileApi,
} from "../../Api/Organizer/organizerApi";

// ===== EVENT THUNKS =====
export const createEvent = createAsyncThunk(
  "organizer/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      return await eventApi.create(eventData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create event"
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  "organizer/updateEvent",
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      console.log("Updating event with ID:", id);
      const response = await eventApi.update(id, eventData);
      console.log("Update response:", response);
      return response;
    } catch (error) {
      console.error(
        "Error updating event:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to update event"
      );
    }
  }
);

export const getOrganizerEvents = createAsyncThunk(
  "organizer/getEvents",
  async (_, { rejectWithValue }) => {
    try {
      return await eventApi.getAll();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

export const getOrganizerEventById = createAsyncThunk(
  "organizer/getEventById",
  async (eventId, { rejectWithValue }) => {
    try {
      return await eventApi.getById(eventId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch event details"
      );
    }
  }
);

export const deleteOrganizerEvent = createAsyncThunk(
  "organizer/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      return await eventApi.delete(eventId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete event"
      );
    }
  }
);

// ===== ATTENDEE THUNKS =====
export const getEventAttendees = createAsyncThunk(
  "organizer/getEventAttendees",
  async (eventId, { rejectWithValue }) => {
    try {
      return await attendeeApi.getEventAttendees(eventId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendees"
      );
    }
  }
);

export const markAttendance = createAsyncThunk(
  "organizer/markAttendance",
  async ({ attendeeId, attendanceData }, { rejectWithValue }) => {
    try {
      return await attendeeApi.markAttendance(attendeeId, attendanceData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark attendance"
      );
    }
  }
);

export const resendConfirmation = createAsyncThunk(
  "organizer/resendConfirmation",
  async (ticketId, { rejectWithValue }) => {
    try {
      return await attendeeApi.resendConfirmation(ticketId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend confirmation"
      );
    }
  }
);

export const exportAttendeeList = createAsyncThunk(
  "organizer/exportAttendeeList",
  async ({ eventId, format }, { rejectWithValue }) => {
    try {
      return await attendeeApi.exportAttendeeList(eventId, format);
    } catch (error) {
      console.error("Export error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          `Failed to export attendee list as ${format}`
      );
    }
  }
);

// ===== QR CODE THUNKS =====
export const generateQRCode = createAsyncThunk(
  "organizer/generateQRCode",
  async (ticketId, { rejectWithValue }) => {
    try {
      return await qrCodeApi.generate(ticketId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate QR code"
      );
    }
  }
);

export const validateQRCode = createAsyncThunk(
  "organizer/validateQRCode",
  async (qrData, { rejectWithValue }) => {
    try {
      return await qrCodeApi.validate(qrData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to validate QR code"
      );
    }
  }
);

// ===== DISCOUNT THUNKS =====
export const createDiscount = createAsyncThunk(
  "organizer/createDiscount",
  async (discountData, { rejectWithValue }) => {
    try {
      return await discountApi.create(discountData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create discount"
      );
    }
  }
);

export const updateDiscount = createAsyncThunk(
  "organizer/updateDiscount",
  async ({ discountId, discountData }, { rejectWithValue }) => {
    try {
      return await discountApi.update(discountId, discountData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update discount"
      );
    }
  }
);

export const deleteDiscount = createAsyncThunk(
  "organizer/deleteDiscount",
  async (discountId, { rejectWithValue }) => {
    try {
      return await discountApi.delete(discountId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete discount"
      );
    }
  }
);

export const getEventDiscounts = createAsyncThunk(
  "organizer/getEventDiscounts",
  async (eventId, { rejectWithValue }) => {
    try {
      return await discountApi.getEventDiscounts(eventId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch discounts"
      );
    }
  }
);

export const validateDiscountCode = createAsyncThunk(
  "organizer/validateDiscountCode",
  async (codeData, { rejectWithValue }) => {
    try {
      return await discountApi.validateCode(codeData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid discount code"
      );
    }
  }
);

// ===== SALES THUNKS =====
export const getEventSales = createAsyncThunk(
  "organizer/getEventSales",
  async (eventId, { rejectWithValue }) => {
    try {
      return await salesApi.getEventSales(eventId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sales data"
      );
    }
  }
);

export const getSalesByPeriod = createAsyncThunk(
  "organizer/getSalesByPeriod",
  async (periodData, { rejectWithValue }) => {
    try {
      return await salesApi.getSalesByPeriod(periodData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch period sales data"
      );
    }
  }
);

export const getSalesAnalytics = createAsyncThunk(
  "organizer/getSalesAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      return await salesApi.getSalesAnalytics();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sales analytics"
      );
    }
  }
);

// ===== ORGANIZER PROFILE THUNKS =====
export const fetchOrganizerProfile = createAsyncThunk(
  "organizer/fetchOrganizerProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await organizerProfileApi.fetch();
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("401 Unauthorized: Please log in again");
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile data"
      );
    }
  }
);

export const updateOrganizerProfile = createAsyncThunk(
  "organizer/updateOrganizerProfile",
  async (organizerData, { rejectWithValue }) => {
    try {
      return await organizerProfileApi.update(organizerData);
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("401 Unauthorized: Please log in again");
      }
      return rejectWithValue(
        error.response?.data?.message ||
          `Update failed: ${error.message} (${error.response?.status})`
      );
    }
  }
);

export const updateOrganizerSettings = createAsyncThunk(
  "organizer/updateOrganizerSettings",
  async (settingsData, { rejectWithValue }) => {
    try {
      return await organizerProfileApi.updateSettings(settingsData);
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("401 Unauthorized: Please log in again");
      }
      return rejectWithValue(
        error.response?.data?.message || "Settings update failed"
      );
    }
  }
);

export const getOrganizerDashboard = createAsyncThunk(
  "organizer/getDashboard",
  async (_, { rejectWithValue }) => {
    try {
      return await organizerProfileApi.getDashboard();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

export const updateOrganizerPassword = createAsyncThunk(
  "organizer/updateOrganizerPassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      return await organizerProfileApi.updatePassword(passwordData);
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("401 Unauthorized: Please log in again");
      }
      return rejectWithValue(
        error.response?.data?.message || "Password update failed"
      );
    }
  }
);
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
