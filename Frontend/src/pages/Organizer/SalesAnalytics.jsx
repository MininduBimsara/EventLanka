import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  BarChart,
  PieChart,
  ResponsiveContainer,
  Line,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { Download, Calendar, Filter, BarChart3 } from "lucide-react";
import {
  getSalesAnalytics,
  getSalesByPeriod,
  getEventSales,
} from "../../Redux/Slicers/OrganizerSlice";

export default function SalesAnalytics() {
  const dispatch = useDispatch();
  const { salesAnalytics, periodSales, eventSales, events, loading, error } =
    useSelector((state) => state.organizer);

  const [timeFilter, setTimeFilter] = useState("month");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [viewMode, setViewMode] = useState("overview");
  const [selectedEventId, setSelectedEventId] = useState(null);

  // COLORS for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  useEffect(() => {
    // Fetch analytics data on component mount
    dispatch(getSalesAnalytics());
  }, [dispatch]);

  useEffect(() => {
    // When time filter changes, update date range and fetch sales by period
    const now = new Date();
    let startDate = null;

    if (timeFilter === "week") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    } else if (timeFilter === "month") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 30);
    }

    if (startDate) {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = now.toISOString().split("T")[0];

      setDateRange({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });

      dispatch(
        getSalesByPeriod({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        })
      );
    }
  }, [timeFilter, dispatch]);

  useEffect(() => {
    // Initialize selected events when salesAnalytics data is loaded
    if (salesAnalytics && salesAnalytics.popularEvents) {
      // Take the top 2 popular events initially
      const topEventIds = salesAnalytics.popularEvents
        .slice(0, 2)
        .map((event) => event.eventId);

      setSelectedEvents(topEventIds);
    }
  }, [salesAnalytics]);

  useEffect(() => {
    // Fetch data for a specific event when selected
    if (selectedEventId) {
      dispatch(getEventSales(selectedEventId));
    }
  }, [selectedEventId, dispatch]);

  // Prepare revenue data for chart
  const prepareRevenueData = () => {
    if (!periodSales || !periodSales.salesByDay) return [];

    return Object.entries(periodSales.salesByDay)
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Prepare events data for chart
  const prepareEventsData = () => {
    if (!periodSales || !periodSales.salesByEvent) return [];

    return Object.entries(periodSales.salesByEvent).map(([eventId, data]) => ({
      eventId,
      name: data.eventTitle,
      ticketsSold: data.count,
      earnings: data.revenue,
    }));
  };

  // Calculate ticket type data (VIP vs General)
  const calculateTicketTypeData = () => {
    if (!salesAnalytics) return [];

    // This is a placeholder. In a real implementation, you'd use actual VIP vs General ticket data
    const totalTickets = salesAnalytics.totalTicketsSold || 0;
    const vipEstimate = Math.round(totalTickets * 0.2);
    const generalEstimate = totalTickets - vipEstimate;

    return [
      { name: "VIP Tickets", value: vipEstimate, id: "vip" },
      { name: "General Tickets", value: generalEstimate, id: "general" },
    ];
  };

  const handleExportChart = (chartType) => {
    // In a real implementation, this would capture and download the chart as image/PDF
    alert(`Exporting ${chartType} chart...`);
  };

  const toggleEventSelection = (eventId) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter((id) => id !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  // Get filtered events based on selection
  const getFilteredEvents = () => {
    if (!periodSales || !periodSales.salesByEvent) return [];

    const eventsData = prepareEventsData();

    if (viewMode === "overview") {
      return eventsData;
    } else {
      return eventsData.filter((event) =>
        selectedEvents.includes(event.eventId)
      );
    }
  };

  // Handle custom date range
  const handleCustomDateRange = () => {
    // This would open a date picker in a real implementation
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    const startDate = threeMonthsAgo.toISOString().split("T")[0];
    const endDate = now.toISOString().split("T")[0];

    setDateRange({ startDate, endDate });
    dispatch(getSalesByPeriod({ startDate, endDate }));
    setTimeFilter("custom");
  };

  // Prepare sales over time data
  const prepareSalesOverTimeData = () => {
    if (!salesAnalytics || !salesAnalytics.salesOverTime) return [];

    return Object.entries(salesAnalytics.salesOverTime)
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        tickets: data.tickets,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  // Create mock data for testing when real data isn't available
  const getMockData = () => {
    if (
      !loading &&
      (!salesAnalytics || Object.keys(salesAnalytics).length === 0)
    ) {
      return {
        totalRevenue: 12500,
        totalTicketsSold: 250,
        totalEvents: 5,
        totalCustomers: 200,
        popularEvents: [
          {
            eventId: "1",
            eventTitle: "Summer Festival",
            ticketsSold: 120,
            revenue: 6000,
          },
          {
            eventId: "2",
            eventTitle: "Tech Conference",
            ticketsSold: 80,
            revenue: 4000,
          },
          {
            eventId: "3",
            eventTitle: "Music Concert",
            ticketsSold: 50,
            revenue: 2500,
          },
        ],
        customerRetention: {
          singlePurchase: 150,
          multiplePurchases: 50,
        },
        salesOverTime: {
          "2024-12": { tickets: 80, revenue: 4000 },
          "2025-01": { tickets: 70, revenue: 3500 },
          "2025-02": { tickets: 100, revenue: 5000 },
        },
      };
    }
    return salesAnalytics;
  };

  const getMockPeriodData = () => {
    if (!loading && (!periodSales || Object.keys(periodSales).length === 0)) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const dayBefore = new Date(today);
      dayBefore.setDate(dayBefore.getDate() - 2);

      return {
        startDate: "30 days ago",
        endDate: "Today",
        totalSales: 12500,
        ticketsSold: 250,
        salesByDay: {
          [today.toISOString().split("T")[0]]: { count: 30, revenue: 1500 },
          [yesterday.toISOString().split("T")[0]]: { count: 25, revenue: 1250 },
          [dayBefore.toISOString().split("T")[0]]: { count: 35, revenue: 1750 },
        },
        salesByEvent: {
          1: { eventTitle: "Summer Festival", count: 120, revenue: 6000 },
          2: { eventTitle: "Tech Conference", count: 80, revenue: 4000 },
          3: { eventTitle: "Music Concert", count: 50, revenue: 2500 },
        },
      };
    }
    return periodSales;
  };

  // Use mock data when real data is not available
  const displayedAnalytics = salesAnalytics ? salesAnalytics : getMockData();
  const displayedPeriodSales = periodSales ? periodSales : getMockPeriodData();

  if (loading && !displayedAnalytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading analytics data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 text-white bg-red-500 rounded-lg">
          Error loading data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Sales Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Visualized data on ticket sales performance
        </p>
      </div>

      {/* Filters */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Time Period
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeFilter("week")}
                  className={`px-4 py-1 text-sm rounded-md ${
                    timeFilter === "week"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100"
                  }`}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setTimeFilter("month")}
                  className={`px-4 py-1 text-sm rounded-md ${
                    timeFilter === "month"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100"
                  }`}
                >
                  Last 30 Days
                </button>
                <button
                  onClick={handleCustomDateRange}
                  className={`px-4 py-1 text-sm rounded-md flex items-center gap-1 ${
                    timeFilter === "custom"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100"
                  }`}
                >
                  <Calendar size={16} />
                  Custom
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                View Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("overview")}
                  className={`px-4 py-1 text-sm rounded-md ${
                    viewMode === "overview"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setViewMode("compare")}
                  className={`px-4 py-1 text-sm rounded-md flex items-center gap-1 ${
                    viewMode === "compare"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100"
                  }`}
                >
                  <BarChart3 size={16} />
                  Compare Events
                </button>
              </div>
            </div>
          </div>

          {viewMode === "compare" &&
            displayedAnalytics &&
            displayedAnalytics.popularEvents && (
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Select Events to Compare
                </label>
                <div className="flex flex-wrap gap-2">
                  {displayedAnalytics.popularEvents.map((event) => (
                    <button
                      key={event.eventId}
                      onClick={() => toggleEventSelection(event.eventId)}
                      className={`px-3 py-1 text-xs rounded-md ${
                        selectedEvents.includes(event.eventId)
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : "bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {event.eventTitle}
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        {/* Revenue Over Time */}
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Revenue Over Time
            </h2>
            <button
              onClick={() => handleExportChart("revenue")}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <Download size={20} />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareRevenueData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0088FE"
                  strokeWidth={2}
                  name="Revenue ($)"
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tickets Sold Per Event */}
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Tickets Sold Per Event
            </h2>
            <button
              onClick={() => handleExportChart("tickets")}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <Download size={20} />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getFilteredEvents()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ticketsSold" name="Tickets Sold">
                  {getFilteredEvents().map((entry, index) => (
                    <Cell
                      key={`cell-${entry.eventId}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ticket Types Distribution */}
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Ticket Types Distribution
            </h2>
            <button
              onClick={() => handleExportChart("distribution")}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <Download size={20} />
            </button>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="flex w-full h-full">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={calculateTicketTypeData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(1)}%`
                      }
                    >
                      {calculateTicketTypeData().map((entry, index) => (
                        <Cell
                          key={`cell-${entry.id}-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} tickets`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center flex-1">
                <div>
                  {calculateTicketTypeData().map((entry, index) => (
                    <div
                      key={`legend-${entry.id}`}
                      className="flex items-center mb-2"
                    >
                      <div
                        className="w-3 h-3 mr-2 rounded-sm"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <span className="text-sm">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Summary Statistics
            </h2>
            {loading && (
              <span className="text-sm text-blue-500">Refreshing...</span>
            )}
          </div>
          {displayedAnalytics && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-50">
                <p className="mb-1 text-sm text-blue-600">Total Sales</p>
                <p className="text-2xl font-bold">
                  ${displayedAnalytics.totalRevenue?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-green-50">
                <p className="mb-1 text-sm text-green-600">Tickets Sold</p>
                <p className="text-2xl font-bold">
                  {displayedAnalytics.totalTicketsSold?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-50">
                <p className="mb-1 text-sm text-yellow-600">Total Events</p>
                <p className="text-2xl font-bold">
                  {displayedAnalytics.totalEvents || 0}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50">
                <p className="mb-1 text-sm text-purple-600">
                  Avg. Ticket Price
                </p>
                <p className="text-2xl font-bold">
                  $
                  {displayedAnalytics.totalTicketsSold
                    ? Math.round(
                        displayedAnalytics.totalRevenue /
                          displayedAnalytics.totalTicketsSold
                      )
                    : 0}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Sales Table */}
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Event Sales Details
          </h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 border rounded">
              <Filter size={16} />
              Filter
            </button>
            <button
              onClick={() => handleExportChart("table")}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 border rounded"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Event
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Tickets Sold
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Total Earnings
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Avg. Ticket Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedPeriodSales && displayedPeriodSales.salesByEvent ? (
                Object.entries(displayedPeriodSales.salesByEvent).map(
                  ([eventId, data]) => (
                    <tr
                      key={`event-row-${eventId}`}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedEventId(eventId)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {data.eventTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {data.count}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${data.revenue.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        $
                        {data.count > 0
                          ? Math.round(data.revenue / data.count)
                          : 0}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {loading
                      ? "Loading sales data..."
                      : "No sales data available for the selected period"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Sales Over Time */}
      {displayedAnalytics && displayedAnalytics.salesOverTime && (
        <div className="p-4 mt-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Monthly Sales Trends
            </h2>
            <button
              onClick={() => handleExportChart("monthly")}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <Download size={20} />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareSalesOverTimeData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value, name) => {
                    return name === "revenue" ? `$${value}` : value;
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0088FE"
                  strokeWidth={2}
                  name="Revenue ($)"
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="tickets"
                  stroke="#00C49F"
                  strokeWidth={2}
                  name="Tickets Sold"
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Customer Retention */}
      {displayedAnalytics && displayedAnalytics.customerRetention && (
        <div className="p-4 mt-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Customer Retention
            </h2>
          </div>
          <div className="flex items-center justify-center p-4">
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 text-center border rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {displayedAnalytics.customerRetention.singlePurchase}
                </div>
                <div className="mt-2 text-gray-600">One-Time Customers</div>
              </div>
              <div className="p-6 text-center border rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {displayedAnalytics.customerRetention.multiplePurchases}
                </div>
                <div className="mt-2 text-gray-600">Returning Customers</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
