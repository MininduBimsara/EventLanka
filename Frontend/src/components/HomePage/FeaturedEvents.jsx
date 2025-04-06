import React, { useState, useEffect } from "react";

// Featured Events Component with Synchronized Animated Gradient
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
    <section
      className="relative py-20 overflow-hidden mt-[-2px]"
      id="gradient-sync-featured"
    >
      {/* Animated gradient background - same colors as footer & hero */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 animate-gradient-x"></div>

      {/* Animated particles overlay */}
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

      <div className="container relative z-10 px-4 mx-auto">
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
                        <div className="flex items-center justify-center w-24 h-24 mb-4 overflow-visible text-4xl rounded-full bg-white/20 backdrop-blur-sm group-hover:animate-pulse">
                          {event.emoji}
                        </div>
                        <h3 className="mb-1 text-xl font-semibold text-white">
                          {event.title}
                        </h3>
                        <p className="mb-2 text-white/70">{event.date}</p>
                        <p className="text-xl font-medium text-white/90">
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
                    ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Animation styles - same timing as footer & hero */}
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
    </section>
  );
};

export default FeaturedEvents;
