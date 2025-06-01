import { createSlice } from "@reduxjs/toolkit";
import {
  fetchEvents,
  fetchAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchEventById,
} from "./eventThunks";

// Initial state for events slice
const initialState = {
  events: [],
  currentEvent: null,
  loading: false,
  error: null,
  bookingError: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    // Clear errors
    clearEventsErrors(state) {
      state.error = null;
      state.bookingError = null;
    },

    // Set current event (for viewing details)
    setCurrentEvent(state, action) {
      state.currentEvent = state.events.find(
        (event) => event._id === action.payload
      );

      // Check if booking is available when setting current event
      if (state.currentEvent && !state.currentEvent.bookingAvailable) {
        state.bookingError = "Booking is not available for this event";
      } else {
        state.bookingError = null;
      }
    },

    // Clear current event
    clearCurrentEvent(state) {
      state.currentEvent = null;
      state.bookingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all events (without permission)
      .addCase(fetchAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = [...state.events, action.payload];
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        // Update the event in the events array
        state.events = state.events.map((event) =>
          event._id === action.payload._id ? action.payload : event
        );
        // Also update currentEvent if it's the same event
        if (
          state.currentEvent &&
          state.currentEvent._id === action.payload._id
        ) {
          state.currentEvent = action.payload;
          // Check booking availability when updating current event
          if (!action.payload.bookingAvailable) {
            state.bookingError = "Booking is not available for this event";
          } else {
            state.bookingError = null;
          }
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted event from the events array
        state.events = state.events.filter(
          (event) => event._id !== action.payload
        );
        // Clear currentEvent if it's the deleted event
        if (state.currentEvent && state.currentEvent._id === action.payload) {
          state.currentEvent = null;
          state.bookingError = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch event by ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.bookingError = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        // Distinguish between booking errors and other errors
        if (action.payload === "Booking is not available for this event") {
          state.bookingError = action.payload;
        } else {
          state.error = action.payload;
        }
      });
  },
});

// Export actions
export const { clearEventsErrors, setCurrentEvent, clearCurrentEvent } =
  eventsSlice.actions;

// Export reducer
export default eventsSlice.reducer;
