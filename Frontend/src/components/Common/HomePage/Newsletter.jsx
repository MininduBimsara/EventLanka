import React from "react";
import { FaEnvelope, FaArrowRight } from "react-icons/fa";

// Redesigned Newsletter Component
const Newsletter = () => {
  return (
    <section className="relative py-20 bg-blue-800 select-none" id="newsletter">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg">
          {/* Content Container with Gradient */}
          <div className="relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-700 to-pink-500 animate-gradient-x"></div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => (
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

            {/* Content */}
            <div className="relative z-10 p-10 text-center">
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-white rounded-full">
                <FaEnvelope className="w-8 h-8 text-blue-800" />
              </div>

              <h3 className="mb-3 text-3xl font-bold text-white">
                Stay Updated with EVENTLANKA
              </h3>
              <p className="max-w-2xl mx-auto mb-8 text-blue-100">
                Join our newsletter to receive exclusive offers, event updates,
                and early access to ticket sales for the hottest events in your
                area.
              </p>

              {/* Subscription Form */}
              <div className="flex flex-col max-w-md gap-4 mx-auto mt-8 md:flex-row">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 text-blue-900 bg-white border-2 border-transparent rounded-lg focus:outline-none focus:border-pink-400"
                />
                <button className="px-6 py-3 font-bold text-white transition-all duration-300 transform bg-pink-400 rounded-lg hover:bg-white hover:text-blue-800 hover:scale-105">
                  <span className="flex items-center justify-center">
                    Subscribe
                    <FaArrowRight className="ml-2" />
                  </span>
                </button>
              </div>

              {/* Additional Text */}
              <p className="mt-4 text-sm text-blue-200">
                By subscribing, you agree to receive marketing emails from
                EVENTLANKA.
                <br />
                Don't worry, we never share your information and you can
                unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
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

export default Newsletter;
