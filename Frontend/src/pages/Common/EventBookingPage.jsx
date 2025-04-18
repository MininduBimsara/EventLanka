import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { fetchEventById } from "../../Redux/Slicers/EventSlice"; // Update path as needed
import OrganizerInfo from "../../components/Common/EventBooking/OrganizerInfo";
import OrderSummary from "../../components/Common/EventBooking/OrderSummary";
import TicketSelection from "../../components/Common/EventBooking/TicketSelection";
import EventDetails from "../../components/Common/EventBooking/EventDetails";
import EventImage from "../../components/Common/EventBooking/EventImage";
import ColorDivider from "../../components/Common/EventBooking/ColorDivider";
import EventDescription from "../../components/Common/EventBooking/EventDescription";
import EventHighlights from "../../components/Common/EventBooking/EventHighlights";
import NavBar from "../../components/Common/Navbar";

const EventBookingPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Get event data from Redux store
  const { currentEvent, loading, error, bookingError } = useSelector(
    (state) => state.events
  );

  const [tickets, setTickets] = useState({
    vip: 0,
    standard: 0,
    economy: 0,
  });

  const [totalPrice, setTotalPrice] = useState(0);

  // Define ticketPrices based on your event data model
  // This could also be dynamically loaded from currentEvent.ticket_types
  const ticketPrices = {
    vip: 199.99,
    standard: 99.99,
    economy: 49.99,
  };

  // Fetch event data if not already in store
  useEffect(() => {
    if (!currentEvent || currentEvent._id !== id) {
      dispatch(fetchEventById(id));
    }
  }, [dispatch, id, currentEvent]);

  // Calculate total price whenever tickets change
  useEffect(() => {
    calculateTotal();
  }, [tickets]);

  const calculateTotal = () => {
    const total =
      tickets.vip * ticketPrices.vip +
      tickets.standard * ticketPrices.standard +
      tickets.economy * ticketPrices.economy;
    setTotalPrice(total);
  };

  const handleTicketChange = (type, action) => {
    setTickets((prev) => {
      const newValue =
        action === "increase" ? prev[type] + 1 : Math.max(0, prev[type] - 1);
      return { ...prev, [type]: newValue };
    });
  };

  // Show loading state
  if (loading || !currentEvent) {
    return (
      <>
        <NavBar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-500 via-pink-500 to-orange-400">
          <div className="p-8 text-center bg-white rounded-lg shadow-xl">
            <div className="w-16 h-16 mx-auto border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-xl font-semibold text-purple-700">
              Loading event details...
            </p>
          </div>
        </div>
      </>
    );
  }

  // Show error state
  if (error || bookingError) {
    return (
      <>
        <NavBar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-500 via-pink-500 to-orange-400">
          <div className="p-8 text-center bg-white rounded-lg shadow-xl">
            <div className="w-16 h-16 mx-auto text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="mt-4 text-xl font-semibold text-red-700">
              {bookingError || error}
            </p>
            <p className="mt-2 text-gray-600">
              Please try another event or go back to the events page.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Format event data for components
  const eventData = {
    title: currentEvent.name || currentEvent.title,
    image: currentEvent.banner
      ? `${process.env.REACT_APP_API_URL}${currentEvent.banner}`
      : "/api/placeholder/800/400",
    date: new Date(currentEvent.date).toLocaleDateString(),
    time: currentEvent.time || new Date(currentEvent.date).toLocaleTimeString(),
    location: currentEvent.venue || currentEvent.location,
    organizer:
      currentEvent.featuredArtists?.[0] ||
      currentEvent.organizer ||
      "Event Organizer",
    organizerEmail: currentEvent.organizerEmail || "contact@example.com",
    description:
      currentEvent.description ||
      `Join us for an amazing ${currentEvent.category} event`,
    featuredArtists: currentEvent.featuredArtists || [],
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen pt-20 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-400">
        <div className="container px-4 py-8 mx-auto">
          <div className="w-full max-w-4xl p-2 mx-auto overflow-hidden bg-white shadow-xl rounded-2xl">
            {/* Event Image and Title */}
            <EventImage image={eventData.image} title={eventData.title} />

            {/* Color Divider Component */}
            <ColorDivider />

            {/* Event Details Component */}
            <EventDetails
              date={eventData.date}
              time={eventData.time}
              location={eventData.location}
            />

            {/* Event Description Component */}
            <EventDescription description={eventData.description} />

            {/* Event Highlights Component */}
            <EventHighlights
              highlights={
                eventData.featuredArtists.length > 0
                  ? eventData.featuredArtists.map(
                      (artist) => `Performance by ${artist}`
                    )
                  : [
                      "Live performances by top artists",
                      "Food and drinks available",
                      "Family-friendly event",
                    ]
              }
            />

            {/* Organizer Info Component */}
            <OrganizerInfo
              organizer={eventData.organizer}
              email={eventData.organizerEmail}
            />

            {/* Ticket Selection Component */}
            <TicketSelection
              tickets={tickets}
              ticketPrices={ticketPrices}
              handleTicketChange={handleTicketChange}
            />

            {/* Order Summary Component */}
            <OrderSummary
              tickets={tickets}
              ticketPrices={ticketPrices}
              totalPrice={totalPrice}
            />

            {/* Book Now Button */}
            <div className="px-6 py-4">
              <button
                className="w-full py-4 text-lg font-bold text-white transition-all duration-300 bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                onClick={() =>
                  alert("Booking functionality would be implemented here!")
                }
              >
                COMPLETE BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventBookingPage;
