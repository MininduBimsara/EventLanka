import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/events`;

// Configure axios instance for events API
const eventsApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Events API functions
export const eventsApiService = {
  // Fetch all events (authenticated)
  fetchEvents: async () => {
    const response = await eventsApi.get("/");
    return response.data;
  },

  // Fetch all events (public, no authentication required)
  fetchAllEvents: async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/events/public/all`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Ensure the response is an array
    const events = Array.isArray(response.data) ? response.data : [];

    // Ensure banner paths are properly formatted
    return events.map((event) => ({
      ...event,
      banner: event.banner || null,
    }));
  },

  // Create a new event
  createEvent: async (eventData) => {
    const config = {
      headers: {},
    };

    // Check if eventData is FormData (for file uploads)
    if (eventData instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    const response = await eventsApi.post("/", eventData, config);
    return response.data;
  },

  // Update an existing event
  updateEvent: async (eventId, eventData) => {
    const config = {
      headers: {},
    };

    // Check if eventData is FormData (for file uploads)
    if (eventData instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    const response = await eventsApi.put(`/${eventId}`, eventData, config);
    return response.data;
  },

  // Delete an event
  deleteEvent: async (eventId) => {
    await eventsApi.delete(`/${eventId}`);
    return eventId;
  },

  // Fetch event by ID
  fetchEventById: async (eventId) => {
    const response = await eventsApi.get(`/${eventId}`);

    // Check if booking is available
    if (!response.data.bookingAvailable) {
      throw new Error("Booking is not available for this event");
    }

    return response.data;
  },
};

export default eventsApiService;
