import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function EventApprovals() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    organizer: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        title: "Summer Music Festival",
        organizer: "Sound Wave Productions",
        category: "Music",
        date: "2025-06-15",
        status: "pending",
        description:
          "A 3-day music festival featuring local and international artists across 5 stages.",
        location: "Riverside Park",
        attendeeCapacity: 5000,
        image: "/api/placeholder/400/200",
      },
      {
        id: 2,
        title: "Tech Conference 2025",
        organizer: "TechNow Group",
        category: "Technology",
        date: "2025-05-22",
        status: "pending",
        description:
          "Annual technology conference with keynote speakers, workshops and networking opportunities.",
        location: "Downtown Convention Center",
        attendeeCapacity: 1200,
        image: "/api/placeholder/400/200",
      },
      {
        id: 3,
        title: "Community Gardening Day",
        organizer: "Green Thumbs Society",
        category: "Community",
        date: "2025-04-18",
        status: "pending",
        description:
          "Help plant and maintain our community gardens. Tools and refreshments provided.",
        location: "Eastside Community Gardens",
        attendeeCapacity: 150,
        image: "/api/placeholder/400/200",
      },
      {
        id: 4,
        title: "Annual Charity Run",
        organizer: "Better Tomorrow Foundation",
        category: "Sports",
        date: "2025-07-10",
        status: "pending",
        description:
          "5K and 10K charity run to raise funds for local children's hospital.",
        location: "Lakeview Trail",
        attendeeCapacity: 800,
        image: "/api/placeholder/400/200",
      },
      {
        id: 5,
        title: "Art Exhibition: Modern Perspectives",
        organizer: "Metropolitan Arts Council",
        category: "Arts",
        date: "2025-05-05",
        status: "pending",
        description:
          "Exhibition featuring contemporary artists exploring modern social themes.",
        location: "City Gallery",
        attendeeCapacity: 300,
        image: "/api/placeholder/400/200",
      },
    ];

    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  }, []);

  // Handle search and filter
  useEffect(() => {
    let results = events;

    // Apply search
    if (searchQuery) {
      results = results.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      results = results.filter((event) => event.category === filters.category);
    }

    // Apply organizer filter
    if (filters.organizer) {
      results = results.filter(
        (event) => event.organizer === filters.organizer
      );
    }

    setFilteredEvents(results);
  }, [searchQuery, filters, events]);

  // Get unique values for filter dropdowns
  const categories = [...new Set(events.map((event) => event.category))];
  const organizers = [...new Set(events.map((event) => event.organizer))];

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleApprove = (eventId) => {
    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, status: "approved" } : event
      )
    );

    // Close modal if the approved event is currently viewed
    if (selectedEvent && selectedEvent.id === eventId) {
      setIsModalOpen(false);
    }

    // In a real app, you would make an API call here
    console.log(`Event #${eventId} approved`);
  };

  const handleReject = (eventId) => {
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? { ...event, status: "rejected", rejectionReason }
          : event
      )
    );

    // Close modal if the rejected event is currently viewed
    if (selectedEvent && selectedEvent.id === eventId) {
      setIsModalOpen(false);
      setRejectionReason("");
    }

    // In a real app, you would make an API call here
    console.log(`Event #${eventId} rejected with reason: ${rejectionReason}`);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Event Approval Dashboard</h1>

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

        <div className="relative">
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
                onClick={() => setFilters({ category: "", organizer: "" })}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Event Table */}
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
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {event.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {event.organizer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 text-xs font-semibold leading-5 text-blue-800 bg-blue-100 rounded-full">
                      {event.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(event.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : event.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {event.status.charAt(0).toUpperCase() +
                        event.status.slice(1)}
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
                      {event.status === "pending" && (
                        <>
                          <button
                            className="p-1 rounded hover:bg-gray-100"
                            onClick={() => handleApprove(event.id)}
                          >
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </button>
                          <button
                            className="p-1 rounded hover:bg-gray-100"
                            onClick={() => {
                              setSelectedEvent(event);
                              setIsModalOpen(true);
                              // Focus on rejection reason field
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
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No events match your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Event Detail Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-600 bg-opacity-50">
          <div className="w-full max-w-2xl max-h-screen overflow-y-auto bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => {
                    setIsModalOpen(false);
                    setRejectionReason("");
                  }}
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="mt-4">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="object-cover w-full h-48 rounded"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Organizer</p>
                  <p>{selectedEvent.organizer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p>{selectedEvent.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{formatDate(selectedEvent.date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p>{selectedEvent.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Attendee Capacity
                  </p>
                  <p>{selectedEvent.attendeeCapacity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="capitalize">{selectedEvent.status}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="mt-1">{selectedEvent.description}</p>
              </div>

              {/* Show rejection reason if event is rejected */}
              {selectedEvent.status === "rejected" &&
                selectedEvent.rejectionReason && (
                  <div className="p-3 mt-4 rounded bg-red-50">
                    <p className="text-sm font-medium text-red-800">
                      Rejection Reason
                    </p>
                    <p className="text-sm text-red-700">
                      {selectedEvent.rejectionReason}
                    </p>
                  </div>
                )}

              {/* Approval/Rejection Actions */}
              {selectedEvent.status === "pending" && (
                <div className="mt-6">
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Rejection Reason (optional for approval)
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
                      onClick={() => {
                        setIsModalOpen(false);
                        setRejectionReason("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700"
                      onClick={() => handleApprove(selectedEvent.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
                      onClick={() => handleReject(selectedEvent.id)}
                      disabled={!rejectionReason.trim()}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
