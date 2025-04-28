import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for payment API endpoints
const PAYMENT_API_URL = "http://localhost:5000/api/payments";

// Set default axios config
axios.defaults.withCredentials = true;

// Async thunk for creating a payment intent (now preparing PayPal payment)
export const createPaymentIntent = createAsyncThunk(
  "payments/createIntent",
  async (orderId, { rejectWithValue }) => {
    try {
      console.log("Creating PayPal order for orderId:", orderId);
      const response = await axios.post(
        `${PAYMENT_API_URL}/capture-paypal-order`,
        { orderId }
      );
      console.log("PayPal order creation response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "PayPal order creation error:",
        error.response?.data || error
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to prepare payment"
      );
    }
  }
);

// Async thunk for processing a payment
export const processPayment = createAsyncThunk(
  "payments/process",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${PAYMENT_API_URL}/process`,
        paymentData
      );
      return response.data;
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
      console.log("Confirming payment:", { paymentIntentId, orderId });
      const response = await axios.post(`${PAYMENT_API_URL}/confirm`, {
        paypalOrderId: paymentIntentId,
        orderId,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Payment confirmation error:",
        error.response?.data || error
      );
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
      const response = await axios.get(`${PAYMENT_API_URL}/history`);
      return response.data;
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
      // Use window.open approach instead of the blob method
      window.open(`${PAYMENT_API_URL}/receipt/${transactionId}`, "_blank");
      return { success: true, transactionId };
    } catch (error) {
      console.error("Receipt download error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to download receipt"
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
          state.paymentHistory.unshift(action.payload); // Add to beginning of array
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
          state.paymentHistory.unshift(action.payload); // Add to beginning of array
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
