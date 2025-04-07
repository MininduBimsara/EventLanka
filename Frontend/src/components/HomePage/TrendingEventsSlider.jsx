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
    <div
      className="relative w-full overflow-hidden rounded-lg shadow-lg"
      id="gradient-sync-trending"
    >
      {/* Animated gradient background - using EXACT same gradient as Featured Events */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#D0A2F7] via-[#8ECAE6] to-[#023E8A] animate-gradient-x"></div>

      {/* Optional: Adding particle animation like in Featured Events */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full bg-opacity-20 animate-float"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        <h2 className="mb-2 text-3xl font-bold text-center text-white">
          Trending Events
        </h2>
        <p className="mb-10 text-center text-[#d2a1b8]">
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
                      <p className="text-[#d2a1b8]">{event.description}</p>
                      <button className="px-4 py-2 mt-6 text-white transition rounded bg-[#a755c2] hover:bg-[#b07c9e] w-fit">
                        Learn More
                      </button>
                    </div>
                  </div>
                  <div className="w-1/2 bg-[#b07c9e] rounded-lg">
                    {/* Placeholder for event image */}
                    <div className="flex items-center justify-center h-full bg-[#b59194] rounded-lg">
                      <span className="text-white">Event Image</span>
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
                ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 15s ease infinite;
        }
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(20px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TrendingEventsSlider;
