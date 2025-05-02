import React, { useState, useEffect } from "react";

// Updated Featured Events Component
const FeaturedEvents = () => {
  const events = [
    {
      id: 1,
      title: "Music Festival",
      date: "June 20",
      location: "New York",
      emoji: "🎵",
    },
    {
      id: 2,
      title: "Comedy Show",
      date: "July 5",
      location: "Los Angeles",
      emoji: "😂",
    },
    {
      id: 3,
      title: "Theater Play",
      date: "Aug 15",
      location: "Chicago",
      emoji: "🎭",
    },
    {
      id: 4,
      title: "Live Concert",
      date: "Sep 10",
      location: "Miami",
      emoji: "🎸",
    },
  ];

  // Group events into slides (each slide shows a set of events)
  const eventsPerSlide = 4; // Show 4 events on desktop, fewer on smaller screens
  const totalSlides = Math.ceil(events.length / eventsPerSlide);

  const [currentSlide, setCurrentSlide] = useState(0);

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
    <section className="relative py-20 bg-white" id="featured-events">
      <div className="container px-4 mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-blue-900">Featured Events</h2>
          <div className="w-24 h-1 mx-auto bg-pink-400 rounded-full"></div>
        </div>

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
                        className="flex flex-col items-center transition-all duration-300 transform cursor-pointer group hover:-translate-y-2"
                      >
                        <div className="relative mb-6">
                          {/* Pink card background */}
                          <div className="flex items-center justify-center w-24 h-24 bg-pink-400 rounded-lg">
                            {/* Decorative element similar to logo */}
                            <div className="absolute w-16 h-6 transform border-t border-yellow-300 rounded-full rotate-12"></div>
                            {/* Emoji centered */}
                            <span className="relative z-10 text-4xl">{event.emoji}</span>
                          </div>
                        </div>
                        <h3 className="mb-1 text-xl font-semibold text-blue-900">
                          {event.title}
                        </h3>
                        <p className="mb-2 text-gray-600">{event.date}</p>
                        <p className="text-lg font-medium text-blue-800">
                          {event.location}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 
                    ${index === currentSlide ? "bg-blue-800" : "bg-blue-200"}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* View All Events Button */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 text-white transition-colors bg-blue-800 rounded-full hover:bg-blue-700">
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;