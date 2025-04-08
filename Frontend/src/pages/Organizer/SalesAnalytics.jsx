import { useState, useEffect } from "react";
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

// Sample data - replace with your actual data source
const generateSampleData = () => {
  const events = [
    { id: 1, name: "Summer Concert" },
    { id: 2, name: "Sports Tournament" },
    { id: 3, name: "Tech Conference" },
    { id: 4, name: "Art Exhibition" },
    { id: 5, name: "Comedy Night" },
  ];

  const revenueData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().slice(0, 10),
      revenue: Math.floor(Math.random() * 5000) + 1000,
    };
  });

  const eventData = events.map((event) => ({
    eventId: event.id,
    name: event.name,
    ticketsSold: Math.floor(Math.random() * 500) + 100,
    vipTickets: Math.floor(Math.random() * 100) + 20,
    generalTickets: Math.floor(Math.random() * 400) + 80,
    earnings: Math.floor(Math.random() * 10000) + 2000,
    refunds: Math.floor(Math.random() * 30),
  }));

  return { revenueData, eventData };
};

export default function SalesAnalytics() {
  const [timeFilter, setTimeFilter] = useState("month");
  const [selectedEvents, setSelectedEvents] = useState([1, 2]);
  const [data, setData] = useState({ revenueData: [], eventData: [] });
  const [viewMode, setViewMode] = useState("overview");

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  useEffect(() => {
    // In a real app, this would fetch data based on filters
    setData(generateSampleData());
  }, [timeFilter]);

  const filteredRevenueData = () => {
    const now = new Date();
    let filteredData = [...data.revenueData];

    if (timeFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      filteredData = data.revenueData.filter(
        (item) => new Date(item.date) >= weekAgo
      );
    } else if (timeFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setDate(now.getDate() - 30);
      filteredData = data.revenueData.filter(
        (item) => new Date(item.date) >= monthAgo
      );
    }

    return filteredData;
  };

  const filteredEventData = () => {
    return data.eventData.filter(
      (event) =>
        viewMode === "overview" || selectedEvents.includes(event.eventId)
    );
  };

  const calculateTicketTypeData = () => {
    const selectedEventData = filteredEventData();
    const vipTotal = selectedEventData.reduce(
      (sum, event) => sum + event.vipTickets,
      0
    );
    const generalTotal = selectedEventData.reduce(
      (sum, event) => sum + event.generalTickets,
      0
    );

    return [
      { name: "VIP Tickets", value: vipTotal },
      { name: "General Tickets", value: generalTotal },
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
                  onClick={() => setTimeFilter("custom")}
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

          {viewMode === "compare" && (
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Select Events to Compare
              </label>
              <div className="flex flex-wrap gap-2">
                {data.eventData.map((event) => (
                  <button
                    key={event.eventId}
                    onClick={() => toggleEventSelection(event.eventId)}
                    className={`px-3 py-1 text-xs rounded-md ${
                      selectedEvents.includes(event.eventId)
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {event.name}
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
              <LineChart data={filteredRevenueData()}>
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
              <BarChart data={filteredEventData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ticketsSold" name="Tickets Sold">
                  {filteredEventData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
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
                          key={`cell-${index}`}
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
                    <div key={index} className="flex items-center mb-2">
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
            <button className="text-sm font-medium text-blue-600">
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-blue-50">
              <p className="mb-1 text-sm text-blue-600">Total Sales</p>
              <p className="text-2xl font-bold">
                $
                {filteredEventData()
                  .reduce((sum, event) => sum + event.earnings, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50">
              <p className="mb-1 text-sm text-green-600">Tickets Sold</p>
              <p className="text-2xl font-bold">
                {filteredEventData()
                  .reduce((sum, event) => sum + event.ticketsSold, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50">
              <p className="mb-1 text-sm text-yellow-600">Refunds</p>
              <p className="text-2xl font-bold">
                {filteredEventData().reduce(
                  (sum, event) => sum + event.refunds,
                  0
                )}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50">
              <p className="mb-1 text-sm text-purple-600">Avg. Ticket Price</p>
              <p className="text-2xl font-bold">
                $
                {Math.round(
                  filteredEventData().reduce(
                    (sum, event) => sum + event.earnings,
                    0
                  ) /
                    filteredEventData().reduce(
                      (sum, event) => sum + event.ticketsSold,
                      0
                    )
                )}
              </p>
            </div>
          </div>
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
                  Refunds
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
              {filteredEventData().map((event) => (
                <tr key={event.eventId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {event.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {event.ticketsSold}
                    </div>
                    <div className="text-xs text-gray-500">
                      VIP: {event.vipTickets} | General: {event.generalTickets}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${event.earnings.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.refunds}</div>
                    <div className="text-xs text-gray-500">
                      $
                      {(
                        event.refunds *
                        Math.round(event.earnings / event.ticketsSold)
                      ).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    ${Math.round(event.earnings / event.ticketsSold)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
