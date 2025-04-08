import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, Download, FileText, Filter } from "lucide-react";

const Reports = () => {
  // State for filters
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 6))
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data - in a real app, this would be fetched from an API
  const revenueData = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Apr", revenue: 61000 },
    { month: "May", revenue: 55000 },
    { month: "Jun", revenue: 67000 },
    { month: "Jul", revenue: 72000 },
    { month: "Aug", revenue: 78000 },
    { month: "Sep", revenue: 69000 },
    { month: "Oct", revenue: 85000 },
    { month: "Nov", revenue: 94000 },
    { month: "Dec", revenue: 115000 },
  ];

  const categoryData = [
    { name: "Music", value: 35 },
    { name: "Business", value: 25 },
    { name: "Food", value: 20 },
    { name: "Tech", value: 15 },
    { name: "Sports", value: 5 },
  ];

  const bestSellingEvents = [
    { id: 1, name: "Summer Music Festival", sales: 3245, revenue: 259600 },
    { id: 2, name: "Tech Conference 2025", sales: 2876, revenue: 431400 },
    { id: 3, name: "Food & Wine Expo", sales: 2543, revenue: 127150 },
    { id: 4, name: "Business Leadership Summit", sales: 2187, revenue: 328050 },
    { id: 5, name: "Marathon Charity Run", sales: 1953, revenue: 58590 },
  ];

  const topOrganizers = [
    { id: 1, name: "EventMasters Inc.", eventCount: 32, totalRevenue: 845000 },
    { id: 2, name: "Conference Pros", eventCount: 28, totalRevenue: 712500 },
    { id: 3, name: "Festival Group", eventCount: 24, totalRevenue: 632000 },
    { id: 4, name: "Summit Organizers", eventCount: 18, totalRevenue: 427000 },
    {
      id: 5,
      name: "Community Events Co.",
      eventCount: 15,
      totalRevenue: 385000,
    },
  ];

  const userGrowthData = [
    { month: "Jan", users: 850 },
    { month: "Feb", users: 940 },
    { month: "Mar", users: 1050 },
    { month: "Apr", users: 1250 },
    { month: "May", users: 1480 },
    { month: "Jun", users: 1650 },
    { month: "Jul", users: 1850 },
    { month: "Aug", users: 2100 },
    { month: "Sep", users: 2450 },
    { month: "Oct", users: 2720 },
    { month: "Nov", users: 3050 },
    { month: "Dec", users: 3400 },
  ];

  // colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Simulate loading data
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle date range change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  // Handle export
  const handleExport = (format) => {
    alert(`Exporting data in ${format} format...`);
    // Actual implementation would generate and download the file
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Analytics Dashboard
          </h1>
          <p className="text-gray-500">
            Platform-wide insights and performance metrics
          </p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col items-start justify-between gap-4 p-4 bg-white border-b md:flex-row md:items-center">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Date Range:</span>
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              name="start"
              value={dateRange.start}
              onChange={handleDateChange}
              className="px-2 py-1 text-sm border rounded"
            />
            <span className="text-gray-600">to</span>
            <input
              type="date"
              name="end"
              value={dateRange.end}
              onChange={handleDateChange}
              className="px-2 py-1 text-sm border rounded"
            />
          </div>
          <button className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">
            <Filter size={14} />
            <span>More Filters</span>
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport("pdf")}
            className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            <FileText size={14} />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport("csv")}
            className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="flex overflow-x-auto">
          <button
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "overview"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "revenue"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("revenue")}
          >
            Revenue
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "events"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("events")}
          >
            Events
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "organizers"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("organizers")}
          >
            Organizers
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "users"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("users")}
          >
            User Growth
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Revenue Overview */}
                <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="mb-4 text-lg font-semibold">Revenue Trend</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Bar dataKey="revenue" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Popular Categories */}
                <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="mb-4 text-lg font-semibold">
                    Popular Event Categories
                  </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {categoryData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* User Growth */}
                <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="mb-4 text-lg font-semibold">User Growth</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="users"
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Best Selling Events */}
                <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="mb-4 text-lg font-semibold">
                    Best Selling Events
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Event
                          </th>
                          <th className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                            Sales
                          </th>
                          <th className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                            Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bestSellingEvents.map((event) => (
                          <tr key={event.id}>
                            <td className="px-3 py-2 text-sm text-gray-900">
                              {event.name}
                            </td>
                            <td className="px-3 py-2 text-sm text-right text-gray-900">
                              {event.sales.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-sm text-right text-gray-900">
                              ${event.revenue.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "revenue" && (
              <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="mb-6 text-xl font-semibold">Revenue Analysis</h2>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        name="Monthly Revenue"
                        fill="#3b82f6"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-blue-50">
                    <h3 className="text-sm font-medium text-blue-800">
                      Total Revenue
                    </h3>
                    <p className="text-2xl font-bold text-blue-900">$841,000</p>
                    <p className="mt-1 text-sm text-blue-600">
                      +12.5% from previous period
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50">
                    <h3 className="text-sm font-medium text-green-800">
                      Average Per Event
                    </h3>
                    <p className="text-2xl font-bold text-green-900">$7,210</p>
                    <p className="mt-1 text-sm text-green-600">
                      +5.2% from previous period
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-50">
                    <h3 className="text-sm font-medium text-purple-800">
                      Projected Year-End
                    </h3>
                    <p className="text-2xl font-bold text-purple-900">$1.2M</p>
                    <p className="mt-1 text-sm text-purple-600">
                      Based on current growth rate
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "events" && (
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="mb-6 text-xl font-semibold">
                    Event Categories
                  </h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {categoryData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="mb-6 text-xl font-semibold">
                    Best Selling Events
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Event Name
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                            Tickets Sold
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                            Total Revenue
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                            Average Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bestSellingEvents.map((event) => (
                          <tr key={event.id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {event.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-gray-500">
                              {event.sales.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-gray-500">
                              ${event.revenue.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-gray-500">
                              ${(event.revenue / event.sales).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "organizers" && (
              <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="mb-6 text-xl font-semibold">Top Organizers</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Organizer
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                          Events
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                          Total Revenue
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                          Avg. Revenue Per Event
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {topOrganizers.map((organizer) => (
                        <tr key={organizer.id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {organizer.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-500">
                            {organizer.eventCount}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-500">
                            ${organizer.totalRevenue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-500">
                            $
                            {(
                              organizer.totalRevenue / organizer.eventCount
                            ).toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-medium">
                    Organizer Performance
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topOrganizers}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip
                          formatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Legend />
                        <Bar
                          dataKey="totalRevenue"
                          name="Total Revenue"
                          fill="#8884d8"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="mb-6 text-xl font-semibold">
                    User Growth Trends
                  </h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="users"
                          name="New Users"
                          stroke="#8884d8"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="mb-2 text-lg font-medium">Total Users</h3>
                    <p className="text-3xl font-bold text-blue-600">18,740</p>
                    <p className="mt-1 text-sm text-gray-500">
                      +23% growth YoY
                    </p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="mb-2 text-lg font-medium">Active Users</h3>
                    <p className="text-3xl font-bold text-green-600">12,355</p>
                    <p className="mt-1 text-sm text-gray-500">
                      66% of total user base
                    </p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="mb-2 text-lg font-medium">Avg. Retention</h3>
                    <p className="text-3xl font-bold text-purple-600">72%</p>
                    <p className="mt-1 text-sm text-gray-500">
                      +5% from previous period
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
