import React from "react";

// Newsletter Component
const Newsletter = () => {
  return (
    <section
      className="py-16 relative overflow-hidden mt-[-2px]"
      id="gradient-sync-newsletter"
    >
      {/* Animated gradient background - using EXACT same gradient as Featured Events */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#D0A2F7] via-[#8ECAE6] to-[#023E8A] animate-gradient-x"></div>

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
        <div className="max-w-4xl p-8 mx-auto text-center bg-[#a755c2] rounded-lg">
          <h3 className="mb-4 text-2xl font-bold text-white">
            Join us to experience the thrill of live events and entertainment!
          </h3>
          <div className="flex flex-col max-w-md gap-4 mx-auto mt-8 md:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-[#b07c9e] rounded-lg text-white placeholder-[#d2a1b8] focus:outline-none focus:ring-2 focus:ring-[#d2a1b8]"
            />
            <button className="px-6 py-3 font-bold text-white transition-colors rounded-lg bg-[#6622cc] hover:bg-[#b59194]">
              Subscribe
            </button>
          </div>
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
    </section>
  );
};

export default Newsletter;
