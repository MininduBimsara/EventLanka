import React, { useState } from "react";
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
  // Sample data - replace with actual data from your API
  const statsData = {
    totalEvents: 47,
    ticketsSold: 2384,
    revenue: 95670,
    upcomingEvents: 12,
  };

  const recentEvents = [
    {
      id: 1,
      title: "Web Development Conference",
      date: "2025-04-15",
      soldTickets: 89,
      totalTickets: 100,
    },
    {
      id: 2,
      title: "Tech Startup Mixer",
      date: "2025-04-12",
      soldTickets: 120,
      totalTickets: 150,
    },
    {
      id: 3,
      title: "Product Launch Party",
      date: "2025-04-02",
      soldTickets: 145,
      totalTickets: 200,
    },
    {
      id: 4,
      title: "Design Workshop",
      date: "2025-03-29",
      soldTickets: 35,
      totalTickets: 50,
    },
    {
      id: 5,
      title: "Annual Hackathon",
      date: "2025-03-25",
      soldTickets: 210,
      totalTickets: 250,
    },
  ];

  const pendingActions = [
    { id: 1, type: "approval", title: "AI Ethics Seminar", date: "2025-04-30" },
    {
      id: 2,
      type: "approval",
      title: "Virtual Reality Exhibition",
      date: "2025-05-10",
    },
    { id: 3, type: "promo", code: "SPRING25", expires: "2025-04-15" },
    { id: 4, type: "promo", code: "EARLYBIRD", expires: "2025-04-20" },
  ];

  const salesData = [
    { name: "Mar 1", sales: 45 },
    { name: "Mar 8", sales: 62 },
    { name: "Mar 15", sales: 78 },
    { name: "Mar 22", sales: 91 },
    { name: "Mar 29", sales: 120 },
    { name: "Apr 5", sales: 142 },
  ];

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
            {statsData.totalEvents}
          </p>
          <p className="mt-2 text-sm text-green-600">+12% from last month</p>
        </div>

        <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-600">Tickets Sold</h2>
            <div className="p-2 bg-purple-100 rounded-full">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {statsData.ticketsSold}
          </p>
          <p className="mt-2 text-sm text-green-600">+8% from last month</p>
        </div>

        <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-600">Revenue</h2>
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            ${statsData.revenue.toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-green-600">+15% from last month</p>
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
            {statsData.upcomingEvents}
          </p>
          <p className="mt-2 text-sm text-blue-600">Next event in 8 days</p>
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
                {recentEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 font-medium">{event.title}</td>
                    <td className="py-3 text-gray-600">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="w-full h-2 mr-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{
                              width: `${
                                (event.soldTickets / event.totalTickets) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {event.soldTickets}/{event.totalTickets}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Pending Actions
            </h2>
            <button className="text-sm text-blue-500 hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {pendingActions.map((action) => (
              <div
                key={action.id}
                className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
              >
                <div
                  className={`p-2 rounded-full mr-3 ${
                    action.type === "approval"
                      ? "bg-yellow-100"
                      : "bg-purple-100"
                  }`}
                >
                  {action.type === "approval" ? (
                    <AlertCircle
                      className={`h-4 w-4 ${
                        action.type === "approval"
                          ? "text-yellow-500"
                          : "text-purple-500"
                      }`}
                    />
                  ) : (
                    <Tag
                      className={`h-4 w-4 ${
                        action.type === "approval"
                          ? "text-yellow-500"
                          : "text-purple-500"
                      }`}
                    />
                  )}
                </div>
                <div>
                  {action.type === "approval" ? (
                    <>
                      <p className="text-sm font-medium">{action.title}</p>
                      <p className="text-xs text-gray-500">
                        Needs approval for{" "}
                        {new Date(action.date).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">
                        Promo code: {action.code}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expires on{" "}
                        {new Date(action.expires).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
            {pendingActions.length === 0 && (
              <p className="py-4 text-sm text-center text-gray-500">
                No pending actions
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
