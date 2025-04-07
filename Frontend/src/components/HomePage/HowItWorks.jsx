import React from "react";

// How It Works Component
const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Browse Events",
      description: "Discover a variety of events in your city.",
      icon: <div className="w-20 h-20 mb-4 bg-[#d2a1b8] rounded"></div>,
    },
    {
      id: 2,
      title: "Select Tickets",
      description: "Choose your desired event and ticket type.",
      icon: <div className="w-20 h-20 mb-4 bg-[#b07c9e] rounded"></div>,
    },
    {
      id: 3,
      title: "Enjoy the Event",
      description: "Have a fantastic time at the event you chose.",
      icon: <div className="w-20 h-20 mb-4 bg-[#a755c2] rounded"></div>,
    },
  ];

  return (
    <section
      className="py-20 relative overflow-hidden mt-[-2px]"
      id="gradient-sync-howitworks"
    >
      {/* Animated gradient background - using EXACT same gradient as Featured Events */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 animate-gradient-x"></div>

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
          How It Works
        </h2>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center"
            >
              {step.icon}
              <h3 className="mb-2 text-xl font-bold text-white">
                {step.title}
              </h3>
              <p className="text-white">{step.description}</p>
            </div>
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
    </section>
  );
};

export default HowItWorks;
