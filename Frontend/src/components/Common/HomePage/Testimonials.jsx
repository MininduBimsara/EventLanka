import React from "react";

// Testimonials Component
const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah",
      comment: "Absolutely loved the event! Great experience.",
      rating: 5,
    },
    {
      id: 2,
      name: "John",
      comment: "Easiest way to book event tickets online!",
      rating: 5,
    },
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-[#a755c2]" : "text-[#b59194]"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section
      className="py-20 mt-[-2px] relative overflow-hidden"
      id="gradient-sync-testimonials"
    >
      {/* Animated gradient background - using EXACT same gradient as Featured Events */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#a034ff] via-[#8ECAE6] to-[#023E8A] animate-gradient-x"></div>

      {/* Adding particles like in Featured Events */}
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
          User Testimonials
        </h2>

        <div className="grid max-w-4xl grid-cols-1 gap-8 mx-auto md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-6 transition-transform duration-300 bg-[#a755c2] rounded-lg hover:transform hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 mr-3 bg-[#d2a1b8] rounded-full"></div>
                <span className="font-medium text-white">
                  {testimonial.name}
                </span>
                <div className="ml-auto">{renderStars(testimonial.rating)}</div>
              </div>
              <p className="text-[#d2a1b8]">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Animation styles */}
      <style >{`
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

export default Testimonials;
