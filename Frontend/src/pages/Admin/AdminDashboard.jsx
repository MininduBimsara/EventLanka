import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Calendar,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Clock,
} from "lucide-react";
import { fetchDashboardStats } from "../../Redux/Thunks/adminThunks";
import { clearAdminErrors } from "../../Redux/Slicers/adminSlice"; // Import the clear errors action
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/Common/Notification/ToastContext";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const hasShownErrorRef = useRef(false); // Track if we've already shown error for this session

  // More defensive selector - handle different possible state structures
  const adminState = useSelector((state) => state.admin);
  const dashboardStats =
    adminState?.dashboard?.stats || adminState?.stats || null;
  const loading =
    adminState?.dashboard?.loading || adminState?.loading || false;
  const error = adminState?.dashboard?.error || adminState?.error || null;

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearAdminErrors());
    hasShownErrorRef.current = false;
  }, [dispatch]);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchDashboardStats());
        // Clear any previous errors on successful fetch
        dispatch(clearAdminErrors());
        hasShownErrorRef.current = false;
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        if (toast && !hasShownErrorRef.current) {
          toast.error("Failed to load dashboard data");
          hasShownErrorRef.current = true;
        }
      }
    };

    fetchData();
  }, [dispatch, toast]);

  // Modified error handling - only show toast if we don't have data AND haven't shown error yet
  useEffect(() => {
    if (error && !dashboardStats && toast && !hasShownErrorRef.current) {
      toast.error("Dashboard data failed to load");
      hasShownErrorRef.current = true;
    }
  }, [error, dashboardStats, toast]);

  // Format currency with null checks
  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Format numbers with commas with null checks
  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0";
    return new Intl.NumberFormat("en-US").format(value);
  };

  // Prepare chart data from API response with better error handling
  const prepareRevenueData = () => {
    if (
      !dashboardStats?.charts?.monthlySales ||
      !Array.isArray(dashboardStats.charts.monthlySales)
    ) {
      return [];
    }

    return dashboardStats.charts.monthlySales.map((item) => {
      try {
        const date = new Date(item._id + "-01");
        return {
          month: date.toLocaleString("default", { month: "short" }),
          revenue: item.revenue || 0,
          sales: item.sales || 0,
        };
      } catch (err) {
        console.error("Error processing revenue data:", err);
        return {
          month: item._id || "Unknown",
          revenue: item.revenue || 0,
          sales: item.sales || 0,
        };
      }
    });
  };

  const prepareSignupData = () => {
    if (
      !dashboardStats?.charts?.newUserGrowth ||
      !Array.isArray(dashboardStats.charts.newUserGrowth)
    ) {
      return [];
    }

    return dashboardStats.charts.newUserGrowth.map((item) => {
      try {
        const date = new Date(item._id + "-01");
        return {
          month: date.toLocaleString("default", { month: "short" }),
          users: item.count || 0,
        };
      } catch (err) {
        console.error("Error processing signup data:", err);
        return {
          month: item._id || "Unknown",
          users: item.count || 0,
        };
      }
    });
  };

  // Handle retry with better error handling
  const handleRetry = async () => {
    try {
      dispatch(clearAdminErrors()); // Clear errors before retry
      hasShownErrorRef.current = false;
      await dispatch(fetchDashboardStats());
      if (toast) {
        toast.success("Dashboard data refreshed successfully");
      }
    } catch (err) {
      console.error("Retry failed:", err);
      if (toast && !hasShownErrorRef.current) {
        toast.error("Failed to refresh dashboard data");
        hasShownErrorRef.current = true;
      }
    }
  };

  // Loading state
  if (loading && !dashboardStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 mb-4 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-gray-700">
            Loading dashboard data...
          </div>
        </div>
      </div>
    );
  }

  // Error state - but still show dashboard if we have cached data
  if (error && !dashboardStats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="mb-4 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <div className="mb-2 text-lg font-medium text-red-600">
            Error loading dashboard data
          </div>
          <div className="mb-4 text-sm text-gray-500">
            {error?.message || "An unexpected error occurred"}
          </div>
        </div>
        <button
          className="px-6 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
          onClick={handleRetry}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Show error banner only if there's an error AND we have data (stale data scenario) */}
      {error && dashboardStats && (
        <div className="p-4 mb-4 border border-yellow-200 rounded-lg bg-yellow-50">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
            <span className="text-yellow-800">
              Some data may be outdated. Last update failed.
            </span>
            <button
              className="px-3 py-1 ml-auto text-xs text-white bg-yellow-600 rounded"
              onClick={handleRetry}
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">
          Overview of your platform's performance and metrics
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Users"
          value={formatNumber(dashboardStats?.totalUsers)}
          icon={<Users className="text-blue-500" />}
          color="bg-blue-100"
        />
        <DashboardCard
          title="Total Organizers"
          value={formatNumber(dashboardStats?.totalOrganizers)}
          icon={<Users className="text-green-500" />}
          color="bg-green-100"
        />
        <DashboardCard
          title="Total Events"
          value={formatNumber(dashboardStats?.totalEvents)}
          icon={<Calendar className="text-purple-500" />}
          color="bg-purple-100"
        />
        <DashboardCard
          title="Total Revenue"
          value={formatCurrency(dashboardStats?.totalRevenue)}
          icon={<DollarSign className="text-emerald-500" />}
          color="bg-emerald-100"
        />
        <DashboardCard
          title="Pending Approvals"
          value={formatNumber(dashboardStats?.pendingEvents)}
          icon={<Clock className="text-orange-500" />}
          color="bg-orange-100"
        />
        <DashboardCard
          title="Active Refund Requests"
          value={formatNumber(dashboardStats?.activeRefundRequests)}
          icon={<RefreshCw className="text-red-500" />}
          color="bg-red-100"
        />
        <div className="flex items-center justify-center col-span-2 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">Quick Actions</span>
            <div className="flex gap-2 mt-2">
              <button
                className="p-2 text-xs text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
                onClick={handleRetry}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh Data"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Graphs */}
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Monthly Revenue</h2>
          <div className="h-64">
            {prepareRevenueData().length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prepareRevenueData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No revenue data available
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Monthly Ticket Sales</h2>
          <div className="h-64">
            {prepareRevenueData().length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareRevenueData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `${value.toLocaleString()} tickets`,
                      "Sales",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="sales" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No sales data available
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">New User Signups</h2>
          <div className="h-64">
            {prepareSignupData().length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prepareSignupData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `${value.toLocaleString()} users`,
                      "Signups",
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#10b981"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No signup data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links/Actions */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ActionButton
            text="View Pending Events"
            color="bg-blue-500"
            onClick={() => navigate("/admin/event-approvals")}
            icon={<Clock size={20} />}
          />
          <ActionButton
            text="Manage Users"
            color="bg-green-500"
            onClick={() => navigate("/admin/users")}
            icon={<Users size={20} />}
          />
          <ActionButton
            text="Monitor Transactions"
            color="bg-purple-500"
            onClick={() => navigate("/admin/transactions")}
            icon={<DollarSign size={20} />}
          />
        </div>
      </div>
    </div>
  );
};

// Card component for metrics
const DashboardCard = ({ title, value, icon, color }) => (
  <div
    className={`flex items-center p-6 rounded-lg border border-gray-200 bg-white shadow-sm`}
  >
    <div className={`p-3 rounded-full mr-4 ${color}`}>{icon}</div>
    <div>
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

// Action button component
const ActionButton = ({ text, color, onClick, icon }) => (
  <button
    className={`${color} hover:opacity-90 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors`}
    onClick={onClick}
  >
    {icon}
    <span>{text}</span>
  </button>
);

export default AdminDashboard;
