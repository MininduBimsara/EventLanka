import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTicketAlt,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";


//Trending Events Slider Component
const TrendingEventsSlider = () => {
  // Sample trending events data
  const events = [
    {
      id: 1,
      title: "Summer Music Festival",
      description:
        "Annual outdoor concert featuring top artists and local talent",
    },
    {
      id: 2,
      title: "Tech Conference 2025",
      description:
        "Discover the hottest innovations and network with industry leaders",
    },
    {
      id: 3,
      title: "Food & Wine Expo",
      description:
        "Sample cuisine from renowned chefs and taste exceptional wines",
    },
    {
      id: 4,
      title: "International Film Festival",
      description: "Screenings of award-winning films from around the world",
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
    <div className="w-full overflow-hidden bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6">
        <h2 className="mb-2 text-3xl font-bold text-center text-amber-400">
          Trending Events
        </h2>
        <p className="mb-10 text-center text-gray-300 ">
          Discover the hottest concerts and festivals happening near you
        </p>

        <div className="relative h-64 mb-10">
          {/* Slides container */}
          <div className="h-full">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out
                  ${
                    index === currentSlide
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
                  }`}
              >
                <div className="flex h-full">
                  <div className="w-1/2 p-4">
                    <div className="flex flex-col justify-center h-full">
                      <h3 className="mb-3 text-xl font-bold text-white">
                        {event.title}
                      </h3>
                      <p className="text-gray-200">{event.description}</p>
                      <button className="px-4 py-2 mt-6 text-white transition rounded bg-amber-500 hover:bg-amber-600 w-fit">
                        Learn More
                      </button>
                    </div>
                  </div>
                  <div className="w-1/2 bg-gray-300 rounded-lg">
                    {/* Placeholder for event image */}
                    <div className="flex items-center justify-center h-full bg-gray-200 rounded-lg">
                      <span className="text-gray-800">Event Image</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide indicators - moved outside the relative container */}
        <div className="flex justify-center mt-2 space-x-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 
                ${index === currentSlide ? "bg-amber-400" : "bg-gray-500"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingEventsSlider;