import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../../Redux/Slicers/OrganizerSlice";
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

export default function CreateEvent() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.organizer);

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
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setEvent((prev) => ({ ...prev, [name]: checked }));
    } else {
      setEvent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEvent((prev) => ({ ...prev, bannerFile: file }));
    const reader = new FileReader();
    reader.onload = (evt) => {
      setEvent((prev) => ({ ...prev, bannerImage: evt.target.result }));
    };
    reader.onerror = () => {
      console.error("Error reading file");
      setSubmissionMessage("Failed to load image preview");
    };
    reader.readAsDataURL(file);
  };

  const addTicketType = () =>
    setEvent((prev) => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, { name: "", price: 0, quantity: 0 }],
    }));

  const updateTicketType = (i, field, value) => {
    setEvent((prev) => {
      const tickets = [...prev.ticketTypes];
      tickets[i][field] = value;
      return { ...prev, ticketTypes: tickets };
    });
  };

  const removeTicketType = (i) =>
    setEvent((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, idx) => idx !== i),
    }));

  const togglePreview = () => setPreviewMode((v) => !v);

  const prepareEventData = () => {
    const dateISO = new Date(
      `${event.startDate}T${event.startTime}`
    ).toISOString();
    let duration = 1;
    if (event.endDate && event.endTime) {
      const end = new Date(`${event.endDate}T${event.endTime}`);
      duration = (end - new Date(dateISO)) / 36e5;
    }
    const ticket_types = event.ticketTypes.map((t) => ({
      type: t.name,
      price: parseFloat(t.price),
      availability: parseInt(t.quantity, 10),
    }));

    const fd = new FormData();
    fd.append("title", event.title);
    fd.append("description", event.description);
    fd.append("category", event.category);
    fd.append("location", event.location);
    fd.append("date", dateISO);
    fd.append("duration", duration);
    fd.append("ticket_types", JSON.stringify(ticket_types));
    if (event.bannerFile) fd.append("banner", event.bannerFile);
    return fd;
  };

  const saveEvent = (status) => {
    setSubmissionMessage("");
    try {
      const formData = prepareEventData();
      formData.append(
        "event_status",
        status === "published" ? "pending" : "draft"
      );
      dispatch(createEvent(formData))
        .then((res) => {
          if (res.payload) {
            setSubmissionMessage(
              `Event ${
                status === "published" ? "submitted" : "saved as draft"
              } successfully!`
            );
          } else {
            throw new Error(res.error?.message || "Unknown error");
          }
        })
        .catch((err) => {
          setSubmissionMessage(`Error: ${err.message}`);
        });
    } catch (err) {
      setSubmissionMessage(`Error: ${err.message}`);
    }
  };

  const EventPreview = () => (
    <div className="overflow-hidden bg-white rounded-lg shadow-lg">
      {event.bannerImage ? (
        <img src={event.bannerImage} className="object-cover w-full h-64" />
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-200">
          <span className="text-gray-500">No banner uploaded</span>
        </div>
      )}
      <div className="p-6">
        <h1 className="mb-2 text-2xl font-bold">
          {event.title || "Event Title"}
        </h1>
        <p className="flex items-center mb-4 text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          {event.startDate
            ? `${event.startDate} @ ${event.startTime}`
            : "Date not set"}
        </p>
        <p className="flex items-center mb-4 text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          {event.location || "Location not set"}
        </p>
        <p className="flex items-center mb-4 text-gray-600">
          <Tag className="w-4 h-4 mr-2" />
          {event.category || "Category not set"}
        </p>
        <div className="pt-4 mt-4 border-t">
          <h2 className="mb-2 font-semibold">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {event.description || "No description provided"}
          </p>
        </div>
        <div className="pt-4 mt-4 border-t">
          <h2 className="mb-2 font-semibold">Tickets</h2>
          {event.ticketTypes.map((t, i) => (
            <div
              key={i}
              className="flex justify-between p-3 mb-2 rounded bg-gray-50"
            >
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-sm text-gray-500">{t.quantity} available</p>
              </div>
              <p className="font-semibold">${t.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
        <div className="space-x-2">
          <button
            onClick={togglePreview}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {previewMode ? "Edit" : "Preview"}
          </button>
          <button
            onClick={() => saveEvent("draft")}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            {loading ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => saveEvent("published")}
            disabled={loading}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {submissionMessage && (
        <div
          className={`p-4 mb-4 rounded ${
            error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {submissionMessage}
        </div>
      )}

      {previewMode ? (
        <EventPreview />
      ) : (
        <div className="p-6 space-y-8 bg-white rounded-lg shadow-md">
          {/* --- Event Details --- */}
          <section>
            <h2 className="pb-2 mb-4 font-semibold border-b">Event Details</h2>
            <div className="mb-4">
              <label className="block mb-1">Title *</label>
              <div className="flex overflow-hidden border rounded">
                <span className="p-2 border-r bg-gray-50">
                  <Edit3 className="w-5 h-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  name="title"
                  value={event.title}
                  onChange={handleInputChange}
                  className="flex-1 p-2 focus:outline-none"
                  placeholder="Event name"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={event.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-3 border rounded focus:outline-none"
                placeholder="Describe your event"
              />
              <p className="text-xs text-gray-500">Markdown is supported.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1">Category *</label>
                <div className="flex overflow-hidden border rounded">
                  <span className="p-2 border-r bg-gray-50">
                    <Tag className="w-5 h-5 text-gray-400" />
                  </span>
                  <select
                    name="category"
                    value={event.category}
                    onChange={handleInputChange}
                    className="flex-1 p-2 focus:outline-none"
                    required
                  >
                    <option value="">Select one…</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1">Location *</label>
                <div className="flex overflow-hidden border rounded">
                  <span className="p-2 border-r bg-gray-50">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    name="location"
                    value={event.location}
                    onChange={handleInputChange}
                    className="flex-1 p-2 focus:outline-none"
                    placeholder="Venue"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* --- Date & Time --- */}
          <section>
            <h2 className="pb-2 mb-4 font-semibold border-b">Date & Time</h2>
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
              <div>
                <label className="block mb-1">Start Date *</label>
                <div className="flex overflow-hidden border rounded">
                  <span className="p-2 border-r bg-gray-50">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </span>
                  <input
                    type="date"
                    name="startDate"
                    value={event.startDate}
                    onChange={handleInputChange}
                    className="flex-1 p-2 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1">Start Time *</label>
                <div className="flex overflow-hidden border rounded">
                  <span className="p-2 border-r bg-gray-50">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </span>
                  <input
                    type="time"
                    name="startTime"
                    value={event.startTime}
                    onChange={handleInputChange}
                    className="flex-1 p-2 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1">End Date</label>
                <div className="flex overflow-hidden border rounded">
                  <span className="p-2 border-r bg-gray-50">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </span>
                  <input
                    type="date"
                    name="endDate"
                    value={event.endDate}
                    onChange={handleInputChange}
                    className="flex-1 p-2 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1">End Time</label>
                <div className="flex overflow-hidden border rounded">
                  <span className="p-2 border-r bg-gray-50">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </span>
                  <input
                    type="time"
                    name="endTime"
                    value={event.endTime}
                    onChange={handleInputChange}
                    className="flex-1 p-2 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* --- Banner Image --- */}
          <section>
            <h2 className="pb-2 mb-4 font-semibold border-b">Banner Image</h2>
            {event.bannerImage ? (
              <div className="mb-4">
                <img
                  src={event.bannerImage}
                  className="object-cover w-full h-48 rounded"
                />
                <button
                  onClick={() =>
                    setEvent((prev) => ({
                      ...prev,
                      bannerImage: null,
                      bannerFile: null,
                    }))
                  }
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="p-6 text-center border-2 border-dashed rounded">
                <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="mb-1 text-gray-500">
                  Drag & drop or click to upload
                </p>
                <input
                  type="file"
                  name="banner"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className="inline-block px-4 py-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
                >
                  Select Image
                </label>
              </div>
            )}
          </section>

          {/* --- Tickets --- */}
          <section>
            <h2 className="pb-2 mb-4 font-semibold border-b">Ticket Types</h2>
            {event.ticketTypes.map((t, i) => (
              <div key={i} className="p-4 mb-4 space-y-3 rounded bg-gray-50">
                <div className="flex justify-between">
                  <h3 className="font-medium">Ticket #{i + 1}</h3>
                  {event.ticketTypes.length > 1 && (
                    <button
                      onClick={() => removeTicketType(i)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block mb-1">Name *</label>
                    <div className="flex overflow-hidden border rounded">
                      <span className="p-2 border-r bg-gray-50">
                        <Ticket className="w-5 h-5 text-gray-400" />
                      </span>
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) =>
                          updateTicketType(i, "name", e.target.value)
                        }
                        className="flex-1 p-2 focus:outline-none"
                        placeholder="VIP, General…"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1">Price ($) *</label>
                    <div className="flex overflow-hidden border rounded">
                      <span className="p-2 border-r bg-gray-50">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                      </span>
                      <input
                        type="number"
                        value={t.price}
                        onChange={(e) =>
                          updateTicketType(i, "price", e.target.value)
                        }
                        className="flex-1 p-2 focus:outline-none"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1">Quantity Available *</label>
                    <div className="flex overflow-hidden border rounded">
                      <span className="p-2 border-r bg-gray-50">
                        <Users className="w-5 h-5 text-gray-400" />
                      </span>
                      <input
                        type="number"
                        value={t.quantity}
                        onChange={(e) =>
                          updateTicketType(i, "quantity", e.target.value)
                        }
                        className="flex-1 p-2 focus:outline-none"
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
                />
              </svg>
              Add Ticket Type
            </button>
          </section>

          {/* --- Discounts --- */}
          <section>
            <h2 className="pb-2 mb-4 font-semibold border-b">
              Additional Options
            </h2>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="enableDiscounts"
                checked={event.enableDiscounts}
                onChange={handleInputChange}
                className="w-5 h-5 form-checkbox"
              />
              <span>Enable discount codes</span>
            </label>
            {event.enableDiscounts && (
              <p className="mt-2 text-sm text-gray-500">
                You’ll be able to create discount codes after saving.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
