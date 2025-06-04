import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTicketAlt,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";
import { fetchAllEvents } from "../../../Redux//Thunks/eventThunk";
import { useNavigate } from "react-router-dom";

// Updated Trending Events Slider Component
const TrendingEventsSlider = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const [currentSlide, setCurrentSlide] = useState(0);
  const API_URL = "http://localhost:5000";

  // Fetch events when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        dispatch(fetchAllEvents());
      } catch (error) {
        console.error("Failed to fetch events:", error);
        // Optionally set an error state to show a user-friendly message
      }
    };

    fetchEvents();
  }, [dispatch]);

  // Get the 4 most recent approved events
  const trendingEvents = Array.isArray(events)
    ? events
        .filter((event) => event.event_status === "approved")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4)
    : [];

  // Auto-slide functionality
  useEffect(() => {
    if (trendingEvents.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === trendingEvents.length - 1 ? 0 : prev + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [trendingEvents.length]);

  // Manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Added getBannerUrl function similar to FeaturedEvents component
  const getBannerUrl = (event) => {
    if (!event || !event.banner) {
      return "https://via.placeholder.com/600x300.png?text=No+Banner";
    }

    // If it's just a filename with no slashes
    if (!event.banner.includes("/")) {
      return `${API_URL}/event-images/${event.banner}`;
    }

    // If it starts with a slash, assume it's a relative path to the server
    if (event.banner.startsWith("/")) {
      return `${API_URL}${event.banner}`;
    }

    // Otherwise use as is (full URL)
    return event.banner;
  };

  // If there are no events or still loading, show loading state
  if (loading) {
    return (
      <div className="py-20 bg-blue-800 select-none" id="trending-events">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Trending Events
            </h2>
            <div className="w-24 h-1 mx-auto bg-pink-400 rounded-full"></div>
            <p className="mt-4 text-blue-100">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  // If there's an error, show error message
  if (error) {
    return (
      <div className="py-20 bg-blue-800" id="trending-events">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Trending Events
            </h2>
            <div className="w-24 h-1 mx-auto bg-pink-400 rounded-full"></div>
            <p className="mt-4 text-red-300">Error loading events: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  // If there are no events, show no events message
  if (trendingEvents.length === 0) {
    return (
      <div className="py-20 bg-blue-800 select-none" id="trending-events">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Trending Events
            </h2>
            <div className="w-24 h-1 mx-auto bg-pink-400 rounded-full"></div>
            <p className="mt-4 text-blue-100">
              No events available at the moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-blue-800 select-none" id="trending-events">
      <div className="container px-4 mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Trending Events
          </h2>
          <div className="w-24 h-1 mx-auto bg-pink-400 rounded-full"></div>
          <p className="mt-4 text-blue-100">
            Discover the hottest concerts and festivals happening near you
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg bg-white/10 backdrop-blur-sm">
          {/* Slides container */}
          <div className="relative h-96 sm:h-80">
            {trendingEvents.map((event, index) => (
              <div
                key={event._id}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out p-6
                  ${
                    index === currentSlide
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
                  }`}
              >
                <div className="flex flex-col h-full md:flex-row">
                  <div className="w-full mb-4 md:w-1/2 md:mb-0 md:pr-6">
                    <div className="flex flex-col justify-center h-full">
                      <h3 className="mb-3 text-2xl font-bold text-white">
                        {event.title}
                      </h3>
                      <p className="mb-4 text-blue-100">{event.description}</p>

                      <div className="flex items-center mb-2 text-blue-100">
                        <FaCalendarAlt className="mr-2" />
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <div className="flex items-center mb-4 text-blue-100">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{event.location}</span>
                      </div>

                      <button
                        className="px-6 py-2 mt-2 font-medium text-blue-900 transition-all duration-300 transform bg-white rounded-full hover:bg-pink-100 hover:scale-105 w-fit"
                        onClick={() => navigate(`/event/${event._id}`)}
                      >
                        Book Tickets
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-48 md:w-1/2 md:h-full">
                    {/* Event image with error handling */}
                    <div className="flex items-center justify-center h-full border rounded-lg bg-pink-400/40 border-white/20">
                      {event.banner ? (
                        <img
                          src={getBannerUrl(event)}
                          alt={event.title}
                          className="object-cover w-full h-full rounded-lg"
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              e.target.src
                            );
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/600x300.png?text=Image+Error";
                          }}
                        />
                      ) : (
                        <div className="relative">
                          {/* Decorative element similar to logo */}
                          <div className="absolute w-32 h-12 transform -translate-y-4 border-t-2 rounded-full border-yellow-300/70 -rotate-12"></div>
                          <span className="relative text-xl font-semibold text-white">
                            {event.category}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center p-4 space-x-2 bg-blue-900/50">
            {trendingEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 
                  ${index === currentSlide ? "bg-white" : "bg-white/30"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Trending Events Link */}
        <div className="mt-8 text-center">
          <a
            href="/events"
            className="inline-flex items-center text-white transition-colors hover:text-pink-200"
          >
            View All Trending Events <FaArrowRight className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TrendingEventsSlider;
