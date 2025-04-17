import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for payment API endpoints
const PAYMENT_API_URL = "/api/payments";

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

// Initial state for the payments slice
const initialState = {
  paymentHistory: [],
  currentPayment: null,
  loading: false,
  error: null,
  success: false,
  message: "",
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
    },
    // Clear the current payment data
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

// Export actions
export const { resetPaymentStatus, clearCurrentPayment } = paymentSlice.actions;

// Export reducer
export default paymentSlice.reducer;
