import React, { useEffect } from "react";
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
import { fetchDashboardStats } from "../../Redux/Slicers/adminSlice";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fix the selector to properly access the data from the Redux state
  const { stats: dashboardStats, loading } = useSelector(
    (state) => state.admin.dashboard
  );
  const error = useSelector((state) => state.admin.error);

  // Fetch dashboard data on component mount
  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Format numbers with commas
  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  // Prepare chart data from API response
  const prepareRevenueData = () => {
    if (!dashboardStats?.charts?.monthlySales) return [];

    return dashboardStats.charts.monthlySales.map((item) => ({
      month: new Date(item._id + "-01").toLocaleString("default", {
        month: "short",
      }),
      revenue: item.revenue,
      sales: item.sales,
    }));
  };

  const prepareSignupData = () => {
    if (!dashboardStats?.charts?.newUserGrowth) return [];

    return dashboardStats.charts.newUserGrowth.map((item) => ({
      month: new Date(item._id + "-01").toLocaleString("default", {
        month: "short",
      }),
      users: item.count,
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-medium text-gray-700">
          Loading dashboard data...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="mb-4 text-lg font-medium text-red-600">
          Error loading dashboard data
        </div>
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded-md"
          onClick={() => dispatch(fetchDashboardStats())}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
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
          value={formatNumber(dashboardStats?.totalUsers || 0)}
          icon={<Users className="text-blue-500" />}
          color="bg-blue-100"
        />
        <DashboardCard
          title="Total Organizers"
          value={formatNumber(dashboardStats?.totalOrganizers || 0)}
          icon={<Users className="text-green-500" />}
          color="bg-green-100"
        />
        <DashboardCard
          title="Total Events"
          value={formatNumber(dashboardStats?.totalEvents || 0)}
          icon={<Calendar className="text-purple-500" />}
          color="bg-purple-100"
        />
        <DashboardCard
          title="Total Revenue"
          value={formatCurrency(dashboardStats?.totalRevenue || 0)}
          icon={<DollarSign className="text-emerald-500" />}
          color="bg-emerald-100"
        />
        <DashboardCard
          title="Pending Approvals"
          value={dashboardStats?.pendingEvents || 0}
          icon={<Clock className="text-orange-500" />}
          color="bg-orange-100"
        />
        <DashboardCard
          title="Active Refund Requests"
          value={dashboardStats?.activeRefundRequests || 0}
          icon={<RefreshCw className="text-red-500" />}
          color="bg-red-100"
        />
        <div className="flex items-center justify-center col-span-2 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">Quick Actions</span>
            <div className="flex gap-2 mt-2">
              <button
                className="p-2 text-xs text-white bg-blue-500 rounded-md"
                onClick={() => dispatch(fetchDashboardStats())}
              >
                Refresh Data
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
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Monthly Ticket Sales</h2>
          <div className="h-64">
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
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">New User Signups</h2>
          <div className="h-64">
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
