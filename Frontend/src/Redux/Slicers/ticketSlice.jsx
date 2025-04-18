import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/tickets"; // Tickets API URL

// Async thunk for buying a ticket
export const buyTicket = createAsyncThunk(
  "tickets/buyTicket",
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, ticketData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to buy ticket"
      );
    }
  }
);

// Async thunk for fetching all tickets of the logged-in user
export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tickets"
      );
    }
  }
);

// Async thunk for fetching a specific ticket by ID
export const fetchTicketById = createAsyncThunk(
  "tickets/fetchTicketById",
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${ticketId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch ticket details"
      );
    }
  }
);

// Async thunk for canceling/deleting a ticket
export const cancelTicket = createAsyncThunk(
  "tickets/cancelTicket",
  async (ticketId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${ticketId}`);
      return ticketId; // Return the ID to remove it from state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel ticket"
      );
    }
  }
);

// Initial state for tickets slice
const initialState = {
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null,
  purchaseSuccess: false,
  cancelSuccess: false,
};

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    // Clear errors
    clearTicketsErrors(state) {
      state.error = null;
    },

    // Clear current ticket
    clearCurrentTicket(state) {
      state.currentTicket = null;
    },

    // Reset success flags
    resetPurchaseSuccess(state) {
      state.purchaseSuccess = false;
    },

    resetCancelSuccess(state) {
      state.cancelSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Buy ticket
      .addCase(buyTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.purchaseSuccess = false;
      })
      .addCase(buyTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.push(action.payload);
        state.currentTicket = action.payload;
        state.purchaseSuccess = true;
      })
      .addCase(buyTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.purchaseSuccess = false;
      })

      // Fetch all tickets
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch ticket by ID
      .addCase(fetchTicketById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTicket = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel ticket
      .addCase(cancelTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.cancelSuccess = false;
      })
      .addCase(cancelTicket.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the canceled ticket from the tickets array
        state.tickets = state.tickets.filter(
          (ticket) => ticket._id !== action.payload
        );
        // Clear currentTicket if it's the canceled ticket
        if (state.currentTicket && state.currentTicket._id === action.payload) {
          state.currentTicket = null;
        }
        state.cancelSuccess = true;
      })
      .addCase(cancelTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.cancelSuccess = false;
      });
  },
});

// Export actions
export const {
  clearTicketsErrors,
  clearCurrentTicket,
  resetPurchaseSuccess,
  resetCancelSuccess,
} = ticketsSlice.actions;

// Export reducer
export default ticketsSlice.reducer;
