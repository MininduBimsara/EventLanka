// 2. Left Side Artwork Component (components/LeftSideArtwork.jsx)
import React from "react";
import { loginUser } from "../../../Redux/Thunks/authThunks";
import loginImg from "../../../assets/login.png";

const LeftSideArtwork = ({ activeForm }) => {
  return (
    <div className="relative hidden overflow-hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-l-2xl">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${loginImg})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-800/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            {activeForm === "login" ? "Welcome Back!" : "Join EventLanka"}
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            {activeForm === "login"
              ? "Login to EventLanka & get going with your hustle!"
              : "Create your account and start your journey"}
          </p>
        </div>

        <div className="space-y-4 text-left">
          {[
            "Discover trending events near you",
            "Easy ticket booking & management",
            "Host your own events & conferences",
          ].map((feature, index) => (
            <div key={index} className="flex items-center text-blue-100">
              <div className="flex items-center justify-center w-6 h-6 mr-3 rounded-full bg-white/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSideArtwork;
