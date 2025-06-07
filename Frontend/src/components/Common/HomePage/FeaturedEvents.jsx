import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents } from "../../../Redux/Thunks/eventThunk";
import { useNavigate } from "react-router-dom";

// Enhanced Featured Events with modern styling and improved carousel functionality
const FeaturedEvents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { events = [], loading, error } = useSelector((state) => state.events);
  const carouselRef = useRef(null);
  const API_URL = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  // Format date for better display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString; // Return original if parsing fails
    }
  };

  // Fixed getBannerUrl function - now accepts event as a parameter
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

  // Responsive settings for number of events per slide
  const getEventsPerSlide = () => {
    return 4; // We'll handle responsiveness with CSS
  };

  const eventsPerSlide = getEventsPerSlide();
  const totalSlides = Math.ceil(events.length / eventsPerSlide);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeEvent, setActiveEvent] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Manual navigation with transition state
  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Previous and Next slide navigation
  const goToPrevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToNextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Handle loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded"
        role="alert"
      >
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <section
      className="relative w-full py-16 overflow-hidden select-none md:py-24 bg-gray-50"
      id="featured-events"
    >
      {/* Enhanced Decorative Elements */}
      <div className="absolute left-0 hidden w-64 h-64 transform -translate-y-24 bg-pink-100 rounded-full opacity-30 blur-lg lg:block -z-10"></div>
      <div className="absolute bottom-0 right-0 hidden w-48 h-48 transform translate-y-12 bg-blue-100 rounded-full opacity-30 blur-lg lg:block -z-10"></div>
      <div className="absolute hidden w-32 h-32 transform -translate-y-1/2 bg-yellow-100 rounded-full top-1/2 left-1/3 opacity-20 blur-md lg:block -z-10"></div>

      <div className="container max-w-full px-4 mx-auto md:max-w-screen-xl">
        {/* Enhanced Section Header */}
        <div className="relative mb-12 text-center md:mb-20">
          <div className="inline-block px-4 py-1 mb-3 text-xs font-bold tracking-wider text-pink-500 uppercase bg-pink-100 rounded-full md:text-sm">
            Discover What's Happening
          </div>
          <h3 className="mb-6 text-3xl font-bold text-blue-900 md:text-5xl">
            Featured Events
          </h3>
          <div className="flex items-center justify-center">
            <div className="w-16 h-1 bg-pink-400 rounded-full md:w-24"></div>
            <div className="w-3 h-3 mx-2 bg-blue-900 rounded-full md:w-4 md:h-4"></div>
            <div className="w-16 h-1 bg-pink-400 rounded-full md:w-24"></div>
          </div>
        </div>

        {/* Event Cards Carousel Container */}
        <div
          className="relative"
          ref={carouselRef}
          onMouseEnter={() => setActiveEvent("carousel")}
          onMouseLeave={() => setActiveEvent(null)}
        >
          {/* CAROUSEL NAVIGATION ARROWS */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={goToPrevSlide}
                className="absolute z-20 flex items-center justify-center w-12 h-12 text-white transition duration-300 transform -translate-y-1/2 bg-blue-800 rounded-full shadow-lg left-4 opacity-90 top-1/2 md:left-6 md:w-14 md:h-14 hover:bg-pink-500 hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
                aria-label="Previous slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 transition-transform md:w-7 md:h-7 group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={goToNextSlide}
                className="absolute z-20 flex items-center justify-center w-12 h-12 text-white transition duration-300 transform -translate-y-1/2 bg-blue-800 rounded-full shadow-lg right-4 opacity-90 top-1/2 md:right-6 md:w-14 md:h-14 hover:bg-pink-500 hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
                aria-label="Next slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 transition-transform md:w-7 md:h-7 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Improved Slides container with smooth transitions */}
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="flex-shrink-0 min-w-full">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8">
                    {events
                      .slice(
                        slideIndex * eventsPerSlide,
                        (slideIndex + 1) * eventsPerSlide
                      )
                      .map((event) => (
                        <div
                          key={event._id}
                          className={`group relative overflow-hidden bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                            activeEvent === event._id
                              ? "ring-2 ring-pink-400"
                              : ""
                          }`}
                          onMouseEnter={() => setActiveEvent(event._id)}
                          onMouseLeave={() => setActiveEvent(null)}
                        >
                          {/* Enhanced diagonal cut design with animation */}
                          <div className="absolute top-0 right-0 w-16 h-16 transition-transform duration-300 transform rotate-45 translate-x-6 -translate-y-6 bg-pink-400 md:w-24 md:h-24 md:translate-x-8 md:-translate-y-8 group-hover:rotate-90"></div>

                          {/* Improved Category tag */}
                          <div className="absolute top-0 right-0 z-10 px-3 py-1 text-xs font-medium text-white transition-all duration-300 bg-blue-800 rounded-bl-lg md:px-4 group-hover:bg-blue-700">
                            {event.category}
                          </div>

                          <div className="p-5 md:p-6">
                            {/* Enhanced Emoji Icon Container */}
                            <div className="relative mb-5 overflow-hidden md:mb-6">
                              <div className="flex items-center justify-center mx-auto mb-3 transition-transform duration-300 bg-pink-100 rounded-full w-14 h-14 md:w-18 md:h-18 md:mb-4 group-hover:scale-110">
                                <span className="text-3xl md:text-4xl">
                                  {event.banner ? (
                                    <img
                                      src={getBannerUrl(event)}
                                      alt={event.title}
                                      className="object-cover w-full h-full"
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
                                    "🎟️"
                                  )}
                                </span>

                                {/* Enhanced decorative element */}
                                <div className="absolute w-10 h-4 transition-transform duration-300 transform border-t-2 border-yellow-300 rounded-full md:w-12 md:h-5 rotate-12 group-hover:rotate-45"></div>
                              </div>
                            </div>

                            {/* Enhanced Event Details */}
                            <div className="text-center">
                              <h3 className="mb-2 text-lg font-bold text-blue-900 transition-colors md:text-xl group-hover:text-pink-500 line-clamp-2">
                                {event.title}
                              </h3>

                              <div className="flex items-center justify-center mb-3 text-gray-500">
                                <div className="flex items-center justify-center p-1 mr-2 text-blue-800 bg-blue-100 rounded-full w-7 h-7">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                                <p className="text-xs font-medium md:text-sm">
                                  {formatDate(event.date)}
                                </p>
                              </div>

                              <div className="flex items-center justify-center text-gray-600">
                                <div className="flex items-center justify-center p-1 mr-2 text-blue-800 bg-blue-100 rounded-full w-7 h-7">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                </div>
                                <p className="text-xs font-medium md:text-sm">
                                  {event.location}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Card Footer with Button */}
                          <div className="px-5 py-4 mt-2 text-center transition-colors md:px-6 bg-gray-50 group-hover:bg-blue-50">
                            <button
                              className="w-full py-2 text-sm font-medium text-blue-800 transition-all duration-300 bg-transparent border-2 border-blue-800 rounded-full md:text-base group-hover:bg-blue-800 group-hover:text-white group-hover:shadow-lg"
                              onClick={() => {
                                navigate(`/event/${event._id}`);
                              }}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Navigation dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-10 space-x-3 md:mt-14">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 
                    ${
                      index === currentSlide
                        ? "bg-pink-500 transform scale-125"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Enhanced View All Events Button */}
          <div className="text-center mt-14 md:mt-20">
            <button
              className="inline-flex items-center px-8 py-3 text-base font-medium text-white transition-all duration-300 transform bg-blue-800 rounded-full shadow-xl md:px-12 md:py-4 md:text-lg hover:bg-blue-700 hover:scale-105 group"
              onClick={() => {
                navigate("/eventbrowsing");
              }}
            >
              <span>Explore All Events</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
