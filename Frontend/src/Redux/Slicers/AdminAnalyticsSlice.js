import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define initial state
const initialState = {
  loading: false,
  error: null,
  data: {
    revenueData: [],
    categoryData: [],
    bestSellingEvents: [],
    topOrganizers: [],
    userGrowthData: [],
    statistics: {
      totalUsers: 0,
      activeUsers: 0,
      retentionRate: 0,
    },
  },
  filters: {
    dateRange: {
      start: new Date(new Date().setMonth(new Date().getMonth() - 6))
        .toISOString()
        .split("T")[0],
      end: new Date().toISOString().split("T")[0],
    },
  },
};

// Create async thunk for fetching analytics data
export const fetchAnalyticsData = createAsyncThunk(
  "analytics/fetchData",
  async (filters, { rejectWithValue }) => {
    try {
      const { dateRange } = filters || {};
      const params = {};

      if (dateRange?.start) params.startDate = dateRange.start;
      if (dateRange?.end) params.endDate = dateRange.end;

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        params,
      };

      const response = await axios.get("/api/admin/analytics", config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.error
          ? error.response.data.error
          : "Failed to fetch analytics data"
      );
    }
  }
);

// Create the slice
const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.filters.dateRange = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { setDateRange, resetFilters } = analyticsSlice.actions;
export default analyticsSlice.reducer;
