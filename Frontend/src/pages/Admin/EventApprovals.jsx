import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Filter,
  ChevronDown,
  Info,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react";
import {
  fetchPendingEvents,
  fetchEventDetails,
  approveEvent,
  rejectEvent,
} from "../../Redux/Thunks/adminThunks"; 
import {
  clearCurrentEvent,
} from "../../Redux/Slicers/adminSlice";
import { useToast } from "../../components/Common/Notification/ToastContext";

export default function EventApprovals() {
  const dispatch = useDispatch();
  const { pendingEvents, currentEvent, loading } = useSelector(
    (state) => state.admin.events
  );
  const error = useSelector((state) => state.admin.error);
  const toast = useToast();

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    organizer: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Ref for the filter dropdown to detect outside clicks
  const filterRef = useRef(null);

  // Fetch pending events on component mount
  useEffect(() => {
    dispatch(fetchPendingEvents());
  }, [dispatch]);

  // Update filtered events when pendingEvents changes or filters are applied
  useEffect(() => {
    let results = pendingEvents;

    // Apply search
    if (searchQuery) {
      results = results.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.organizer_name &&
            event.organizer_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (filters.category) {
      results = results.filter((event) => event.category === filters.category);
    }

    // Apply organizer filter
    if (filters.organizer) {
      results = results.filter(
        (event) => event.organizer_name === filters.organizer
      );
    }

    setFilteredEvents(results);
  }, [searchQuery, filters, pendingEvents]);

  // Handle outside click for filter dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Get unique values for filter dropdowns
  const categories = [
    ...new Set(pendingEvents.map((event) => event.category)),
  ].filter(Boolean);
  const organizers = [
    ...new Set(pendingEvents.map((event) => event.organizer_name)),
  ].filter(Boolean);

  const handleViewDetails = (event) => {
    dispatch(fetchEventDetails(event._id));
    setIsModalOpen(true);
  };

  const handleApprove = (eventId) => {
    dispatch(approveEvent(eventId))
      .then(() => {
        setIsModalOpen(false);
        setNotification({
          show: true,
          message: "Event approved successfully!",
          type: "success",
        });
        // Refresh the pending events list
        dispatch(fetchPendingEvents());
      })
      .catch((error) => {
        setNotification({
          show: true,
          message:
            "Failed to approve event: " + (error?.message || "Unknown error"),
          type: "error",
        });
      });
  };

  const handleReject = (eventId) => {
    if (!rejectionReason.trim()) return;

    dispatch(rejectEvent({ eventId, reason: rejectionReason }))
      .then(() => {
        setIsModalOpen(false);
        setRejectionReason("");
        setNotification({
          show: true,
          message: "Event rejected successfully!",
          type: "success",
        });
        // Refresh the pending events list
        dispatch(fetchPendingEvents());
      })
      .catch((error) => {
        setNotification({
          show: true,
          message:
            "Failed to reject event: " + (error?.message || "Unknown error"),
          type: "error",
        });
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRejectionReason("");
    dispatch(clearCurrentEvent());
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Event Approval Dashboard</h1>

      {/* Notification */}
      {notification.show && (
        <div
          className={`p-4 mb-4 rounded flex justify-between items-center ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <span>{notification.message}</span>
          <button
            onClick={() =>
              setNotification({ show: false, message: "", type: "" })
            }
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-400 rounded">
          Error: {error}
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search events or organizers..."
            className="w-full py-2 pl-10 pr-4 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="relative" ref={filterRef}>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown className="w-4 h-4" />
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 z-10 w-64 p-4 mt-2 bg-white border rounded-lg shadow-lg">
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">
                  Category
                </label>
                <select
                  className="w-full p-2 border rounded"
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">
                  Organizer
                </label>
                <select
                  className="w-full p-2 border rounded"
                  value={filters.organizer}
                  onChange={(e) =>
                    setFilters({ ...filters, organizer: e.target.value })
                  }
                >
                  <option value="">All Organizers</option>
                  {organizers.map((organizer) => (
                    <option key={organizer} value={organizer}>
                      {organizer}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="w-full py-2 bg-gray-100 rounded hover:bg-gray-200"
                onClick={() => {
                  setFilters({ category: "", organizer: "" });
                  setIsFilterOpen(false);
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && !isModalOpen && (
        <div className="flex justify-center py-8">
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {/* Event Table */}
      {!loading && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Event
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Organizer
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <tr key={event._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {event.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {event.organizer_name || "Unknown Organizer"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 text-xs font-semibold leading-5 text-blue-800 bg-blue-100 rounded-full">
                        {event.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(event.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          event.event_status === "approved"
                            ? "bg-green-100 text-green-800"
                            : event.event_status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {event.event_status &&
                          event.event_status.charAt(0).toUpperCase() +
                            event.event_status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          className="p-1 rounded hover:bg-gray-100"
                          onClick={() => handleViewDetails(event)}
                        >
                          <Info className="w-5 h-5 text-blue-500" />
                        </button>
                        {event.event_status === "pending" && (
                          <>
                            <button
                              className="p-1 rounded hover:bg-gray-100"
                              onClick={() => handleApprove(event._id)}
                            >
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            </button>
                            <button
                              className="p-1 rounded hover:bg-gray-100"
                              onClick={() => {
                                handleViewDetails(event);
                              }}
                            >
                              <XCircle className="w-5 h-5 text-red-500" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {pendingEvents.length === 0 && !loading
                      ? "No pending events found"
                      : "No events match your search criteria"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Event Detail Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-gray-600 bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-2xl max-h-screen overflow-y-auto bg-white rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : currentEvent ? (
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-bold">{currentEvent.title}</h2>
                  <button
                    className="text-gray-400 hover:text-gray-500"
                    onClick={closeModal}
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>

                <div className="mt-4">
                  {currentEvent.banner ? (
                    <img
                      src={currentEvent.banner}
                      alt={currentEvent.title}
                      className="object-cover w-full h-48 rounded"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-48 bg-gray-100 rounded">
                      <p className="text-gray-400">No image available</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Organizer
                    </p>
                    <p>{currentEvent.organizer_name || "Unknown Organizer"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Category
                    </p>
                    <p>{currentEvent.category || "Uncategorized"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p>{formatDate(currentEvent.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Location
                    </p>
                    <p>{currentEvent.location || "Location not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Duration
                    </p>
                    <p>{currentEvent.duration || "N/A"} hours</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="capitalize">{currentEvent.event_status}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">
                    Description
                  </p>
                  <p className="mt-1">{currentEvent.description}</p>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">
                    Ticket Types
                  </p>
                  {currentEvent.ticket_types &&
                  currentEvent.ticket_types.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {currentEvent.ticket_types.map((ticket, index) => (
                        <div key={index} className="p-2 border rounded">
                          <p className="font-medium">{ticket.name}</p>
                          <p className="text-sm">Price: ${ticket.price}</p>
                          <p className="text-sm">Quantity: {ticket.quantity}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1">No ticket information available</p>
                  )}
                </div>

                {/* Show rejection reason if event is rejected */}
                {currentEvent.event_status === "rejected" &&
                  currentEvent.rejectionReason && (
                    <div className="p-3 mt-4 rounded bg-red-50">
                      <p className="text-sm font-medium text-red-800">
                        Rejection Reason
                      </p>
                      <p className="text-sm text-red-700">
                        {currentEvent.rejectionReason}
                      </p>
                    </div>
                  )}

                {/* Approval/Rejection Actions */}
                {currentEvent.event_status === "pending" && (
                  <div className="mt-6">
                    <div className="mb-4">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Rejection Reason (required for rejection)
                      </label>
                      <textarea
                        rows="3"
                        className="w-full p-2 border rounded"
                        placeholder="Provide a reason if rejecting the event..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700"
                        onClick={() => handleApprove(currentEvent._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
                        onClick={() => handleReject(currentEvent._id)}
                        disabled={!rejectionReason.trim()}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-red-500">
                Event details not found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
