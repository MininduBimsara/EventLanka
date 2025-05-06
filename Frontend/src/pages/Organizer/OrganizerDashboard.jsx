import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizerDashboard } from "../../Redux/Slicers/OrganizerSlice"; // Adjust the import path as needed
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  PlusCircle,
  List,
  AlertCircle,
  Tag,
  Trello,
} from "lucide-react";

const OrganizerDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, loading, error } = useSelector(
    (state) => state.organizer
  );

  // Fetch dashboard data when component mounts
  useEffect(() => {
    dispatch(getOrganizerDashboard());
  }, [dispatch]);

  // If loading, show a loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // If there's an error, show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
        <div className="p-4 text-center text-red-500 rounded-lg bg-red-50">
          <h2 className="mb-2 text-xl font-bold">Error Loading Dashboard</h2>
          <p>{error}</p>
          <button
            onClick={() => dispatch(getOrganizerDashboard())}
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If no data yet, show a placeholder
  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
        <div className="text-center text-gray-500">
          <h2 className="mb-2 text-xl font-bold">No Dashboard Data</h2>
          <button
            onClick={() => dispatch(getOrganizerDashboard())}
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Load Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Format data for the chart - with null checks
  const formatSalesData = () => {
    // If salesByEvent data exists and has elements
    if (dashboardData.salesByEvent && dashboardData.salesByEvent.length > 0) {
      // Map the last 6 events, or all if less than 6
      const events = dashboardData.salesByEvent.slice(0, 6);
      return events.map((event) => ({
        name: event.date
          ? new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : "Unknown",
        sales: event.count || 0,
      }));
    }

    // Fallback to empty array if no data
    return [];
  };

  const salesData = formatSalesData();

  // Calculate days until next event with null checks
  const getNextEventText = () => {
    if (
      dashboardData.upcomingEvents?.length > 0 &&
      dashboardData.upcomingEvents[0]?.date
    ) {
      const daysUntil = Math.ceil(
        (new Date(dashboardData.upcomingEvents[0].date) - new Date()) /
          (1000 * 60 * 60 * 24)
      );
      return `Next event in ${daysUntil} days`;
    }
    return "No upcoming events";
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Organizer Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's an overview of your events
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-600">Total Events</h2>
            <div className="p-2 bg-blue-100 rounded-full">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {dashboardData.totalEvents || 0}
          </p>
          <p className="mt-2 text-sm text-green-600">Active events</p>
        </div>

        <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-600">Tickets Sold</h2>
            <div className="p-2 bg-purple-100 rounded-full">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {dashboardData.ticketsSold || 0}
          </p>
          <p className="mt-2 text-sm text-green-600">Total attendees</p>
        </div>

        <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-600">Revenue</h2>
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            ${(dashboardData.totalRevenue || 0).toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-green-600">Total earnings</p>
        </div>

        <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-600">
              Upcoming Events
            </h2>
            <div className="p-2 bg-red-100 rounded-full">
              <Clock className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {dashboardData.upcomingEvents?.length || 0}
          </p>
          <p className="mt-2 text-sm text-blue-600">{getNextEventText()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
        {/* Recent Events */}
        <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Events
            </h2>
            <button className="text-sm text-blue-500 hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-left text-gray-500 border-b">
                  <th className="pb-3 font-medium">Event Name</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Tickets</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.upcomingEvents &&
                dashboardData.upcomingEvents.length > 0 ? (
                  dashboardData.upcomingEvents.map((event) => {
                    // Find sales data for this event if available
                    const eventSales = dashboardData.salesByEvent?.find(
                      (sale) => sale.title === event.title
                    ) || { count: 0 };

                    // Calculate total tickets from ticket types with null checks
                    const totalTickets =
                      event.ticketTypes?.reduce(
                        (sum, type) => sum + (type?.capacity || 0),
                        0
                      ) || 100; // Default to 100 if no data

                    return (
                      <tr
                        key={event.id || `event-${event.title}`}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 font-medium">
                          {event.title || "Unnamed Event"}
                        </td>
                        <td className="py-3 text-gray-600">
                          {event.date
                            ? new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Date not set"}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-full h-2 mr-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-blue-500 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    ((eventSales?.count || 0) / totalTickets) *
                                      100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {eventSales?.count || 0}/{totalTickets}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">
                      No upcoming events found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Sales
            </h2>
            <button className="text-sm text-blue-500 hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData.recentSales &&
            dashboardData.recentSales.length > 0 ? (
              dashboardData.recentSales.slice(0, 4).map((sale, index) => (
                <div
                  key={sale.id || `sale-${index}`}
                  className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                >
                  <div className="p-2 mr-3 bg-green-100 rounded-full">
                    <DollarSign className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {sale.eventTitle || "Unnamed Event"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {sale.customerName || "Anonymous"} -{" "}
                      {sale.purchaseDate
                        ? new Date(sale.purchaseDate).toLocaleDateString()
                        : "Unknown date"}
                    </p>
                    <p className="mt-1 text-xs font-medium text-green-600">
                      $
                      {typeof sale.price === "number"
                        ? sale.price.toFixed(2)
                        : "0.00"}{" "}
                      • {sale.quantity || 0} ticket(s)
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-4 text-sm text-center text-gray-500">
                No recent sales
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sales Snapshot */}
      <div className="p-6 mb-6 bg-white border border-gray-100 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Sales Snapshot
          </h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md">
              Weekly
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md">
              Monthly
            </button>
          </div>
        </div>
        <div className="h-64">
          {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No sales data available
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <button className="flex flex-col items-center justify-center p-4 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100">
            <div className="p-2 mb-2 bg-blue-100 rounded-full">
              <PlusCircle className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-blue-700">
              Create Event
            </span>
          </button>

          <button className="flex flex-col items-center justify-center p-4 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100">
            <div className="p-2 mb-2 bg-purple-100 rounded-full">
              <Trello className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-sm font-medium text-purple-700">
              Manage Events
            </span>
          </button>

          <button className="flex flex-col items-center justify-center p-4 transition-colors rounded-lg bg-green-50 hover:bg-green-100">
            <div className="p-2 mb-2 bg-green-100 rounded-full">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-sm font-medium text-green-700">
              View Attendees
            </span>
          </button>

          <button className="flex flex-col items-center justify-center p-4 transition-colors rounded-lg bg-yellow-50 hover:bg-yellow-100">
            <div className="p-2 mb-2 bg-yellow-100 rounded-full">
              <Tag className="w-5 h-5 text-yellow-500" />
            </div>
            <span className="text-sm font-medium text-yellow-700">
              Create Promo
            </span>
          </button>

          <button className="flex flex-col items-center justify-center p-4 transition-colors rounded-lg bg-red-50 hover:bg-red-100">
            <div className="p-2 mb-2 bg-red-100 rounded-full">
              <List className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-sm font-medium text-red-700">Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
