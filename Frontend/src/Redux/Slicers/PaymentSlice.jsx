// slices/paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PaymentAPI from "../api/paymentApi";

// Async thunk for creating a payment intent (now preparing PayPal payment)
export const createPaymentIntent = createAsyncThunk(
  "payments/createIntent",
  async (orderId, { rejectWithValue }) => {
    try {
      // Get the pending order from localStorage to include the amount
      let amount = 0;
      const storedOrder = localStorage.getItem("pendingOrder");
      if (storedOrder) {
        try {
          const parsedOrder = JSON.parse(storedOrder);
          amount = parsedOrder.totalAmount;
        } catch (error) {
          console.error("Error parsing stored order:", error);
        }
      }

      const data = await PaymentAPI.createPayPalOrder(orderId, amount);
      return data;
    } catch (error) {
      console.error("PayPal order creation error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to prepare payment"
      );
    }
  }
);

// Async thunk for capturing a PayPal order after user approval
export const capturePayPalOrder = createAsyncThunk(
  "payments/capturePayPal",
  async ({ orderId, paypalOrderId }, { rejectWithValue }) => {
    try {
      const data = await PaymentAPI.capturePayPalOrder(orderId, paypalOrderId);
      return data;
    } catch (error) {
      console.error("PayPal capture error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to capture PayPal payment"
      );
    }
  }
);

// Async thunk for processing a payment
export const processPayment = createAsyncThunk(
  "payments/process",
  async (paymentData, { rejectWithValue }) => {
    try {
      const data = await PaymentAPI.processPayment(paymentData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Payment processing failed"
      );
    }
  }
);

// Async thunk for confirming a payment after PayPal processing
export const confirmPayment = createAsyncThunk(
  "payments/confirm",
  async ({ paymentIntentId, orderId }, { rejectWithValue }) => {
    try {
      const data = await PaymentAPI.confirmPayment(paymentIntentId, orderId);
      return data;
    } catch (error) {
      console.error("Payment confirmation error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Payment confirmation failed"
      );
    }
  }
);

// Async thunk for fetching payment history
export const fetchPaymentHistory = createAsyncThunk(
  "payments/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const data = await PaymentAPI.fetchPaymentHistory();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payment history"
      );
    }
  }
);

// Async thunk for downloading receipt
export const downloadReceipt = createAsyncThunk(
  "payments/downloadReceipt",
  async (transactionId, { rejectWithValue }) => {
    try {
      const result = await PaymentAPI.downloadReceipt(transactionId);
      return result;
    } catch (error) {
      console.error("Receipt download error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to download receipt"
      );
    }
  }
);

// Async thunk for checking a specific payment status
export const checkPaymentStatus = createAsyncThunk(
  "payments/checkStatus",
  async ({ paymentIntentId, orderId }, { rejectWithValue }) => {
    try {
      const data = await PaymentAPI.checkPaymentStatus(
        paymentIntentId,
        orderId
      );
      return data;
    } catch (error) {
      console.error("Payment status check error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to check payment status"
      );
    }
  }
);

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
} = paymentSlice.actions;

// Export reducer
export default paymentSlice.reducer;
