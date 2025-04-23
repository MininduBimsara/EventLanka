import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizerEventById, updateEvent } from "../../Redux/Slicers/OrganizerSlice";
import {
  ArrowLeft,
  Upload,
  Loader,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const UpdateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get event details and loading states from Redux store
  const { currentEvent, loading, error } = useSelector(
    (state) => state.organizer
  );

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    duration: 1,
    category: "Other",
    ticket_types: [],
    banner: null,
  });

  // Preview image for banner
  const [previewImage, setPreviewImage] = useState(null);
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  // Ticket type form
  const [ticketType, setTicketType] = useState({
    type: "",
    price: 0,
    availability: 0,
  });

  // Fetch event data when component mounts
  useEffect(() => {
    dispatch(getOrganizerEventById(id));
  }, [dispatch, id]);

  // Populate form when event data is loaded
  useEffect(() => {
    if (currentEvent) {
      const eventDate = new Date(currentEvent.date);

      setFormData({
        title: currentEvent.title || "",
        description: currentEvent.description || "",
        location: currentEvent.location || "",
        date: eventDate.toISOString().slice(0, 16), // Format: YYYY-MM-DDThh:mm
        duration: currentEvent.duration || 1,
        category: currentEvent.category || "Other",
        ticket_types: currentEvent.ticket_types || [],
      });

      // Set preview image if banner exists
      if (currentEvent.banner) {
        setPreviewImage(`http://localhost:5000${currentEvent.banner}`);
      }
    }
  }, [currentEvent]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, banner: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle ticket type input changes
  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setTicketType({
      ...ticketType,
      [name]: name === "type" ? value : Number(value),
    });
  };

  // Add new ticket type
  const addTicketType = () => {
    if (
      ticketType.type &&
      ticketType.price >= 0 &&
      ticketType.availability >= 0
    ) {
      setFormData({
        ...formData,
        ticket_types: [...formData.ticket_types, ticketType],
      });
      setTicketType({ type: "", price: 0, availability: 0 });
    }
  };

  // Remove ticket type
  const removeTicketType = (index) => {
    const updatedTickets = [...formData.ticket_types];
    updatedTickets.splice(index, 1);
    setFormData({ ...formData, ticket_types: updatedTickets });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      // Create FormData for multipart/form-data submission (for file upload)
      const eventData = new FormData();

      // Append all form fields
      eventData.append("title", formData.title);
      eventData.append("description", formData.description);
      eventData.append("location", formData.location);
      eventData.append("date", formData.date);
      eventData.append("duration", formData.duration);
      eventData.append("category", formData.category);

      // Append ticket types as JSON string
      eventData.append("ticket_types", JSON.stringify(formData.ticket_types));

      // Only append banner if a new one was selected
      if (formData.banner instanceof File) {
        eventData.append("banner", formData.banner);
      }

      // Dispatch update event action
      const resultAction = await dispatch(updateEvent({ id, eventData }));

      if (updateEvent.fulfilled.match(resultAction)) {
        setSubmitSuccess(true);
        // Navigate back after successful update
        setTimeout(() => navigate("/manage-events"), 1500);
      } else {
        setSubmitError(resultAction.payload || "Failed to update event");
      }
    } catch (error) {
      setSubmitError(
        error.message || "An error occurred while updating the event"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle going back
  const goBack = () => {
    navigate("/organizer/manage-events");
  };

  // Show loading state while fetching event data
  if (loading && !currentEvent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-lg">Loading event data...</span>
      </div>
    );
  }

  // Show error if event couldn't be fetched
  if (error && !currentEvent) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="w-16 h-16 text-red-600" />
        <h2 className="mt-4 text-2xl font-bold">Error Loading Event</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={goBack}
          className="px-6 py-2 mt-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={goBack}
          className="p-2 mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Update Event</h1>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          {/* Event Details Section */}
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">Event Details</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Music">Music</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Arts">Arts</option>
                  <option value="Sports">Sports</option>
                  <option value="Food">Food</option>
                  <option value="Charity">Charity</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Duration (hours) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Banner Image Section */}
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">Event Banner</h2>

            <div className="flex flex-col items-center p-4 border-2 border-gray-300 border-dashed rounded-lg">
              {previewImage ? (
                <div className="mb-4">
                  <img
                    src={previewImage}
                    alt="Event banner preview"
                    className="object-cover w-full h-48 rounded-lg"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 mb-4 bg-gray-100 rounded-lg">
                  <Upload className="w-12 h-12 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    No banner image selected
                  </p>
                </div>
              )}

              <label className="px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700">
                {previewImage ? "Change Banner Image" : "Upload Banner Image"}
                <input
                  type="file"
                  name="banner"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Ticket Types Section */}
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">Ticket Types</h2>

            {/* Current ticket types */}
            {formData.ticket_types.length > 0 ? (
              <div className="mb-4">
                <h3 className="mb-2 text-sm font-medium text-gray-700">
                  Current Ticket Types
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Type
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Price
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Availability
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.ticket_types.map((ticket, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {ticket.type}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              ${ticket.price.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {ticket.availability}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => removeTicketType(index)}
                              className="text-sm font-medium text-red-600 hover:text-red-900"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="mb-4 text-sm text-gray-500">
                No ticket types added yet.
              </p>
            )}

            {/* Add new ticket type */}
            <div className="p-4 border rounded-lg">
              <h3 className="mb-3 text-sm font-medium text-gray-700">
                Add New Ticket Type
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="block mb-1 text-xs text-gray-700">
                    Type Name
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={ticketType.type}
                    onChange={handleTicketChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., VIP, Regular"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-700">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={ticketType.price}
                    onChange={handleTicketChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-700">
                    Available Tickets
                  </label>
                  <input
                    type="number"
                    name="availability"
                    value={ticketType.availability}
                    onChange={handleTicketChange}
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addTicketType}
                className="px-4 py-2 mt-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Add Ticket Type
              </button>
            </div>
          </div>

          {/* Submission Status */}
          {submitSuccess && (
            <div className="flex items-center p-4 mb-6 text-green-700 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 mr-2" />
              Event updated successfully! Redirecting...
            </div>
          )}

          {submitError && (
            <div className="flex items-center p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 mr-2" />
              {submitError}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={goBack}
              className="px-6 py-2 mr-4 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 text-white bg-blue-600 rounded-lg ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEvent;
