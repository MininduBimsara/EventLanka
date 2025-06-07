import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Download,
  Mail,
  Check,
  ChevronDown,
  QrCode,
} from "lucide-react";
import {
  getEventAttendees,
  markAttendance,
  resendConfirmation,
  exportAttendeeList,
  getOrganizerEvents, // Add this function to fetch events
} from "../../Redux/Thunks/organizerThunk";
import { useToast } from "../../components/Common/Notification/ToastContext"; // Updated import


const Attendees = () => {
  const toast = useToast(); // Use the toast context for notifications
  const dispatch = useDispatch();

  // Redux state
  const { attendees, loading, error, events } = useSelector(
    (state) => state.organizer
  );

  // Local state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filteredAttendees, setFilteredAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [exportType, setExportType] = useState("csv");
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState(null);

  // Fetch events on component mount
  useEffect(() => {
    dispatch(getOrganizerEvents());
  }, [dispatch]);

  // Fetch attendees when an event is selected
  useEffect(() => {
    if (selectedEvent?._id) {
      dispatch(getEventAttendees(selectedEvent._id));
    }
  }, [selectedEvent, dispatch]);

  // Update filtered attendees when attendees or search term changes
  useEffect(() => {
    if (attendees && attendees.length > 0) {
      const filtered = attendees.filter(
        (attendee) =>
          attendee.user_id?.username
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          attendee.user_id?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          attendee.ticket_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAttendees(filtered);
    }
  }, [attendees, searchTerm]);

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle check-in toggle
  const handleCheckIn = (attendeeId) => {
    dispatch(
      markAttendance({
        attendeeId,
        attendanceData: { status: "attended" },
      })
    );
  };

  // Handle resend confirmation email
  const handleResendEmail = (ticketId) => {
    dispatch(resendConfirmation(ticketId));
  };

  // Handle export
  const handleExport = () => {
    if (filteredAttendees.length === 0) {
      toast.warning("No attendees to export");
      return;
    }

    try {
      // Show loading state if needed
      dispatch(
        exportAttendeeList({
          eventId: selectedEvent._id,
          format: exportType,
        })
      )
        .unwrap()
        .then(() => {
          // Success feedback
          // console.log(`${exportType.toUpperCase()} exported successfully`);
        })
        .catch((error) => {
          // Error feedback
          toast.error("Export failed");
          toast.info(
            `Failed to export as ${exportType.toUpperCase()}: ${error}`
          );
        });
    } catch (error) {
      // console.error("Export error:", error);
    }
  };

  // View QR Code
  const viewQRCode = async (ticketId) => {
    try {
      // In a real implementation, you would fetch the QR code from your backend
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/organizer/tickets/${ticketId}/qrcode`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch QR code");

      const data = await response.json();
      setSelectedQRCode(data.qrCode);
      setShowQRModal(true);
    } catch (error) {
      // console.error("Error fetching QR code:", error);
      toast.error("Error fetching QR code");
    }
  };

  // QR Code Modal
  const QRCodeModal = () => {
    if (!showQRModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="p-6 bg-white rounded-lg">
          <h3 className="mb-4 text-lg font-bold">Attendee QR Code</h3>
          <div className="flex justify-center">
            <img
              src={selectedQRCode}
              alt="Attendee QR Code"
              className="w-64 h-64"
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              onClick={() => setShowQRModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render loading state
  if (loading && !attendees.length) {
    return <div className="p-6">Loading attendees...</div>;
  }

  // Render error state
  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold">Event Attendees</h2>

      {/* Event Selection */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative inline-block w-64 text-left">
          <div>
            <button
              type="button"
              className="inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedEvent ? selectedEvent.title : "Select Event"}
              <ChevronDown className="w-5 h-5 ml-2" />
            </button>
          </div>

          {isDropdownOpen && (
            <div className="absolute left-0 z-10 w-full mt-2 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {events.map((event) => (
                  <button
                    key={event._id}
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => handleSelectEvent(event)}
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="flex items-center space-x-4">
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="inline-flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              >
                Export as {exportType.toUpperCase()}
                <ChevronDown className="w-5 h-5 ml-2" />
              </button>
            </div>

            {isExportDropdownOpen && (
              <div className="absolute right-0 z-10 w-40 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => {
                      setExportType("csv");
                      setIsExportDropdownOpen(false);
                    }}
                  >
                    CSV
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => {
                      setExportType("pdf");
                      setIsExportDropdownOpen(false);
                    }}
                  >
                    PDF
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleExport}
            disabled={!selectedEvent || filteredAttendees.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-12 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search attendees by name, email, ticket type..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Attendees Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Ticket Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Check-in Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                QR Code
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAttendees.length > 0 ? (
              filteredAttendees.map((attendee) => (
                <tr key={attendee._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {attendee.user_id?.username || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {attendee.user_id?.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {attendee.ticket_type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {attendee.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        attendee.attendance_status === "attended"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {attendee.attendance_status === "attended"
                        ? "Checked In"
                        : "Not Checked In"}
                      {attendee.check_in_time &&
                        ` (${new Date(
                          attendee.check_in_time
                        ).toLocaleTimeString()})`}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <button
                      onClick={() => viewQRCode(attendee._id)}
                      className="p-2 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200"
                      title="View QR Code"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCheckIn(attendee._id)}
                        className={`p-2 rounded-full ${
                          attendee.attendance_status === "attended"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                        title={
                          attendee.attendance_status === "attended"
                            ? "Already Checked In"
                            : "Mark as Checked In"
                        }
                        disabled={attendee.attendance_status === "attended"}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleResendEmail(attendee._id)}
                        className="p-2 text-blue-500 bg-blue-100 rounded-full hover:bg-blue-200"
                        title="Resend Confirmation Email"
                      >
                        <Mail className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 text-sm text-center text-gray-500"
                >
                  {selectedEvent
                    ? "No attendees found for this search"
                    : "Please select an event"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Attendance Summary */}
      {selectedEvent && filteredAttendees.length > 0 && (
        <div className="flex mt-4 space-x-4">
          <div className="p-3 bg-gray-100 rounded-lg">
            <span className="text-sm text-gray-500">Total Attendees:</span>
            <span className="ml-2 font-bold">{filteredAttendees.length}</span>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <span className="text-sm text-gray-500">Checked In:</span>
            <span className="ml-2 font-bold">
              {
                filteredAttendees.filter(
                  (a) => a.attendance_status === "attended"
                ).length
              }
            </span>
          </div>
          <div className="p-3 bg-yellow-100 rounded-lg">
            <span className="text-sm text-gray-500">Pending Check-in:</span>
            <span className="ml-2 font-bold">
              {
                filteredAttendees.filter(
                  (a) => a.attendance_status !== "attended"
                ).length
              }
            </span>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <QRCodeModal />
    </div>
  );
};

export default Attendees;
