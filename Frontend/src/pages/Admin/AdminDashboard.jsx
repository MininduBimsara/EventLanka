import React, { useState, useEffect } from "react";
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

const AdminDashboard = () => {
  // Sample data - in a real app, you would fetch this from your API
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 15423,
    totalOrganizers: 782,
    totalEvents: 1205,
    totalTickets: 34892,
    totalRevenue: 548750,
    pendingApprovals: 23,
    refundRequests: 15,
  });

  const [revenueData, setRevenueData] = useState([
    { month: "Jan", revenue: 42000 },
    { month: "Feb", revenue: 48000 },
    { month: "Mar", revenue: 51000 },
    { month: "Apr", revenue: 58000 },
    { month: "May", revenue: 63000 },
    { month: "Jun", revenue: 72000 },
    { month: "Jul", revenue: 79000 },
    { month: "Aug", revenue: 85000 },
    { month: "Sep", revenue: 54750 },
    { month: "Oct", revenue: 0 },
    { month: "Nov", revenue: 0 },
    { month: "Dec", revenue: 0 },
  ]);

  const [ticketData, setTicketData] = useState([
    { category: "Music", tickets: 14200 },
    { category: "Business", tickets: 8670 },
    { category: "Sports", tickets: 6523 },
    { category: "Food", tickets: 3200 },
    { category: "Arts", tickets: 2299 },
  ]);

  const [signupData, setSignupData] = useState([
    { month: "Jan", users: 1203 },
    { month: "Feb", users: 1350 },
    { month: "Mar", users: 1458 },
    { month: "Apr", users: 1589 },
    { month: "May", users: 1645 },
    { month: "Jun", users: 1720 },
    { month: "Jul", users: 1890 },
    { month: "Aug", users: 2103 },
    { month: "Sep", users: 2465 },
    { month: "Oct", users: 0 },
    { month: "Nov", users: 0 },
    { month: "Dec", users: 0 },
  ]);

  // Mock data loading
  useEffect(() => {
    // In a real app, you would fetch data here
    console.log("Dashboard data would be fetched on component mount");
  }, []);

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
          value={formatNumber(dashboardData.totalUsers)}
          icon={<Users className="text-blue-500" />}
          color="bg-blue-100"
        />
        <DashboardCard
          title="Total Organizers"
          value={formatNumber(dashboardData.totalOrganizers)}
          icon={<Users className="text-green-500" />}
          color="bg-green-100"
        />
        <DashboardCard
          title="Total Events"
          value={formatNumber(dashboardData.totalEvents)}
          icon={<Calendar className="text-purple-500" />}
          color="bg-purple-100"
        />
        <DashboardCard
          title="Total Tickets Sold"
          value={formatNumber(dashboardData.totalTickets)}
          icon={<ShoppingBag className="text-yellow-500" />}
          color="bg-yellow-100"
        />
        <DashboardCard
          title="Total Revenue"
          value={formatCurrency(dashboardData.totalRevenue)}
          icon={<DollarSign className="text-emerald-500" />}
          color="bg-emerald-100"
        />
        <DashboardCard
          title="Pending Approvals"
          value={dashboardData.pendingApprovals}
          icon={<Clock className="text-orange-500" />}
          color="bg-orange-100"
        />
        <DashboardCard
          title="Active Refund Requests"
          value={dashboardData.refundRequests}
          icon={<RefreshCw className="text-red-500" />}
          color="bg-red-100"
        />
        <div className="flex items-center justify-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">Quick Actions</span>
            <div className="flex gap-2 mt-2">
              <button className="p-2 text-xs text-white bg-blue-500 rounded-md">
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
              <LineChart data={revenueData}>
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
          <h2 className="mb-4 text-lg font-semibold">
            Ticket Sales by Category
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip
                  formatter={(value) => [
                    `${value.toLocaleString()} tickets`,
                    "Sales",
                  ]}
                />
                <Legend />
                <Bar dataKey="tickets" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">New User Signups</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={signupData}>
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
            onClick={() => console.log("Navigating to pending events")}
            icon={<Clock size={20} />}
          />
          <ActionButton
            text="Manage Users"
            color="bg-green-500"
            onClick={() => console.log("Navigating to user management")}
            icon={<Users size={20} />}
          />
          <ActionButton
            text="Monitor Transactions"
            color="bg-purple-500"
            onClick={() => console.log("Navigating to transactions")}
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
