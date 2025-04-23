import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getOrganizerEvents,
  deleteOrganizerEvent,
} from "../../Redux/Slicers/OrganizerSlice";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  Filter,
  ChevronDown,
  ChevronUp,
  Loader,
  AlertCircle,
} from "lucide-react";

const ManageEvents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get events from Redux instead of local state
  const { events, loading, error } = useSelector((state) => state.organizer);

  // State for search, filter, sort, and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch events when component mounts
  useEffect(() => {
    dispatch(getOrganizerEvents());
  }, [dispatch]);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Navigate to update event page
  const handleEdit = (id) => {
    navigate(`/organizer/update-event/${id}`);
  };

  // Navigate to view event details
  const handleView = (id) => {
    navigate(`/event/${id}`);
  };

  // Navigate to view attendees
  const handleViewAttendees = (id) => {
    navigate(`/organizer/event/${id}/attendees`);
  };

  // Handle event deletion with API call
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteOrganizerEvent(id));
    }
  };

  // Filter and sort events
  const filteredEvents = events
    ? events.filter((event) => {
        const matchesSearch = event.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "All" || event.event_status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    let comparison = 0;

    if (sortField === "title") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortField === "date") {
      comparison = new Date(a.date) - new Date(b.date);
    } else if (sortField === "status") {
      comparison = a.event_status.localeCompare(b.event_status);
    } else if (sortField === "ticketsSold") {
      // Assuming you have ticket sales data in your API response
      const aSold = a.ticket_sales?.totalSold || 0;
      const bSold = b.ticket_sales?.totalSold || 0;
      comparison = aSold - bSold;
    } else if (sortField === "earnings") {
      // Assuming you have earnings data in your API response
      const aEarnings = a.ticket_sales?.totalEarnings || 0;
      const bEarnings = b.ticket_sales?.totalEarnings || 0;
      comparison = aEarnings - bEarnings;
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

  // Status badge component with correct API status names
  const StatusBadge = ({ status }) => {
    let bgColor = "";

    switch (status) {
      case "approved":
        bgColor = "bg-green-100 text-green-800";
        break;
      case "pending":
        bgColor = "bg-yellow-100 text-yellow-800";
        break;
      case "rejected":
        bgColor = "bg-red-100 text-red-800";
        break;
      default:
        bgColor = "bg-gray-100 text-gray-800";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Show loading state
  if (loading && !events) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-lg">Loading events...</span>
      </div>
    );
  }

  // Show error state
  if (error && !events) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="w-16 h-16 text-red-600" />
        <h2 className="mt-4 text-2xl font-bold">Error Loading Events</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={() => dispatch(getOrganizerEvents())}
          className="px-6 py-2 mt-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Manage Events</h1>

      {/* Show error message if any operation fails */}
      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
          <p className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </p>
        </div>
      )}

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
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
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
            {loading && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                    <span className="ml-2">Loading events...</span>
                  </div>
                </td>
              </tr>
            )}
            {!loading && currentEvents.length > 0 ? (
              currentEvents.map((event) => (
                <tr key={event._id || event.id} className="hover:bg-gray-50">
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
                    <StatusBadge status={event.event_status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {event.ticket_sales?.totalSold || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatCurrency(event.ticket_sales?.totalEarnings || 0)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                        onClick={() => handleView(event._id || event.id)}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Event"
                        onClick={() => handleEdit(event._id || event.id)}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Delete Event"
                        onClick={() => handleDelete(event._id || event.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="View Attendees"
                        onClick={() =>
                          handleViewAttendees(event._id || event.id)
                        }
                      >
                        <Users className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : !loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-sm text-center text-gray-500"
                >
                  No events found
                </td>
              </tr>
            ) : null}
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
