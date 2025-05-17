import React from "react";
import { FaCompass, FaTicketAlt, FaGlassCheers } from "react-icons/fa";

// Redesigned How It Works Component
const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Browse Events",
      description: "Discover a variety of events in your city.",
      icon: <FaCompass className="w-10 h-10 mb-4 text-pink-400" />,
    },
    {
      id: 2,
      title: "Select Tickets",
      description: "Choose your desired event and ticket type.",
      icon: <FaTicketAlt className="w-10 h-10 mb-4 text-pink-400" />,
    },
    {
      id: 3,
      title: "Enjoy the Event",
      description: "Have a fantastic time at the event you chose.",
      icon: <FaGlassCheers className="w-10 h-10 mb-4 text-pink-400" />,
    },
  ];

  return (
    <section className="py-16 bg-white select-none" id="how-it-works">
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-blue-900">
            How It Works
          </h2>
          <div className="w-24 h-1 mx-auto bg-pink-400 rounded-full"></div>
          <p className="mt-4 text-blue-800">
            Three simple steps to start your event journey
          </p>
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="p-8 transition-all duration-300 transform bg-white border border-blue-100 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center">
                {/* Decorative container for icon */}
                <div className="flex items-center justify-center w-20 h-20 mb-6 overflow-hidden bg-blue-100 rounded-full">
                  {step.icon}
                </div>

                {/* Step number */}
                <div className="flex items-center justify-center w-8 h-8 mb-4 text-white bg-blue-800 rounded-full">
                  <span className="font-bold">{step.id}</span>
                </div>

                <h3 className="mb-3 text-xl font-bold text-blue-900">
                  {step.title}
                </h3>
                <p className="text-blue-800">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 font-bold text-white transition-all duration-300 transform bg-blue-800 rounded-full shadow-lg hover:bg-pink-400 hover:scale-105">
            Find Events Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
