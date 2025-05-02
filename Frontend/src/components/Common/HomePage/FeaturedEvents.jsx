import React, { useState, useEffect } from "react";

// Redesigned Featured Events Component with more beautiful UI
const FeaturedEvents = () => {
  const events = [
    {
      id: 1,
      title: "Music Festival",
      date: "June 20",
      location: "New York",
      emoji: "🎵",
      category: "Music",
    },
    {
      id: 2,
      title: "Comedy Show",
      date: "July 5",
      location: "Los Angeles",
      emoji: "😂",
      category: "Entertainment",
    },
    {
      id: 3,
      title: "Theater Play",
      date: "Aug 15",
      location: "Chicago",
      emoji: "🎭",
      category: "Arts",
    },
    {
      id: 4,
      title: "Live Concert",
      date: "Sep 10",
      location: "Miami",
      emoji: "🎸",
      category: "Music",
    },
  ];

  // Group events into slides (each slide shows a set of events)
  const eventsPerSlide = 4; // Show 4 events on desktop, fewer on smaller screens
  const totalSlides = Math.ceil(events.length / eventsPerSlide);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeEvent, setActiveEvent] = useState(null);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [totalSlides]);

  // Manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-20 bg-gray-50" id="featured-events">
      {/* Decorative Elements */}
      <div className="absolute left-0 hidden w-32 h-32 transform -translate-y-12 bg-pink-100 rounded-full opacity-50 lg:block"></div>
      <div className="absolute right-0 hidden w-24 h-24 transform translate-y-12 bg-blue-100 rounded-full opacity-50 lg:block"></div>

      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div className="relative mb-16 text-center">
          <h2 className="text-sm font-bold tracking-widest text-pink-500 uppercase">
            Discover What's Happening
          </h2>
          <h3 className="mt-2 text-4xl font-bold text-blue-900">
            Featured Events
          </h3>
          <div className="flex items-center justify-center mt-4">
            <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
            <div className="w-3 h-3 mx-2 bg-blue-900 rounded-full"></div>
            <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
          </div>
        </div>

        {/* Event Cards Container */}
        <div className="relative overflow-visible">
          {/* Slides container */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="min-w-full">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {events
                    .slice(
                      slideIndex * eventsPerSlide,
                      (slideIndex + 1) * eventsPerSlide
                    )
                    .map((event) => (
                      <div
                        key={event.id}
                        className={`group relative overflow-hidden bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                          activeEvent === event.id ? "ring-2 ring-pink-400" : ""
                        }`}
                        onMouseEnter={() => setActiveEvent(event.id)}
                        onMouseLeave={() => setActiveEvent(null)}
                      >
                        {/* Top diagonal cut design */}
                        <div className="absolute top-0 right-0 w-20 h-20 transform rotate-45 translate-x-8 -translate-y-8 bg-pink-400"></div>

                        {/* Category tag */}
                        <div className="absolute top-0 right-0 z-10 px-2 py-1 text-xs font-medium text-white bg-blue-800 rounded-bl-lg">
                          {event.category}
                        </div>

                        <div className="p-6">
                          {/* Emoji Icon Container */}
                          <div className="relative mb-6 overflow-hidden">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full">
                              <span className="text-3xl">{event.emoji}</span>

                              {/* Decorative element similar to logo */}
                              <div className="absolute w-10 h-4 transform border-t border-yellow-300 rounded-full rotate-12"></div>
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="text-center">
                            <h3 className="mb-1 text-xl font-bold text-blue-900 transition-colors group-hover:text-pink-500">
                              {event.title}
                            </h3>

                            <div className="flex items-center justify-center mb-2 text-gray-500">
                              <svg
                                className="w-4 h-4 mr-1"
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
                              <p className="text-sm">{event.date}</p>
                            </div>

                            <div className="flex items-center justify-center text-gray-600">
                              <svg
                                className="w-4 h-4 mr-1"
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
                              <p className="text-sm font-medium">
                                {event.location}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer with Button */}
                        <div className="p-4 mt-2 text-center transition-colors bg-gray-50 group-hover:bg-blue-50">
                          <button className="w-full py-2 text-sm font-medium text-blue-800 transition-colors bg-transparent border border-blue-800 rounded-full group-hover:bg-blue-800 group-hover:text-white">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-12 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 
                    ${index === currentSlide ? "bg-pink-500" : "bg-gray-300"}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Events Button */}
        <div className="mt-16 text-center">
          <button className="px-10 py-3 text-white transition-colors transition-transform duration-300 transform bg-blue-800 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105">
            Explore All Events
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
