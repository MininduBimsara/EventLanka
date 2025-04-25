import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Eye,
  Calendar,
  Ban,
  CheckCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  Search,
  X,
} from "lucide-react";
import {
  fetchOrganizers,
  updateOrganizerStatus,
  fetchOrganizerProfile,
  fetchOrganizerEvents,
} from "../../Redux/Slicers/adminSlice"; // Adjust path as needed

export default function OrganizersAdmin() {
  const dispatch = useDispatch();

  // Get organizers from Redux store
  const { organizersList, currentOrganizer, organizerEvents, loading } =
    useSelector((state) => state.admin.users);
  const error = useSelector((state) => state.admin.error);

  // Local state for filtering and sorting
  const [filteredOrganizers, setFilteredOrganizers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "joinedDate",
    direction: "desc",
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Fetch organizers on component mount
  useEffect(() => {
    dispatch(fetchOrganizers());
  }, [dispatch]);

  // Update filtered organizers whenever organizers list, filters, or search changes
  useEffect(() => {
    if (!organizersList) return;

    let result = [...organizersList];

    // Apply status filter
    if (activeFilter !== "all") {
      result = result.filter((organizer) => organizer.status === activeFilter);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (organizer) =>
          organizer.name?.toLowerCase().includes(term) ||
          organizer.email?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredOrganizers(result);
  }, [organizersList, activeFilter, searchTerm, sortConfig]);

  // Request sort
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Toggle organizer status
  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "banned" : "active";
    dispatch(
      updateOrganizerStatus({
        organizerId: id,
        statusData: { status: newStatus },
      })
    );
  };

  // View organizer details
  const viewOrganizerDetails = (organizerId) => {
    setSelectedOrganizerId(organizerId);
    setDetailsLoading(true);
    dispatch(fetchOrganizerProfile(organizerId))
      .then(() => {
        setShowDetailsModal(true);
        setDetailsLoading(false);
      })
      .catch(() => {
        setDetailsLoading(false);
      });
  };

  // View organizer events
  const viewOrganizerEvents = (organizerId) => {
    setSelectedOrganizerId(organizerId);
    setEventsLoading(true);
    dispatch(fetchOrganizerEvents(organizerId))
      .then(() => {
        setShowEventsModal(true);
        setEventsLoading(false);
      })
      .catch(() => {
        setEventsLoading(false);
      });
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "active":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Active
          </span>
        );
      case "banned":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            Banned
          </span>
        );
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            Pending
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            {status || "Unknown"}
          </span>
        );
    }
  };

  // Sort indicator component
  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;

    return sortConfig.direction === "asc" ? (
      <ChevronUp className="inline-block w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="inline-block w-4 h-4 ml-1" />
    );
  };

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-md">
          <p>Error: {error}</p>
          <button
            className="px-4 py-2 mt-2 text-white bg-red-500 rounded hover:bg-red-600"
            onClick={() => dispatch(fetchOrganizers())}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Organizers Management
      </h1>

      {/* Search and Filters */}
      <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Search organizers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="w-full sm:w-auto bg-white border border-gray-300 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            {activeFilter === "all"
              ? "All Status"
              : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>

          {showFilterMenu && (
            <div className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {["all", "active", "banned", "pending"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setActiveFilter(filter);
                      setShowFilterMenu(false);
                    }}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      activeFilter === filter
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700"
                    } hover:bg-gray-100`}
                  >
                    {filter === "all"
                      ? "All Status"
                      : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Organizers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center">
                  Name
                  <SortIndicator columnKey="name" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                onClick={() => requestSort("email")}
              >
                <div className="flex items-center">
                  Email
                  <SortIndicator columnKey="email" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                onClick={() => requestSort("totalEvents")}
              >
                <div className="flex items-center">
                  Total Events
                  <SortIndicator columnKey="totalEvents" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                onClick={() => requestSort("createdAt")}
              >
                <div className="flex items-center">
                  Joined Date
                  <SortIndicator columnKey="createdAt" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                onClick={() => requestSort("status")}
              >
                <div className="flex items-center">
                  Status
                  <SortIndicator columnKey="status" />
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
            {filteredOrganizers.length > 0 ? (
              filteredOrganizers.map((organizer) => (
                <tr key={organizer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {organizer.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {organizer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {organizer.totalEvents || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(organizer.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={organizer.status} />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="View Profile"
                        onClick={() => viewOrganizerDetails(organizer._id)}
                        disabled={detailsLoading}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-900"
                        title="View Events"
                        onClick={() => viewOrganizerEvents(organizer._id)}
                        disabled={eventsLoading}
                      >
                        <Calendar className="w-5 h-5" />
                      </button>
                      {organizer.status !== "pending" && (
                        <button
                          className={
                            organizer.status === "active"
                              ? "text-red-600 hover:text-red-900"
                              : "text-green-600 hover:text-green-900"
                          }
                          title={
                            organizer.status === "active"
                              ? "Ban Organizer"
                              : "Activate Organizer"
                          }
                          onClick={() =>
                            toggleStatus(organizer._id, organizer.status)
                          }
                        >
                          {organizer.status === "active" ? (
                            <Ban className="w-5 h-5" />
                          ) : (
                            <CheckCircle className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-gray-500 whitespace-nowrap"
                >
                  No organizers found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 text-sm text-gray-500">
        Showing {filteredOrganizers.length} of{" "}
        {organizersList ? organizersList.length : 0} organizers
        {activeFilter !== "all" && ` (filtered by: ${activeFilter})`}
        {searchTerm && ` (search: "${searchTerm}")`}
      </div>

      {/* Organizer Details Modal */}
      {showDetailsModal && currentOrganizer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 outline-none focus:outline-none">
          <div className="relative w-full max-w-2xl mx-auto my-6">
            {/* Modal content */}
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">
                  Organizer Profile
                </h3>
                <button
                  className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-gray-500 bg-transparent border-0 outline-none focus:outline-none"
                  onClick={() => setShowDetailsModal(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="relative flex-auto p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Name
                      </h4>
                      <p className="text-base text-gray-900">
                        {currentOrganizer.username}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Email
                      </h4>
                      <p className="text-base text-gray-900">
                        {currentOrganizer.email}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Status
                      </h4>
                      <StatusBadge status={currentOrganizer.status} />
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Joined Date
                      </h4>
                      <p className="text-base text-gray-900">
                        {formatDate(currentOrganizer.createdAt)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Total Events
                      </h4>
                      <p className="text-base text-gray-900">
                        {currentOrganizer.totalEvents || 0}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Phone
                      </h4>
                      <p className="text-base text-gray-900">
                        {currentOrganizer.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {currentOrganizer.bio && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                      <p className="text-base text-gray-900">
                        {currentOrganizer.bio}
                      </p>
                    </div>
                  )}

                  {currentOrganizer.address && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Address
                      </h4>
                      <p className="text-base text-gray-900">
                        {currentOrganizer.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end p-6 border-t border-gray-200 rounded-b">
                <button
                  className="px-4 py-2 mr-2 text-sm font-medium text-purple-700 bg-white border border-purple-300 rounded-md hover:bg-purple-50"
                  onClick={() => {
                    setShowDetailsModal(false);
                    viewOrganizerEvents(selectedOrganizerId);
                  }}
                >
                  <Calendar className="inline w-4 h-4 mr-1" />
                  View Events
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Organizer Events Modal */}
      {showEventsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 outline-none focus:outline-none">
          <div className="relative w-full max-w-4xl mx-auto my-6">
            {/* Modal content */}
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">
                  Organizer Events
                </h3>
                <button
                  className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-gray-500 bg-transparent border-0 outline-none focus:outline-none"
                  onClick={() => setShowEventsModal(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="relative flex-auto p-6">
                {eventsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : organizerEvents && organizerEvents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Event Name
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Date
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Location
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Duration(hrs)
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {organizerEvents.map((event) => (
                          <tr key={event._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {event.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {formatDate(event.date)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {event.location}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {event.duration || 0}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={event.event_status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    This organizer has no events yet.
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end p-6 border-t border-gray-200 rounded-b">
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  onClick={() => setShowEventsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
