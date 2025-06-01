import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import OrderAPI from "./orderApi"; // Import the OrderAPI class

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

// Initial state for orders slice
const initialState = {
  orders: [],
  currentOrder: null,
  orderStats: null,
  orderHistory: null,
  orderSummary: null,
  loading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  cancelSuccess: false,
  discountApplied: false,
  exportSuccess: false,
  qrCode: null,
  qrCodeLoading: false,
  downloadSuccess: false,
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

    resetCancelSuccess(state) {
      state.cancelSuccess = false;
    },

    resetDiscountApplied(state) {
      state.discountApplied = false;
    },

    resetExportSuccess(state) {
      state.exportSuccess = false;
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
      })

      // Get order statistics
      .addCase(getOrderStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderStats.fulfilled, (state, action) => {
        state.loading = false;
        state.orderStats = action.payload;
      })
      .addCase(getOrderStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get orders by status
      .addCase(getOrdersByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrdersByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get order summary
      .addCase(getOrderSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.orderSummary = action.payload;
      })
      .addCase(getOrderSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Apply discount
      .addCase(applyDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.discountApplied = false;
      })
      .addCase(applyDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.discountApplied = true;
        // Update the order with discount applied
        if (action.payload.order) {
          state.orders = state.orders.map((order) =>
            order._id === action.payload.order._id
              ? action.payload.order
              : order
          );
          if (
            state.currentOrder &&
            state.currentOrder._id === action.payload.order._id
          ) {
            state.currentOrder = action.payload.order;
          }
        }
      })
      .addCase(applyDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.discountApplied = false;
      })

      // Get order history
      .addCase(getOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orderHistory = action.payload;
      })
      .addCase(getOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Export orders
      .addCase(exportOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.exportSuccess = false;
      })
      .addCase(exportOrders.fulfilled, (state) => {
        state.loading = false;
        state.exportSuccess = true;
      })
      .addCase(exportOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.exportSuccess = false;
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
  resetCancelSuccess,
  resetDiscountApplied,
  resetExportSuccess,
} = ordersSlice.actions;

// Export reducer
export default ordersSlice.reducer;
