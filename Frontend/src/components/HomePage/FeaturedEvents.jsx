import React, { useState, useEffect } from "react";

// Featured Events Component
const FeaturedEvents = () => {
  const events = [
    {
      id: 1,
      title: "Music Festival",
      date: "June 20",
      location: "New York",
      emoji: "😀",
    },
    {
      id: 2,
      title: "Comedy Show",
      date: "July 5",
      location: "Los Angeles",
      emoji: "🎉",
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
    <section className="py-20 bg-[#6622cc]">
      <div className="container px-4 mx-auto">
        <h2 className="mb-16 text-3xl font-bold text-center text-white">
          Featured Events
        </h2>

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
                        <div className="flex items-center justify-center w-24 h-24 mb-4 overflow-visible text-4xl bg-[#d2a1b8] rounded-full">
                          {event.emoji}
                        </div>
                        <h3 className="mb-1 text-xl font-semibold text-white">
                          {event.title}
                        </h3>
                        <p className="mb-2 text-[#b59194]">{event.date}</p>
                        <p className="text-xl font-medium text-[#a755c2]">
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
                    ${
                      index === currentSlide ? "bg-[#a755c2]" : "bg-[#b07c9e]"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
