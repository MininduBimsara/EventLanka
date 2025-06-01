// thunks/orderThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import OrderAPI from "../api/orderApi";

// Async thunk for creating a new order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const data = await OrderAPI.createOrder(orderData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);

// Async thunk for fetching all orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const data = await OrderAPI.fetchOrders();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// Async thunk for fetching a specific order by ID
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await OrderAPI.fetchOrderById(orderId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order details"
      );
    }
  }
);

// Async thunk for cancelling an order
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await OrderAPI.cancelOrder(orderId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel order"
      );
    }
  }
);

// Async thunk for updating an order
export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ orderId, orderData }, { rejectWithValue }) => {
    try {
      const data = await OrderAPI.updateOrder(orderId, orderData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order"
      );
    }
  }
);

// Async thunk for deleting an order
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const orderId = await OrderAPI.deleteOrder(orderId);
      return orderId; // Return the ID to remove it from state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete order"
      );
    }
  }
);

// Async thunk for getting order statistics
export const getOrderStats = createAsyncThunk(
  "orders/getOrderStats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await OrderAPI.getOrderStats();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order statistics"
      );
    }
  }
);

// Async thunk for getting orders by status
export const getOrdersByStatus = createAsyncThunk(
  "orders/getOrdersByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const data = await OrderAPI.getOrdersByStatus(status);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders by status"
      );
    }
  }
);

// Async thunk for getting order summary
export const getOrderSummary = createAsyncThunk(
  "orders/getOrderSummary",
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await OrderAPI.getOrderSummary(orderId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order summary"
      );
    }
  }
);

// Async thunk for applying discount
export const applyDiscount = createAsyncThunk(
  "orders/applyDiscount",
  async ({ orderId, discountCode }, { rejectWithValue }) => {
    try {
      const data = await OrderAPI.applyDiscount(orderId, discountCode);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to apply discount"
      );
    }
  }
);

// Async thunk for getting order history
export const getOrderHistory = createAsyncThunk(
  "orders/getOrderHistory",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const data = await OrderAPI.getOrderHistory(page, limit);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order history"
      );
    }
  }
);

// Async thunk for exporting orders
export const exportOrders = createAsyncThunk(
  "orders/exportOrders",
  async ({ format = "pdf", orderIds = [] }, { rejectWithValue }) => {
    try {
      const result = await OrderAPI.exportOrders(format, orderIds);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to export orders"
      );
    }
  }
);

// Async thunk for generating QR code for a ticket
export const generateTicketQRCode = createAsyncThunk(
  "orders/generateTicketQRCode",
  async (ticketId, { rejectWithValue }) => {
    try {
      // This would need to be added to OrderAPI if you want to use it
      const response = await axios.get(
        `http://localhost:5000/api/tickets/${ticketId}/qrcode`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate QR code"
      );
    }
  }
);

// Async thunk for downloading ticket as PDF
export const downloadTicketPDF = createAsyncThunk(
  "orders/downloadTicketPDF",
  async (ticketId, { rejectWithValue }) => {
    try {
      // This would need to be added to OrderAPI if you want to use it
      window.open(
        `http://localhost:5000/api/tickets/${ticketId}/download/pdf`,
        "_blank"
      );
      return { ticketId, success: true };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to download ticket"
      );
    }
  }
);
