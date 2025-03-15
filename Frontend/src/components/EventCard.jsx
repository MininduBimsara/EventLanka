import React from "react";
import { useNavigate } from "react-router-dom";

// Modified to accept event as a prop
const EventCard = ({ event }) => {
  // No longer defining hardcoded event data here

  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (event.bookingAvailable) {
      navigate("/event-browsing");
    } else {
      alert("Ticket booking is not available yet!");
    }
  };

  return (
    <div className="max-w-md overflow-hidden transition duration-300 transform bg-gray-900 shadow-lg rounded-xl hover:-translate-y-1 hover:shadow-xl">
      {/* Banner Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-5xl font-bold tracking-wider text-white opacity-20">
            {event.name.toUpperCase()}
          </div>
        </div>

        {/* Badges */}
        <div className="absolute flex space-x-2 top-4 left-4">
          {event.discount && (
            <span className="px-3 py-1 text-xs font-semibold text-gray-900 rounded-full bg-amber-400">
              EARLY BIRD DISCOUNT
            </span>
          )}
          {event.trending && (
            <span className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
              TRENDING
            </span>
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6">
        <h2 className="mb-2 text-2xl font-extrabold text-white">
          {event.name}
        </h2>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <svg
              className="w-5 h-5 mr-2 text-amber-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-300">{event.date}</span>
          </div>

          <div className="flex items-center mb-2">
            <svg
              className="w-5 h-5 mr-2 text-amber-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-300">{event.time}</span>
          </div>

          <div className="flex items-center mb-2">
            <svg
              className="w-5 h-5 mr-2 text-amber-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-300">{event.venue}</span>
          </div>

          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-amber-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95a1 1 0 001.715 1.029zM6 12a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 114 0 2 2 0 01-4 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-bold text-white">{event.price}</span>
            {event.discount && (
              <span className="ml-2 text-xs text-gray-500 line-through">
                $129.99
              </span>
            )}
          </div>
        </div>

        {/* Featured Artists */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-gray-400">
            FEATURED ARTISTS
          </h3>
          <div className="space-y-1">
            {event.featuredArtists.map((artist, index) => (
              <div key={index} className="text-gray-200">
                {artist}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleButtonClick}
          className="w-full py-3 font-bold text-center text-gray-900 transition duration-200 transform rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 hover:scale-105"
        >
          GET TICKETS
        </button>
      </div>
    </div>
  );
};

export default EventCard;
