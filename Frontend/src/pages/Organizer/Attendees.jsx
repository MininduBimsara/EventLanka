import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Mail,
  Check,
  ChevronDown,
  QrCode,
} from "lucide-react";

const Attendees = () => {
  // State management
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [filteredAttendees, setFilteredAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [exportType, setExportType] = useState("csv");
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // In a real application, this would be an API call
    const mockEvents = [
      { id: 1, name: "Annual Conference 2025" },
      { id: 2, name: "Tech Summit" },
      { id: 3, name: "Networking Mixer" },
    ];

    const mockAttendees = [
      {
        id: 1,
        eventId: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "555-123-4567",
        ticketType: "VIP",
        paymentStatus: "Paid",
        checkedIn: false,
        qrCode: "qr_code_1",
      },
      {
        id: 2,
        eventId: 1,
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "555-987-6543",
        ticketType: "General",
        paymentStatus: "Paid",
        checkedIn: true,
        qrCode: "qr_code_2",
      },
      {
        id: 3,
        eventId: 1,
        name: "Alex Johnson",
        email: "alex@example.com",
        phone: "555-456-7890",
        ticketType: "General",
        paymentStatus: "Pending",
        checkedIn: false,
        qrCode: "qr_code_3",
      },
      {
        id: 4,
        eventId: 2,
        name: "Sarah Williams",
        email: "sarah@example.com",
        phone: "555-789-0123",
        ticketType: "Premium",
        paymentStatus: "Paid",
        checkedIn: false,
        qrCode: "qr_code_4",
      },
      {
        id: 5,
        eventId: 2,
        name: "Michael Brown",
        email: "michael@example.com",
        phone: "555-234-5678",
        ticketType: "General",
        paymentStatus: "Refunded",
        checkedIn: false,
        qrCode: "qr_code_5",
      },
    ];

    setEvents(mockEvents);
    setAttendees(mockAttendees);

    // Default to the first event
    if (mockEvents.length > 0) {
      setSelectedEvent(mockEvents[0]);
      setFilteredAttendees(
        mockAttendees.filter((a) => a.eventId === mockEvents[0].id)
      );
    }
  }, []);

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    const eventAttendees = attendees.filter((a) => a.eventId === event.id);
    setFilteredAttendees(eventAttendees);
    setIsDropdownOpen(false);
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (selectedEvent) {
      const filtered = attendees.filter(
        (a) =>
          a.eventId === selectedEvent.id &&
          (a.name.toLowerCase().includes(term) ||
            a.email.toLowerCase().includes(term) ||
            a.phone.includes(term) ||
            a.ticketType.toLowerCase().includes(term) ||
            a.paymentStatus.toLowerCase().includes(term))
      );
      setFilteredAttendees(filtered);
    }
  };

  // Handle check-in toggle
  const handleCheckIn = (id) => {
    const updatedAttendees = attendees.map((attendee) => {
      if (attendee.id === id) {
        return { ...attendee, checkedIn: !attendee.checkedIn };
      }
      return attendee;
    });

    setAttendees(updatedAttendees);

    if (selectedEvent) {
      setFilteredAttendees(
        updatedAttendees.filter(
          (a) =>
            a.eventId === selectedEvent.id &&
            (a.name.toLowerCase().includes(searchTerm) ||
              a.email.toLowerCase().includes(searchTerm) ||
              a.phone.includes(searchTerm) ||
              a.ticketType.toLowerCase().includes(searchTerm) ||
              a.paymentStatus.toLowerCase().includes(searchTerm))
        )
      );
    }
  };

  // Handle resend confirmation email
  const handleResendEmail = (attendee) => {
    // In a real application, this would trigger an API call
    alert(`Confirmation email resent to ${attendee.email}`);
  };

  // Handle export
  const handleExport = () => {
    if (filteredAttendees.length === 0) {
      alert("No attendees to export");
      return;
    }

    if (exportType === "csv") {
      exportToCSV();
    } else {
      exportToPDF();
    }
  };

  const exportToCSV = () => {
    // Prepare CSV data
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Ticket Type",
      "Payment Status",
      "Checked In",
    ];
    const csvRows = [headers.join(",")];

    filteredAttendees.forEach((attendee) => {
      const row = [
        attendee.name,
        attendee.email,
        attendee.phone,
        attendee.ticketType,
        attendee.paymentStatus,
        attendee.checkedIn ? "Yes" : "No",
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");

    // Create a Blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute("download", `${selectedEvent?.name}-attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // In a real application, this would generate a PDF
    alert("PDF export functionality would be implemented here");
  };

  // View QR Code
  const viewQRCode = (qrCode) => {
    // In a real application, this would display the QR code
    alert(`Viewing QR Code: ${qrCode}`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
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
              {selectedEvent ? selectedEvent.name : "Select Event"}
              <ChevronDown className="w-5 h-5 ml-2" />
            </button>
          </div>

          {isDropdownOpen && (
            <div className="absolute left-0 z-10 w-full mt-2 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {events.map((event) => (
                  <button
                    key={event.id}
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => handleSelectEvent(event)}
                  >
                    {event.name}
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
                Phone
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
                Payment Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Check-in
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
                <tr key={attendee.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {attendee.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {attendee.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {attendee.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {attendee.ticketType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        attendee.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-800"
                          : attendee.paymentStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {attendee.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <button
                      onClick={() => handleCheckIn(attendee.id)}
                      className={`p-2 rounded-full ${
                        attendee.checkedIn
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <button
                      onClick={() => viewQRCode(attendee.qrCode)}
                      className="p-2 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <button
                      onClick={() => handleResendEmail(attendee)}
                      className="p-2 text-blue-500 bg-blue-100 rounded-full hover:bg-blue-200"
                      title="Resend Confirmation Email"
                    >
                      <Mail className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
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
              {filteredAttendees.filter((a) => a.checkedIn).length}
            </span>
          </div>
          <div className="p-3 bg-yellow-100 rounded-lg">
            <span className="text-sm text-gray-500">Pending Check-in:</span>
            <span className="ml-2 font-bold">
              {filteredAttendees.filter((a) => !a.checkedIn).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendees;
