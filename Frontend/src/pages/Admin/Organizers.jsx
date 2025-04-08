import { useState, useEffect } from "react";
import {
  Eye,
  Calendar,
  Ban,
  CheckCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";

export default function OrganizersAdmin() {
  const [organizers, setOrganizers] = useState([]);
  const [filteredOrganizers, setFilteredOrganizers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "joinedDate",
    direction: "desc",
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockOrganizers = [
        {
          id: 1,
          name: "Jane Smith",
          email: "jane@eventpro.com",
          totalEvents: 24,
          joinedDate: "2023-02-15",
          status: "active",
        },
        {
          id: 2,
          name: "John Doe",
          email: "john@eventify.com",
          totalEvents: 16,
          joinedDate: "2023-05-22",
          status: "active",
        },
        {
          id: 3,
          name: "Alice Johnson",
          email: "alice@gatherings.org",
          totalEvents: 8,
          joinedDate: "2023-10-10",
          status: "pending",
        },
        {
          id: 4,
          name: "Robert Chen",
          email: "robert@eventmasters.net",
          totalEvents: 32,
          joinedDate: "2022-11-05",
          status: "active",
        },
        {
          id: 5,
          name: "Maria Garcia",
          email: "maria@planit.co",
          totalEvents: 0,
          joinedDate: "2024-01-12",
          status: "pending",
        },
        {
          id: 6,
          name: "Kevin Williams",
          email: "kevin@eventsbykw.com",
          totalEvents: 12,
          joinedDate: "2023-07-30",
          status: "banned",
        },
        {
          id: 7,
          name: "Sarah Miller",
          email: "sarah@eventworld.com",
          totalEvents: 20,
          joinedDate: "2022-12-18",
          status: "active",
        },
        {
          id: 8,
          name: "David Brown",
          email: "david@gatherup.io",
          totalEvents: 5,
          joinedDate: "2023-09-05",
          status: "banned",
        },
      ];
      setOrganizers(mockOrganizers);
      setFilteredOrganizers(mockOrganizers);
      setIsLoading(false);
    }, 800);
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...organizers];

    // Apply status filter
    if (activeFilter !== "all") {
      result = result.filter((organizer) => organizer.status === activeFilter);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (organizer) =>
          organizer.name.toLowerCase().includes(term) ||
          organizer.email.toLowerCase().includes(term)
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
  }, [organizers, activeFilter, searchTerm, sortConfig]);

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
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Toggle organizer status
  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "banned" : "active";

    setOrganizers(
      organizers.map((organizer) =>
        organizer.id === id ? { ...organizer, status: newStatus } : organizer
      )
    );
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
            {status}
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

  // Loading state
  if (isLoading) {
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
                onClick={() => requestSort("joinedDate")}
              >
                <div className="flex items-center">
                  Joined Date
                  <SortIndicator columnKey="joinedDate" />
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
                <tr key={organizer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {organizer.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {organizer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {organizer.totalEvents}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(organizer.joinedDate)}
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
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-900"
                        title="View Events"
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
                            toggleStatus(organizer.id, organizer.status)
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
        Showing {filteredOrganizers.length} of {organizers.length} organizers
        {activeFilter !== "all" && ` (filtered by: ${activeFilter})`}
        {searchTerm && ` (search: "${searchTerm}")`}
      </div>
    </div>
  );
}
