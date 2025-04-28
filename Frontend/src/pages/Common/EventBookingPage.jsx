import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchEventById } from "../../Redux/Slicers/EventSlice";
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
  const navigate = useNavigate();

  // Get event data from Redux store
  const { currentEvent, loading, error, bookingError } = useSelector(
    (state) => state.events
  );

  // Initialize tickets state as an empty object
  const [tickets, setTickets] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch event data if not already in store
  useEffect(() => {
    if (!currentEvent || currentEvent._id !== id) {
      dispatch(fetchEventById(id));
    }
  }, [dispatch, id, currentEvent]);

  // Initialize tickets state when currentEvent changes
  useEffect(() => {
    if (currentEvent && currentEvent.ticket_types) {
      // Create a new tickets state object with all ticket types set to 0
      const initialTickets = {};
      currentEvent.ticket_types.forEach((ticket) => {
        initialTickets[ticket.type] = 0;
      });
      setTickets(initialTickets);
    }
  }, [currentEvent]);

  // Calculate total price whenever tickets change
  useEffect(() => {
    if (currentEvent && currentEvent.ticket_types) {
      let total = 0;

      // Calculate total based on selected tickets
      Object.keys(tickets).forEach((ticketType) => {
        const ticketInfo = currentEvent.ticket_types.find(
          (t) => t.type === ticketType
        );
        if (ticketInfo && tickets[ticketType]) {
          total += tickets[ticketType] * ticketInfo.price;
        }
      });

      setTotalPrice(total);
    }
  }, [tickets, currentEvent]);

  const handleTicketChange = (type, action) => {
    setTickets((prev) => {
      // Get the ticket info to check availability
      const ticketInfo = currentEvent.ticket_types.find((t) => t.type === type);

      // Calculate new value based on action
      let newValue =
        action === "increase"
          ? (prev[type] || 0) + 1
          : Math.max(0, (prev[type] || 0) - 1);

      // Ensure we don't exceed availability
      if (ticketInfo && newValue > ticketInfo.availability) {
        newValue = ticketInfo.availability;
      }

      return { ...prev, [type]: newValue };
    });
  };

  // Handle booking completion
  const handleCompleteBooking = () => {
    // Create order data to pass to checkout
    const orderData = {
      eventId: currentEvent._id,
      eventName: currentEvent.title,
      ticketSelections: tickets,
      totalAmount: totalPrice,
      ticketTypes: currentEvent.ticket_types,
    };

    // Store order data in localStorage (temporary solution)
    localStorage.setItem("pendingOrder", JSON.stringify(orderData));

    // Navigate to checkout page
    navigate("/checkout");
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

  // Get the API URL for images
  const API_URL = "http://localhost:5000";

  // Format event data for components
  const eventData = {
    title: currentEvent.title,
    image: currentEvent.banner
      ? `${API_URL}${currentEvent.banner}`
      : "/api/placeholder/800/400",
    date: new Date(currentEvent.date).toLocaleDateString(),
    time: new Date(currentEvent.date).toLocaleTimeString(),
    location: currentEvent.location,
    organizer: currentEvent.organizer_id || "Event Organizer",
    organizerEmail: currentEvent.organizerEmail || "contact@example.com",
    description: currentEvent.description,
    category: currentEvent.category,
    duration: currentEvent.duration,
  };

  // Create highlights based on available data
  const highlights = [];
  if (eventData.category) highlights.push(`Category: ${eventData.category}`);
  if (eventData.duration)
    highlights.push(`Duration: ${eventData.duration} hour(s)`);

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
                highlights.length > 0 ? highlights : ["Book your tickets now!"]
              }
            />

            {/* Organizer Info Component */}
            <OrganizerInfo
              organizer={eventData.organizer}
              email={eventData.organizerEmail}
            />

            {/* Ticket Selection Component - Pass actual ticket types from event */}
            <TicketSelection
              tickets={tickets}
              ticketTypes={currentEvent.ticket_types}
              handleTicketChange={handleTicketChange}
            />

            {/* Order Summary Component - Pass actual ticket types from event */}
            <OrderSummary
              tickets={tickets}
              ticketTypes={currentEvent.ticket_types}
              totalPrice={totalPrice}
            />

            {/* Book Now Button */}
            <div className="px-6 py-4">
              <button
                className="w-full py-4 text-lg font-bold text-white transition-all duration-300 bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                onClick={handleCompleteBooking}
                disabled={totalPrice === 0}
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
