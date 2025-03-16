// EventImage.jsx
import React from "react";
import { motion } from "framer-motion";

const EventImage = ({ image , title }) => {
  return (
    <div className="relative">
      <img
        src={image}
        alt={title}
        className="object-cover w-full h-96"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent opacity-70"></div>
      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="flex items-center justify-between">
          <span className="px-4 py-1 text-sm font-bold text-purple-900 bg-yellow-400 rounded-full">
            HOT EVENT
          </span>
          <span className="px-4 py-1 text-sm font-bold text-white bg-red-500 rounded-full">
            SELLING FAST
          </span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-white drop-shadow-lg"
        >
          {title}
        </motion.h1>
        <div className="flex items-center mt-2">
          <div className="flex items-center px-3 py-1 text-sm font-bold text-purple-900 bg-yellow-400 rounded-full">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Top Rated</span>
          </div>
          <div className="ml-2 text-sm text-white">
            <span className="opacity-80">Limited tickets available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventImage;
