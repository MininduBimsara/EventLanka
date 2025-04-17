import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/events"; // Events API URL

// Async thunk for fetching all events
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

// Async thunk for creating a new event
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      let response;

      // Check if eventData is FormData (for file uploads) or regular object
      if (eventData instanceof FormData) {
        response = await axios.post(API_URL, eventData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axios.post(API_URL, eventData);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create event"
      );
    }
  }
);

// Async thunk for updating an existing event
export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
      let response;

      if (eventData instanceof FormData) {
        response = await axios.put(`${API_URL}/${eventId}`, eventData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axios.put(`${API_URL}/${eventId}`, eventData);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update event"
      );
    }
  }
);

// Async thunk for deleting an event
export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${eventId}`);
      return eventId; // Return the ID to remove it from state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete event"
      );
    }
  }
);

// Initial state for events slice
const initialState = {
  events: [],
  currentEvent: null,
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    // Clear errors
    clearEventsErrors(state) {
      state.error = null;
    },

    // Set current event (for viewing details)
    setCurrentEvent(state, action) {
      state.currentEvent = state.events.find(
        (event) => event._id === action.payload
      );
    },

    // Clear current event
    clearCurrentEvent(state) {
      state.currentEvent = null;
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
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearEventsErrors, setCurrentEvent, clearCurrentEvent } =
  eventsSlice.actions;

// Export reducer
export default eventsSlice.reducer;
