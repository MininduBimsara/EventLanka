import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTicketAlt,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";

// Updated Trending Events Slider Component
const TrendingEventsSlider = () => {
  // Sample trending events data
  const events = [
    {
      id: 1,
      title: "Summer Music Festival",
      description:
        "Annual outdoor concert featuring top artists and local talent",
      date: "June 15-18",
      location: "Central Park",
    },
    {
      id: 2,
      title: "Tech Conference 2025",
      description:
        "Discover the hottest innovations and network with industry leaders",
      date: "July 22-24",
      location: "Convention Center",
    },
    {
      id: 3,
      title: "Food & Wine Expo",
      description:
        "Sample cuisine from renowned chefs and taste exceptional wines",
      date: "August 5-7",
      location: "Grand Pavilion",
    },
    {
      id: 4,
      title: "International Film Festival",
      description: "Screenings of award-winning films from around the world",
      date: "September 12-19",
      location: "City Theater Complex",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === events.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [events.length]);

  // Manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="py-20 bg-blue-800" id="trending-events">
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
            {events.map((event, index) => (
              <div
                key={event.id}
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
                        <span>{event.date}</span>
                      </div>

                      <div className="flex items-center mb-4 text-blue-100">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{event.location}</span>
                      </div>

                      <button className="px-6 py-2 mt-2 font-medium text-blue-900 transition-all duration-300 transform bg-white rounded-full hover:bg-pink-100 hover:scale-105 w-fit">
                        Book Tickets
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-48 md:w-1/2 md:h-full">
                    {/* Placeholder for event image */}
                    <div className="flex items-center justify-center h-full border rounded-lg bg-pink-400/40 border-white/20">
                      <div className="relative">
                        {/* Decorative element similar to logo */}
                        <div className="absolute w-32 h-12 transform -translate-y-4 border-t-2 rounded-full border-yellow-300/70 -rotate-12"></div>
                        <span className="relative text-xl font-semibold text-white">
                          Event Image
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center p-4 space-x-2 bg-blue-900/50">
            {events.map((_, index) => (
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
            href="#"
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
