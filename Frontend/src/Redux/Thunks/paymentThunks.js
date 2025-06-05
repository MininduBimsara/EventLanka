// thunks/paymentThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import PaymentAPI from "../../Api/Common/paymentApi";

// Async thunk for creating a payment intent (now preparing PayPal payment)
export const createPaymentIntent = createAsyncThunk(
  "payments/createIntent",
  async (orderId, { rejectWithValue }) => {
    try {
      // Get the pending order from localStorage to include the amount
      let amount = 0;
      let storedOrder = null;
      try {
        storedOrder = localStorage.getItem("pendingOrder");
      } catch (error) {
        console.warn("localStorage not available:", error);
      }
      if (storedOrder) {
        try {
          const parsedOrder = JSON.parse(storedOrder);
          amount = parsedOrder.totalAmount;
        } catch (error) {
          console.error("Error parsing stored order:", error);
        }
      }

      console.log("Creating PayPal order with:", { orderId, amount });

      const data = await PaymentAPI.createPayPalOrder(orderId, amount);
      console.log("PayPal order creation response:", data);

      return data;
    } catch (error) {
      console.error("PayPal order creation error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);

      return rejectWithValue({
        message: error.response?.data?.message || "Failed to prepare payment",
        status: error.response?.status,
        details: error.response?.data || error.message,
      });
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
