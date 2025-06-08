// 2. Left Side Artwork Component (components/LeftSideArtwork.jsx) - Updated with responsive design
import React from "react";
import { loginUser } from "../../../Redux/Thunks/authThunks";
import loginImg from "../../../assets/login.png";

const LeftSideArtwork = ({ activeForm }) => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-l-2xl">
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
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-8 text-white lg:p-12">
        <div className="mb-6 text-center lg:mb-8">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl xl:text-5xl">
            {activeForm === "login" ? "Welcome Back!" : "Join EventLanka"}
          </h2>
          <p className="text-lg leading-relaxed text-blue-100 lg:text-xl xl:text-2xl">
            {activeForm === "login"
              ? "Login to EventLanka & get going with your hustle!"
              : "Create your account and start your journey"}
          </p>
        </div>

        <div className="w-full max-w-md space-y-3 text-left lg:space-y-4">
          {[
            "Discover trending events near you",
            "Easy ticket booking & management",
            "Host your own events & conferences",
          ].map((feature, index) => (
            <div key={index} className="flex items-center text-blue-100">
              <div className="flex items-center justify-center flex-shrink-0 w-5 h-5 mr-3 rounded-full lg:w-6 lg:h-6 bg-white/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 lg:w-4 lg:h-4"
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
              <span className="text-sm lg:text-base">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSideArtwork;
