import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../../Redux/Thunks/organizerThunk";
import {
  Calendar,
  Clock,
  MapPin,
  Image,
  Edit3,
  Tag,
  Ticket,
  DollarSign,
  Users,
} from "lucide-react";
import { useToast } from "../../components/Common/Notification/ToastContext"; // Updated import


export default function CreateEvent() {
  const toast = useToast(); // Use the toast context for notifications
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.organizer);

  const [event, setEvent] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    bannerImage: null,
    bannerFile: null,
    ticketTypes: [{ name: "General Admission", price: 0, quantity: 100 }],
    enableDiscounts: false,
    status: "draft", // draft or published
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the actual file object for FormData
      setEvent((prevEvent) => ({ ...prevEvent, bannerFile: file }));

      // Create a preview URL with proper error handling
      const reader = new FileReader();

      reader.onload = (loadEvent) => {
        // Use a callback form of setState to ensure we're working with latest state
        setEvent((prevEvent) => ({
          ...prevEvent,
          bannerImage: loadEvent.target.result,
        }));
      };

      reader.onerror = () => {
        toast.error("Error reading file");
        // Handle the error gracefully - maybe set an error state
        setSubmissionMessage("Failed to load image preview");
      };

      // Start reading the file
      try {
        reader.readAsDataURL(file);
      } catch (err) {
        toast.error("Error starting file read");
        setSubmissionMessage("Failed to process image");
      }
    }
  };

  const addTicketType = () => {
    setEvent({
      ...event,
      ticketTypes: [...event.ticketTypes, { name: "", price: 0, quantity: 0 }],
    });
  };

  const updateTicketType = (index, field, value) => {
    const updatedTickets = [...event.ticketTypes];
    updatedTickets[index][field] = value;
    setEvent({ ...event, ticketTypes: updatedTickets });
  };

  const removeTicketType = (index) => {
    const updatedTickets = event.ticketTypes.filter((_, i) => i !== index);
    setEvent({ ...event, ticketTypes: updatedTickets });
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  // Convert frontend data to match backend model
const prepareEventData = () => {
  // Format the date and time
  const date = new Date(`${event.startDate}T${event.startTime}`);

  // Calculate duration in hours if end date/time provided
  let duration = 1; // Default 1 hour
  if (event.endDate && event.endTime) {
    const endDate = new Date(`${event.endDate}T${event.endTime}`);
    duration = (endDate - date) / (1000 * 60 * 60); // Convert milliseconds to hours
  }

  // Format ticket types to match backend model
  const ticket_types = event.ticketTypes.map((ticket) => ({
    type: ticket.name,
    price: parseFloat(ticket.price),
    availability: parseInt(ticket.quantity),
  }));

  // Create FormData for multipart/form-data submission (for file upload)
  const formData = new FormData();
  formData.append("title", event.title);
  formData.append("description", event.description);
  formData.append("category", event.category);
  formData.append("location", event.location);
  formData.append("date", date.toISOString());
  formData.append("duration", duration.toString());

  // Handle ticket types properly - convert to string and send as a single field
  formData.append("ticket_types", JSON.stringify(ticket_types));

  // Append banner file if available
  if (event.bannerFile) {
    formData.append("banner", event.bannerFile);
  }

  return formData;
};

  const saveEvent = (status) => {
    try {
      const formData = prepareEventData();

      // Add status to the form data
      formData.append(
        "event_status",
        status === "published" ? "pending" : "draft"
      );

      // Dispatch without unwrap, using then/catch instead
      dispatch(createEvent(formData))
        .then((result) => {
          // Check if there's a payload or if it's an error action
          if (result.payload) {
            setSubmissionMessage(
              `Event ${
                status === "published"
                  ? "submitted for approval"
                  : "saved as draft"
              } successfully!`
            );

            // Reset form if necessary
            if (status === "published") {
              // Reset form or redirect to events list
              // You might want to add your reset logic here
            }
          } else if (result.error) {
            // Handle error case from createAsyncThunk rejection
            setSubmissionMessage(
              `Error: ${result.error.message || "Failed to save event"}`
            );
          }
        })
        .catch((err) => {
          // Handle any other errors that might have occurred
          setSubmissionMessage(
            `Error: ${err.message || "Failed to save event"}`
          );
        });
    } catch (err) {
      // Handle synchronous errors in the try block
      setSubmissionMessage(`Error: ${err.message || "Failed to save event"}`);
    }
  };

  // Preview component
  const EventPreview = () => (
    <div className="overflow-hidden bg-white rounded-lg shadow-lg">
      {event.bannerImage && (
        <div className="relative h-64 bg-gray-200">
          <img
            src={event.bannerImage}
            alt="Event banner"
            className="object-cover w-full h-full"
          />
        </div>
      )}
      {!event.bannerImage && (
        <div className="flex items-center justify-center h-64 bg-gray-200">
          <p className="text-gray-500">No banner image uploaded</p>
        </div>
      )}

      <div className="p-6">
        <h1 className="mb-2 text-2xl font-bold">
          {event.title || "Event Title"}
        </h1>

        <div className="flex items-center mb-4 text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            {event.startDate
              ? `${event.startDate} at ${event.startTime}`
              : "Date not set"}
          </span>
        </div>

        <div className="flex items-center mb-4 text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{event.location || "Location not set"}</span>
        </div>

        <div className="flex items-center mb-4 text-gray-600">
          <Tag className="w-4 h-4 mr-2" />
          <span>{event.category || "Category not set"}</span>
        </div>

        <div className="pt-4 mt-4 border-t border-gray-200">
          <h2 className="mb-2 text-lg font-semibold">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {event.description || "No description provided."}
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-gray-200">
          <h2 className="mb-4 text-lg font-semibold">Tickets</h2>
          {event.ticketTypes.map((ticket, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 mb-2 rounded bg-gray-50"
            >
              <div>
                <p className="font-medium">{ticket.name || "Unnamed Ticket"}</p>
                <p className="text-sm text-gray-500">
                  {ticket.quantity} available
                </p>
              </div>
              <p className="font-semibold">${ticket.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Categories for dropdown
  const categories = [
    "Music",
    "Conference",
    "Workshop",
    "Sports",
    "Food & Drink",
    "Charity",
    "Arts",
    "Business",
    "Party",
    "Other",
  ];

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {event.title ? `Edit: ${event.title}` : "Create New Event"}
        </h1>
        <div className="space-x-3">
          <button
            onClick={togglePreview}
            className="px-4 py-2 transition bg-gray-200 rounded-md hover:bg-gray-300"
          >
            {previewMode ? "Edit" : "Preview"}
          </button>
          <button
            onClick={() => saveEvent("draft")}
            className="px-4 py-2 transition bg-gray-100 rounded-md hover:bg-gray-200"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => saveEvent("published")}
            className="px-4 py-2 text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {submissionMessage && (
        <div
          className={`p-4 mb-4 rounded-md ${
            error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {submissionMessage}
        </div>
      )}

      {previewMode ? (
        <EventPreview />
      ) : (
        <div className="p-6 bg-white rounded-lg shadow-md">
          {/* Basic Info Section */}
          <div className="mb-8">
            <h2 className="pb-2 mb-4 text-lg font-semibold border-b">
              Event Details
            </h2>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700">Event Title *</label>
              <div className="flex items-center overflow-hidden border rounded-md">
                <span className="p-2 border-r bg-gray-50">
                  <Edit3 className="w-5 h-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  name="title"
                  value={event.title}
                  onChange={handleInputChange}
                  className="w-full p-2 focus:outline-none"
                  placeholder="Give your event a name"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700">Description</label>
              <textarea
                name="description"
                value={event.description}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-32"
                placeholder="Describe your event"
                rows="5"
              ></textarea>
              <p className="mt-1 text-sm text-gray-500">
                You can use markdown for formatting
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-gray-700">Category *</label>
                <div className="flex items-center overflow-hidden border rounded-md">
                  <span className="p-2 border-r bg-gray-50">
                    <Tag className="w-5 h-5 text-gray-400" />
                  </span>
                  <select
                    name="category"
                    value={event.category}
                    onChange={handleInputChange}
                    className="w-full p-2 focus:outline-none"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Location *</label>
                <div className="flex items-center overflow-hidden border rounded-md">
                  <span className="p-2 border-r bg-gray-50">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    name="location"
                    value={event.location}
                    onChange={handleInputChange}
                    className="w-full p-2 focus:outline-none"
                    placeholder="Add a venue"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date and Time Section */}
          <div className="mb-8">
            <h2 className="pb-2 mb-4 text-lg font-semibold border-b">
              Date and Time
            </h2>

            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-gray-700">Start Date *</label>
                <div className="flex items-center overflow-hidden border rounded-md">
                  <span className="p-2 border-r bg-gray-50">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </span>
                  <input
                    type="date"
                    name="startDate"
                    value={event.startDate}
                    onChange={handleInputChange}
                    className="w-full p-2 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Start Time *</label>
                <div className="flex items-center overflow-hidden border rounded-md">
                  <span className="p-2 border-r bg-gray-50">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </span>
                  <input
                    type="time"
                    name="startTime"
                    value={event.startTime}
                    onChange={handleInputChange}
                    className="w-full p-2 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-gray-700">End Date</label>
                <div className="flex items-center overflow-hidden border rounded-md">
                  <span className="p-2 border-r bg-gray-50">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </span>
                  <input
                    type="date"
                    name="endDate"
                    value={event.endDate}
                    onChange={handleInputChange}
                    className="w-full p-2 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">End Time</label>
                <div className="flex items-center overflow-hidden border rounded-md">
                  <span className="p-2 border-r bg-gray-50">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </span>
                  <input
                    type="time"
                    name="endTime"
                    value={event.endTime}
                    onChange={handleInputChange}
                    className="w-full p-2 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Banner Image Section */}
          <div className="mb-8">
            <h2 className="pb-2 mb-4 text-lg font-semibold border-b">
              Banner Image
            </h2>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700">
                Upload Event Banner
              </label>

              {event.bannerImage ? (
                <div className="mb-4">
                  <img
                    src={event.bannerImage}
                    alt="Event banner preview"
                    className="object-cover w-full h-48 rounded-md"
                  />
                  <button
                    onClick={() =>
                      setEvent({
                        ...event,
                        bannerImage: null,
                        bannerFile: null,
                      })
                    }
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="p-6 text-center border-2 border-gray-300 border-dashed rounded-md">
                  <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="mb-2 text-gray-500">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-xs text-gray-400">
                    Recommended size: 1200 x 600 pixels
                  </p>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="banner-upload"
                    accept="image/*"
                  />
                  <label
                    htmlFor="banner-upload"
                    className="inline-block px-4 py-2 mt-3 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
                  >
                    Select Image
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Types Section */}
          <div className="mb-8">
            <h2 className="pb-2 mb-4 text-lg font-semibold border-b">
              Ticket Types
            </h2>

            {event.ticketTypes.map((ticket, index) => (
              <div key={index} className="p-4 mb-4 rounded-md bg-gray-50">
                <div className="flex justify-between mb-3">
                  <h3 className="font-medium">Ticket Type #{index + 1}</h3>
                  {event.ticketTypes.length > 1 && (
                    <button
                      onClick={() => removeTicketType(index)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block mb-2 text-gray-700">Name *</label>
                    <div className="flex items-center overflow-hidden bg-white border rounded-md">
                      <span className="p-2 border-r bg-gray-50">
                        <Ticket className="w-5 h-5 text-gray-400" />
                      </span>
                      <input
                        type="text"
                        value={ticket.name}
                        onChange={(e) =>
                          updateTicketType(index, "name", e.target.value)
                        }
                        className="w-full p-2 focus:outline-none"
                        placeholder="e.g. VIP, General"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-700">
                      Price ($) *
                    </label>
                    <div className="flex items-center overflow-hidden bg-white border rounded-md">
                      <span className="p-2 border-r bg-gray-50">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                      </span>
                      <input
                        type="number"
                        value={ticket.price}
                        onChange={(e) =>
                          updateTicketType(
                            index,
                            "price",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full p-2 focus:outline-none"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-700">
                      Quantity Available *
                    </label>
                    <div className="flex items-center overflow-hidden bg-white border rounded-md">
                      <span className="p-2 border-r bg-gray-50">
                        <Users className="w-5 h-5 text-gray-400" />
                      </span>
                      <input
                        type="number"
                        value={ticket.quantity}
                        onChange={(e) =>
                          updateTicketType(
                            index,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full p-2 focus:outline-none"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addTicketType}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Add Another Ticket Type
            </button>
          </div>

          {/* Additional Options */}
          <div className="mb-8">
            <h2 className="pb-2 mb-4 text-lg font-semibold border-b">
              Additional Options
            </h2>

            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={event.enableDiscounts}
                  onChange={(e) =>
                    setEvent({ ...event, enableDiscounts: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 form-checkbox"
                />
                <span className="ml-2 text-gray-700">
                  Enable discount codes
                </span>
              </label>
            </div>

            {event.enableDiscounts && (
              <div className="p-4 mb-4 rounded-md bg-gray-50">
                <p className="mb-2 text-sm text-gray-500">
                  You'll be able to create discount codes after saving your
                  event.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
