import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserId } from "./userSlice";

// Base URL for organizer API endpoints
const ORGANIZER_API_URL = "http://localhost:5000/api/organizer";

// Set default axios config
axios.defaults.withCredentials = true;

// ===== EVENT THUNKS =====
export const createEvent = createAsyncThunk(
  "organizer/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      // Set the correct content type for FormData (multipart/form-data)
      const config = {
        headers: {
         
        },
        withCredentials: true, // Include cookies with the request
      };

      const response = await axios.post(
        `${ORGANIZER_API_URL}/events`,
        eventData,
        config
      );

      return response.data;
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
      const response = await axios.put(
        `${ORGANIZER_API_URL}/events/${id}`,
        eventData
      );
      return response.data;
    } catch (error) {
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
      const response = await axios.get(`${ORGANIZER_API_URL}/events`);
      return response.data;
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
      const response = await axios.get(
        `${ORGANIZER_API_URL}/events/${eventId}`
      );
      return response.data;
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
      await axios.delete(`${ORGANIZER_API_URL}/events/${eventId}`);
      return eventId;
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
      const response = await axios.get(
        `${ORGANIZER_API_URL}/events/${eventId}/attendees`
      );
      return response.data;
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
      const response = await axios.put(
        `${ORGANIZER_API_URL}/attendees/${attendeeId}/attendance`,
        attendanceData
      );
      return response.data;
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
      const response = await axios.post(
        `${ORGANIZER_API_URL}/attendees/${ticketId}/resend-confirmation`
      );
      return response.data;
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
      document.body.removeChild(link);

      return { eventId, format, success: true };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to export attendee list"
      );
    }
  }
);

// ===== DISCOUNT THUNKS =====
export const createDiscount = createAsyncThunk(
  "organizer/createDiscount",
  async (discountData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${ORGANIZER_API_URL}/discounts`,
        discountData
      );
      return response.data;
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
      const response = await axios.put(
        `${ORGANIZER_API_URL}/discounts/${discountId}`,
        discountData
      );
      return response.data;
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
      await axios.delete(`${ORGANIZER_API_URL}/discounts/${discountId}`);
      return discountId;
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
      const response = await axios.get(
        `${ORGANIZER_API_URL}/events/${eventId}/discounts`
      );
      return { eventId, discounts: response.data };
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
      const response = await axios.post(
        `${ORGANIZER_API_URL}/discounts/validate`,
        codeData
      );
      return response.data;
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
      const response = await axios.get(
        `${ORGANIZER_API_URL}/sales/event/${eventId}`
      );
      return response.data;
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
      const response = await axios.get(`${ORGANIZER_API_URL}/sales/period`, {
        params: periodData,
      });
      return response.data;
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
      const response = await axios.get(`${ORGANIZER_API_URL}/sales/analytics`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sales analytics"
      );
    }
  }
);

// ===== ORGANIZER PROFILE THUNKS =====
// Function to get the current organizer profile
// Add this to your organizerSlice.js
export const fetchOrganizerProfile = createAsyncThunk(
  "organizer/fetchOrganizerProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${ORGANIZER_API_URL}/profile`
      );
      return response.data;
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

// Async thunk for updating organizer profile
export const updateOrganizerProfile = createAsyncThunk(
  "organizer/updateOrganizerProfile",
  async (organizerData, { getState, rejectWithValue }) => {
    try {
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
        
        response = await axios.put(
          `${ORGANIZER_API_URL}/profile`,
          formData,
          {
            withCredentials: true,
          }
        );
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

      return response.data.organizer; // Based on your backend response structure
    } catch (err) {
      if (err.response?.status === 401) {
        return rejectWithValue("401 Unauthorized: Please log in again");
      }
      return rejectWithValue(
        err.response?.data?.message ||
          `Update failed: ${err.message} (${err.response?.status})`
      );
    }
  }
);

export const updateOrganizerSettings = createAsyncThunk(
  "organizer/updateOrganizerSettings",
  async (settingsData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${ORGANIZER_API_URL}/settings`,
        settingsData,
        { withCredentials: true }
      );
      return response.data.user;
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
      const response = await axios.get(
        `${ORGANIZER_API_URL}/dashboard`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

// Async thunk for updating organizer password
export const updateOrganizerPassword = createAsyncThunk(
  "organizer/updateOrganizerPassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${ORGANIZER_API_URL}/password`,
        passwordData,
        { withCredentials: true }
      );
      return response.data;
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
  validatedDiscount: null,

  // Sales states
  eventSales: null,
  periodSales: null,
  salesAnalytics: null,

  // Organizer profile states
  profile: null,
  settings: null,
  dashboardData: null,

  // UI states
  loading: false,
  error: null,
  success: false,
  message: "",
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

      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex(
          (event) => event._id === action.payload._id
        );
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (
          state.currentEvent &&
          state.currentEvent._id === action.payload._id
        ) {
          state.currentEvent = action.payload;
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
        state.discounts[action.payload.eventId] = action.payload.discounts;
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
        state.profile = action.payload;
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
        state.profile = action.payload;
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
} = organizerSlice.actions;

// Export reducer
export default organizerSlice.reducer;
