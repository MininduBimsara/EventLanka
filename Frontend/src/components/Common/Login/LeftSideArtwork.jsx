// 2. Left Side Artwork Component (components/LeftSideArtwork.jsx)
import React from "react";

const LeftSideArtwork = ({ activeForm }) => {
  return (
    <div className="relative hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-600 to-pink-500">
      <div className="absolute inset-0 opacity-10 bg-pattern"></div>
      <div className="flex flex-col items-center justify-center w-full p-12 text-white">
        <div className="w-3/4 mb-12">
          <img
            src="/api/placeholder/600/400"
            alt="Events illustration"
            className="w-full drop-shadow-xl"
          />
        </div>

        <div className="text-center">
          <h2 className="mb-6 text-3xl font-bold">
            {activeForm === "login"
              ? "Welcome Back to EventLanka"
              : "Join the EventLanka Community"}
          </h2>
          <p className="text-xl">
            "Discover, Connect, and Experience Amazing Events Together"
          </p>
        </div>

        <div className="mt-10">
          <ul className="space-y-3">
            {[
              "Discover trending events near you",
              "Easy ticket booking & management",
              "Host your own events & conferences",
            ].map((feature, index) => (
              <li key={index} className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-white/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftSideArtwork;
