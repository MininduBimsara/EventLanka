// slices/ticketSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import TicketAPI from "../api/ticketApi";

// Async thunk for buying a ticket
export const buyTicket = createAsyncThunk(
  "tickets/buyTicket",
  async (ticketData, { rejectWithValue }) => {
    try {
      const data = await TicketAPI.buyTicket(ticketData);
      return data;
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
      const data = await TicketAPI.fetchTickets();
      return data;
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
      const data = await TicketAPI.fetchTicketById(ticketId);
      return data;
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
      const ticketId_returned = await TicketAPI.cancelTicket(ticketId);
      return ticketId_returned;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel ticket"
      );
    }
  }
);

// Async thunk for generating QR code for a ticket
export const generateTicketQRCode = createAsyncThunk(
  "tickets/generateQRCode",
  async (ticketId, { rejectWithValue }) => {
    try {
      const data = await TicketAPI.generateTicketQRCode(ticketId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate QR code"
      );
    }
  }
);

// Async thunk for downloading ticket as PDF
export const downloadTicketPDF = createAsyncThunk(
  "tickets/downloadPDF",
  async (ticketId, { rejectWithValue }) => {
    try {
      const result = await TicketAPI.downloadTicketPDF(ticketId);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to download ticket"
      );
    }
  }
);

// Async thunk for updating a ticket
export const updateTicket = createAsyncThunk(
  "tickets/updateTicket",
  async ({ ticketId, updateData }, { rejectWithValue }) => {
    try {
      const data = await TicketAPI.updateTicket(ticketId, updateData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update ticket"
      );
    }
  }
);

// Async thunk for getting ticket statistics
export const getTicketStats = createAsyncThunk(
  "tickets/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await TicketAPI.getTicketStats();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch ticket statistics"
      );
    }
  }
);

// Async thunk for validating a ticket
export const validateTicket = createAsyncThunk(
  "tickets/validateTicket",
  async (ticketId, { rejectWithValue }) => {
    try {
      const data = await TicketAPI.validateTicket(ticketId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to validate ticket"
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
  updateSuccess: false,
  qrCode: null,
  qrCodeLoading: false,
  downloadSuccess: false,
  stats: null,
  validationResult: null,
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

    resetUpdateSuccess(state) {
      state.updateSuccess = false;
    },

    resetDownloadSuccess(state) {
      state.downloadSuccess = false;
    },

    // Clear QR code
    clearQRCode(state) {
      state.qrCode = null;
    },

    // Clear validation result
    clearValidationResult(state) {
      state.validationResult = null;
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
      })

      // Update ticket
      .addCase(updateTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.loading = false;
        // Update the ticket in the tickets array
        state.tickets = state.tickets.map((ticket) =>
          ticket._id === action.payload._id ? action.payload : ticket
        );
        // Also update currentTicket if it's the same ticket
        if (
          state.currentTicket &&
          state.currentTicket._id === action.payload._id
        ) {
          state.currentTicket = action.payload;
        }
        state.updateSuccess = true;
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })

      // Generate QR code for ticket
      .addCase(generateTicketQRCode.pending, (state) => {
        state.qrCodeLoading = true;
        state.error = null;
      })
      .addCase(generateTicketQRCode.fulfilled, (state, action) => {
        state.qrCodeLoading = false;
        state.qrCode = action.payload.qrCode;
      })
      .addCase(generateTicketQRCode.rejected, (state, action) => {
        state.qrCodeLoading = false;
        state.error = action.payload;
      })

      // Download ticket PDF
      .addCase(downloadTicketPDF.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.downloadSuccess = false;
      })
      .addCase(downloadTicketPDF.fulfilled, (state) => {
        state.loading = false;
        state.downloadSuccess = true;
      })
      .addCase(downloadTicketPDF.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.downloadSuccess = false;
      })

      // Get ticket statistics
      .addCase(getTicketStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTicketStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getTicketStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Validate ticket
      .addCase(validateTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.validationResult = action.payload;
      })
      .addCase(validateTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearTicketsErrors,
  clearCurrentTicket,
  resetPurchaseSuccess,
  resetCancelSuccess,
  resetUpdateSuccess,
  resetDownloadSuccess,
  clearQRCode,
  clearValidationResult,
} = ticketsSlice.actions;

// Export reducer
export default ticketsSlice.reducer;
