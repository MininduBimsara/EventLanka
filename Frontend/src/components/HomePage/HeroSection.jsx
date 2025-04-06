import React from "react";

// Hero Section Component with Synchronized Animated Gradient
const HeroSection = () => {
  return (
    <div className="relative h-screen overflow-hidden" id="gradient-sync-hero">
      {/* Animated gradient background - same colors as footer & featured events */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 animate-gradient-x"></div>

      {/* Animated particles/confetti overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full bg-opacity-20 animate-fall"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 5 + 8}s`,
            }}
          />
        ))}
      </div>

      <div className="container relative z-20 flex items-center h-full px-4 mx-auto">
        <div className="w-full space-y-6 md:w-1/2">
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Experience the Best Events Near You!
          </h1>
          <button className="px-8 py-3 font-bold text-white transition-all duration-300 transform rounded-full bg-white/20 hover:bg-white/30 hover:scale-105">
            Browse Events
          </button>
        </div>
        <div className="hidden rounded-lg md:block md:w-1/2 h-3/4 bg-white/10 backdrop-blur-sm">
          {/* This would be your hero image */}
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(1000px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall 10s linear infinite;
        }
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
      `}</style>
    </div>
  );
};

export default HeroSection;
