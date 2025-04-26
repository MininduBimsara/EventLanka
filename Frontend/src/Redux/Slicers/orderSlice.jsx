import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/orders"; // Orders API URL

// Set default axios config
axios.defaults.withCredentials = true;

// Async thunk for creating a new order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, orderData);
      return response.data;
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
      const response = await axios.get(API_URL);
      return response.data;
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
      const response = await axios.get(`${API_URL}/${orderId}`);
      return response.data;
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
      // Using PUT method based on your backend implementation
      const response = await axios.put(`${API_URL}/${orderId}/cancel`);
      return response.data;
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
      const response = await axios.put(`${API_URL}/${orderId}`, orderData);
      return response.data;
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
      await axios.delete(`${API_URL}/${orderId}`);
      return orderId; // Return the ID to remove it from state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete order"
      );
    }
  }
);

// Initial state for orders slice
const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Clear errors
    clearOrdersErrors(state) {
      state.error = null;
    },

    // Clear current order
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },

    // Reset success flags
    resetCreateSuccess(state) {
      state.createSuccess = false;
    },

    resetUpdateSuccess(state) {
      state.updateSuccess = false;
    },

    resetDeleteSuccess(state) {
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
        state.createSuccess = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })

      // Fetch all orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel an order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.cancelSuccess = false;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.cancelSuccess = true;
        // Update the order status in the orders array
        state.orders = state.orders.map((order) =>
          order._id === action.payload.order._id ? action.payload.order : order
        );
        // Also update currentOrder if it's the one we just cancelled
        if (
          state.currentOrder &&
          state.currentOrder._id === action.payload.order._id
        ) {
          state.currentOrder = action.payload.order;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.cancelSuccess = false;
      })

      // Update order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Update the order in the orders array
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
        // Also update currentOrder if it's the same order
        if (
          state.currentOrder &&
          state.currentOrder._id === action.payload._id
        ) {
          state.currentOrder = action.payload;
        }
        state.updateSuccess = true;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })

      // Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted order from the orders array
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
        // Clear currentOrder if it's the deleted order
        if (state.currentOrder && state.currentOrder._id === action.payload) {
          state.currentOrder = null;
        }
        state.deleteSuccess = true;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      });
  },
});

// Export actions
export const {
  clearOrdersErrors,
  clearCurrentOrder,
  resetCreateSuccess,
  resetUpdateSuccess,
  resetDeleteSuccess,
} = ordersSlice.actions;

// Export reducer
export default ordersSlice.reducer;
