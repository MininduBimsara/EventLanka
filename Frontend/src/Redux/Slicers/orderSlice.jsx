// slices/orderSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createOrder,
  fetchOrders,
  fetchOrderById,
  cancelOrder,
  updateOrder,
  deleteOrder,
  getOrderStats,
  getOrdersByStatus,
  getOrderSummary,
  applyDiscount,
  getOrderHistory,
  exportOrders,
  generateTicketQRCode,
  downloadTicketPDF,
} from "../thunks/orderThunks";

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

    resetDownloadSuccess(state) {
      state.downloadSuccess = false;
    },

    // Reset all success flags at once
    resetAllOrderSuccessFlags(state) {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.cancelSuccess = false;
      state.discountApplied = false;
      state.exportSuccess = false;
      state.downloadSuccess = false;
    },

    // Clear QR code
    clearQRCode(state) {
      state.qrCode = null;
    },

    // Clear order stats
    clearOrderStats(state) {
      state.orderStats = null;
    },

    // Clear order history
    clearOrderHistory(state) {
      state.orderHistory = null;
    },

    // Clear order summary
    clearOrderSummary(state) {
      state.orderSummary = null;
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
  resetDownloadSuccess,
  resetAllOrderSuccessFlags,
  clearQRCode,
  clearOrderStats,
  clearOrderHistory,
  clearOrderSummary,
} = ordersSlice.actions;

// Export reducer
export default ordersSlice.reducer;
