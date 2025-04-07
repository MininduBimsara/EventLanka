import { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ManageEvents = () => {
  // Sample event data - in a real app, this would come from an API
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Summer Music Festival",
      date: "2025-06-15T18:00:00",
      status: "Approved",
      ticketsSold: 342,
      earnings: 17100,
      isDraft: false,
    },
    {
      id: 2,
      title: "Tech Conference 2025",
      date: "2025-05-10T09:00:00",
      status: "Approved",
      ticketsSold: 187,
      earnings: 14960,
      isDraft: false,
    },
    {
      id: 3,
      title: "Art Exhibition",
      date: "2025-04-20T10:00:00",
      status: "Pending",
      ticketsSold: 0,
      earnings: 0,
      isDraft: false,
    },
    {
      id: 4,
      title: "Local Food Festival",
      date: "2025-07-12T11:00:00",
      status: "Rejected",
      ticketsSold: 0,
      earnings: 0,
      isDraft: false,
    },
    {
      id: 5,
      title: "City Marathon",
      date: "2025-09-05T07:00:00",
      status: "Approved",
      ticketsSold: 576,
      earnings: 25920,
      isDraft: false,
    },
    {
      id: 6,
      title: "Workshop Series",
      date: "2025-04-30T14:00:00",
      status: "Approved",
      ticketsSold: 45,
      earnings: 2250,
      isDraft: true,
    },
    {
      id: 7,
      title: "Charity Gala",
      date: "2025-05-25T19:00:00",
      status: "Pending",
      ticketsSold: 0,
      earnings: 0,
      isDraft: false,
    },
  ]);

  // State for search, filter, sort, and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle event deletion
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  // Filter and sort events
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    let comparison = 0;

    if (sortField === "title") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortField === "date") {
      comparison = new Date(a.date) - new Date(b.date);
    } else if (sortField === "status") {
      comparison = a.status.localeCompare(b.status);
    } else if (sortField === "ticketsSold") {
      comparison = a.ticketsSold - b.ticketsSold;
    } else if (sortField === "earnings") {
      comparison = a.earnings - b.earnings;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = "";

    switch (status) {
      case "Approved":
        bgColor = "bg-green-100 text-green-800";
        break;
      case "Pending":
        bgColor = "bg-yellow-100 text-yellow-800";
        break;
      case "Rejected":
        bgColor = "bg-red-100 text-red-800";
        break;
      default:
        bgColor = "bg-gray-100 text-gray-800";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Manage Events</h1>

      {/* Search and Filter */}
      <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search events..."
            className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex w-full gap-4 md:w-auto">
          <div className="relative">
            <select
              className="px-4 py-2 pr-8 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
            <Filter className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center">
                  Event Title
                  {sortField === "title" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date & Time
                  {sortField === "date" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  {sortField === "status" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSort("ticketsSold")}
              >
                <div className="flex items-center">
                  Tickets Sold
                  {sortField === "ticketsSold" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSort("earnings")}
              >
                <div className="flex items-center">
                  Earnings
                  {sortField === "earnings" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentEvents.length > 0 ? (
              currentEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        {event.isDraft && (
                          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
                            Draft
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatDateTime(event.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={event.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {event.ticketsSold}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatCurrency(event.earnings)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Event"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Delete Event"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="View Attendees"
                      >
                        <Users className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-sm text-center text-gray-500"
                >
                  No events found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstEvent + 1}</span>{" "}
            to{" "}
            <span className="font-medium">
              {indexOfLastEvent > sortedEvents.length
                ? sortedEvents.length
                : indexOfLastEvent}
            </span>{" "}
            of <span className="font-medium">{sortedEvents.length}</span>{" "}
            results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
