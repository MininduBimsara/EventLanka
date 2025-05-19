import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000";

  // useEffect(() => {
  //   // Debug: Log the banner value we're receiving
  //   console.log("Event:", event._id, "Banner value:", event.banner);
  // }, [event]);

  // Simpler, more direct banner URL construction
  const getBannerUrl = () => {
    if (!event.banner) {
      return "https://via.placeholder.com/600x300.png?text=No+Banner";
    }

    // If it's just a filename with no slashes
    if (!event.banner.includes("/")) {
      return `${API_URL}/event-images/${event.banner}`;
    }
    
    // If it starts with a slash, assume it's a relative path to the server
    if (event.banner.startsWith("/")) {
      return `${API_URL}${event.banner}`;
    }
    
    // Otherwise use as is (full URL)
    return event.banner;
  };

  const handleButtonClick = () => {
    if (!event.bookingAvailable) return;
    navigate(`/event/${event._id}`);
  };

  return (
    <div className="h-full overflow-hidden transition-all duration-300 transform bg-white border border-blue-100 rounded-lg shadow-lg select-none hover:shadow-xl hover:-translate-y-2">
      {/* Debug info (remove in production) */}
      {/* <div className="p-1 text-xs bg-yellow-100">
        Banner: {event.banner ? event.banner : "None"}
      </div> */}
      
      {/* Banner Image */}
      <div className="relative h-48 overflow-hidden">
        {event.banner ? (
          <img
            src={getBannerUrl()}
            alt={event.title}
            className="object-cover w-full h-full"
            onError={(e) => {
              console.error("Image failed to load:", e.target.src);
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/600x300.png?text=Image+Error";
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-blue-800">
            <div className="text-2xl font-bold tracking-wider text-white">
              {event.title.toUpperCase()}
            </div>
          </div>
        )}

        {!event.bookingAvailable && (
          <div className="absolute top-0 right-0 px-3 py-1 font-semibold text-white bg-pink-400 rounded-bl">
            UNAVAILABLE
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="flex flex-col flex-grow p-6">
        <h2 className="mb-2 text-2xl font-bold text-blue-900">{event.title}</h2>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <svg
              className="w-5 h-5 mr-2 text-pink-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-blue-800">
              {new Date(event.date).toLocaleDateString()}
            </span>
          </div>

          {event.duration && (
            <div className="flex items-center mb-2">
              <svg
                className="w-5 h-5 mr-2 text-pink-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-blue-800">{event.duration} hour(s)</span>
            </div>
          )}

          <div className="flex items-center mb-2">
            <svg
              className="w-5 h-5 mr-2 text-pink-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-blue-800">{event.location}</span>
          </div>

          {event.ticket_types && event.ticket_types.length > 0 && (
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-pink-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95a1 1 0 001.715 1.029zM6 12a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 114 0 2 2 0 01-4 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-bold text-blue-900">
                ${event.ticket_types[0].price.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-grow mb-6">
          <h3 className="mb-2 text-sm font-medium text-blue-800">
            {event.category || "GENERAL"}
          </h3>
          <div className="space-y-1">
            <div className="text-blue-800 line-clamp-2">
              {event.description}
            </div>
          </div>
        </div>

        {event.bookingAvailable ? (
          <button
            onClick={handleButtonClick}
            className="w-full py-3 font-bold text-white transition-all duration-300 transform bg-blue-800 rounded-full shadow-lg hover:bg-pink-400 hover:scale-105"
          >
            GET TICKETS
          </button>
        ) : (
          <div className="w-full py-3 font-bold text-center text-white bg-gray-400 rounded-full cursor-not-allowed">
            BOOKING UNAVAILABLE
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;