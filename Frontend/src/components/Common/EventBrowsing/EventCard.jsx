import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (event.bookingAvailable) {
      navigate(`/event/${event._id}`);
    }
  };

  return (
    <div className="relative h-full max-w-md overflow-hidden transition duration-300 transform shadow-lg rounded-xl hover:-translate-y-1 hover:shadow-xl">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gray-900 opacity-95"></div>

      {/* Content container with proper z-index */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Banner Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-800">
          {event.banner ? (
            <img
              src={`${process.env.REACT_APP_API_URL}${event.banner}`}
              alt={event.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl font-bold tracking-wider text-white opacity-20">
                {event.title.toUpperCase()}
              </div>
            </div>
          )}

          {!event.bookingAvailable && (
            <div className="absolute top-0 right-0 px-3 py-1 font-semibold text-white bg-red-500 rounded-bl">
              UNAVAILABLE
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="flex flex-col flex-grow p-6">
          <h2 className="mb-2 text-2xl font-extrabold text-white">
            {event.title}
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
              <span className="text-gray-300">
                {new Date(event.date).toLocaleDateString()}
              </span>
            </div>

            {event.duration && (
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
                <span className="text-gray-300">{event.duration} hour(s)</span>
              </div>
            )}

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
              <span className="text-gray-300">{event.location}</span>
            </div>

            {event.ticket_types && event.ticket_types.length > 0 && (
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
                <span className="font-bold text-white">
                  ${event.ticket_types[0].price.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="flex-grow mb-6">
            <h3 className="mb-2 text-sm font-medium text-gray-400">
              {event.category || "GENERAL"}
            </h3>
            <div className="space-y-1">
              <div className="text-gray-200 line-clamp-2">
                {event.description}
              </div>
            </div>
          </div>

          {event.bookingAvailable ? (
            <button
              onClick={handleButtonClick}
              className="w-full py-3 font-bold text-center text-gray-900 transition duration-200 transform rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 hover:scale-105"
            >
              GET TICKETS
            </button>
          ) : (
            <div className="w-full py-3 font-bold text-center text-gray-400 bg-gray-700 rounded-lg cursor-not-allowed">
              BOOKING UNAVAILABLE
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
