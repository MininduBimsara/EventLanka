import { createSlice } from "@reduxjs/toolkit";
import { fetchAnalyticsData, fetchUsersData } from "../thunks/analyticsThunks";

// Define initial state with sample data
const initialState = {
  loading: false,
  error: null,
  data: {
    revenueData: [
      { month: "Jan", revenue: 5000 },
      { month: "Feb", revenue: 7000 },
      { month: "Mar", revenue: 8500 },
      { month: "Apr", revenue: 6800 },
      { month: "May", revenue: 9200 },
      { month: "Jun", revenue: 10500 },
    ],
    categoryData: [
      { name: "Music", value: 35 },
      { name: "Sports", value: 25 },
      { name: "Business", value: 20 },
      { name: "Food", value: 15 },
      { name: "Art", value: 10 },
    ],
    bestSellingEvents: [
      { id: "1", name: "Annual Music Festival", sales: 230, revenue: 12500 },
      { id: "2", name: "Tech Conference 2025", sales: 180, revenue: 9000 },
      { id: "3", name: "City Marathon", sales: 150, revenue: 7500 },
      { id: "4", name: "Food & Wine Expo", sales: 120, revenue: 6000 },
      { id: "5", name: "Summer Art Exhibition", sales: 100, revenue: 5000 },
    ],
    topOrganizers: [
      { id: "1", name: "Sarah Johnson", eventCount: 12, totalRevenue: 68000 },
      { id: "2", name: "Michael Chen", eventCount: 8, totalRevenue: 42000 },
      { id: "3", name: "David Miller", eventCount: 6, totalRevenue: 31000 },
      { id: "4", name: "Jessica Wang", eventCount: 5, totalRevenue: 28000 },
      { id: "5", name: "Robert Brown", eventCount: 4, totalRevenue: 22000 },
    ],
    userGrowthData: [
      { month: "Jan", users: 120 },
      { month: "Feb", users: 250 },
      { month: "Mar", users: 380 },
      { month: "Apr", users: 450 },
      { month: "May", users: 550 },
      { month: "Jun", users: 680 },
    ],
    statistics: {
      totalUsers: 18740,
      activeUsers: 12355,
      retentionRate: 66,
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
  lastFetched: null,
};

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
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle analytics data fetching
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.loading = false;
        state.lastFetched = new Date().toISOString();

        // Skip processing if we received null (duplicate request)
        if (action.payload === null) {
          return;
        }

        // Check if action.payload has valid data
        if (action.payload) {
          Object.keys(action.payload).forEach((key) => {
            if (
              action.payload[key] &&
              (Array.isArray(action.payload[key])
                ? action.payload[key].length > 0
                : Object.keys(action.payload[key]).length > 0)
            ) {
              state.data[key] = action.payload[key];
            }
          });
        }
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Fetch analytics rejected:", action.payload);
      })
      // Handle users data fetching
      .addCase(fetchUsersData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.data.usersData = action.payload;
        }
      })
      .addCase(fetchUsersData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setDateRange, resetFilters, clearError } =
  analyticsSlice.actions;
export default analyticsSlice.reducer;
