// slices/paymentSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createPaymentIntent,
  capturePayPalOrder,
  processPayment,
  confirmPayment,
  fetchPaymentHistory,
  downloadReceipt,
  checkPaymentStatus,
} from "../Thunks/paymentThunks";

// Initial state for the payments slice
const initialState = {
  paymentHistory: [],
  currentPayment: null,
  clientSecret: null,
  paymentIntentId: null,
  orderId: null,
  loading: false,
  intentLoading: false,
  error: null,
  success: false,
  message: "",
  downloading: false,
  statusChecking: false,
};

// Create the payments slice
const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    // Reset the payment status (useful after completing a payment)
    resetPaymentStatus: (state) => {
      state.success = false;
      state.error = null;
      state.message = "";
      state.currentPayment = null;
      state.clientSecret = null;
      state.paymentIntentId = null;
    },
    // Clear the current payment data
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    // Store payment intent ID from PayPal
    setPaymentIntentId: (state, action) => {
      state.paymentIntentId = action.payload;
    },
    // Store order ID for the current payment
    setOrderId: (state, action) => {
      state.orderId = action.payload;
    },
    // Clear all errors
    clearPaymentErrors: (state) => {
      state.error = null;
    },
    // Reset all success flags
    resetAllSuccessFlags: (state) => {
      state.success = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Payment Intent (PayPal preparation)
      .addCase(createPaymentIntent.pending, (state) => {
        state.intentLoading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.intentLoading = false;
        state.clientSecret = action.payload.clientSecret;
        state.success = true;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.intentLoading = false;
        state.error = action.payload;
      })

      // Capture PayPal Order
      .addCase(capturePayPalOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(capturePayPalOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
        // Add to payment history if not already there
        if (
          !state.paymentHistory.some(
            (payment) => payment._id === action.payload._id
          )
        ) {
          state.paymentHistory.unshift(action.payload);
        }
        state.success = true;
        state.message = "PayPal payment captured successfully";
      })
      .addCase(capturePayPalOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Process Payment
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
        // Add to payment history if not already there
        if (
          !state.paymentHistory.some(
            (payment) => payment._id === action.payload._id
          )
        ) {
          state.paymentHistory.unshift(action.payload);
        }
        state.success = true;
        state.message = "Payment processed successfully";
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Confirm Payment
      .addCase(confirmPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
        // Add to payment history if not already there
        if (
          !state.paymentHistory.some(
            (payment) => payment._id === action.payload._id
          )
        ) {
          state.paymentHistory.unshift(action.payload);
        }
        state.success = true;
        state.message = "Payment confirmed successfully";
        state.clientSecret = null;
        state.paymentIntentId = null;
        state.orderId = null;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Payment History
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentHistory = action.payload;
        state.success = true;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Payment Status
      .addCase(checkPaymentStatus.pending, (state) => {
        state.statusChecking = true;
        state.error = null;
      })
      .addCase(checkPaymentStatus.fulfilled, (state, action) => {
        state.statusChecking = false;
        // If payment exists and is successful
        if (action.payload.success) {
          state.currentPayment = action.payload.payment;
          state.success = true;
          state.message = "Payment verified successfully";
        } else {
          state.error = "Payment not found or incomplete";
        }
      })
      .addCase(checkPaymentStatus.rejected, (state, action) => {
        state.statusChecking = false;
        state.error = action.payload;
      })

      // Download Receipt
      .addCase(downloadReceipt.pending, (state) => {
        state.downloading = true;
        state.error = null;
      })
      .addCase(downloadReceipt.fulfilled, (state) => {
        state.downloading = false;
        state.success = true;
        state.message = "Receipt downloaded successfully";
      })
      .addCase(downloadReceipt.rejected, (state, action) => {
        state.downloading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  resetPaymentStatus,
  clearCurrentPayment,
  setPaymentIntentId,
  setOrderId,
  clearPaymentErrors,
  resetAllSuccessFlags,
} = paymentSlice.actions;

// Export reducer
export default paymentSlice.reducer;
