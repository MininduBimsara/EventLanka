import { createSlice } from "@reduxjs/toolkit";
import {
  buyTicket,
  fetchTickets,
  fetchTicketById,
  cancelTicket,
  generateTicketQRCode,
  downloadTicketPDF,
  updateTicket,
  getTicketStats,
  validateTicket,
} from "./ticketThunks";

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
