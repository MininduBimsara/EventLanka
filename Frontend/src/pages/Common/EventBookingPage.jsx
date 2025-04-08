import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
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
  const location = useLocation();
  const { id } = useParams();

  // Get event data from navigation state or fetch it based on ID
  const [eventData, setEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [tickets, setTickets] = useState({
    vip: 0,
    standard: 0,
    economy: 0,
  });

  const [totalPrice, setTotalPrice] = useState(0);

  const ticketPrices = {
    vip: 199.99,
    standard: 99.99,
    economy: 49.99,
  };

  useEffect(() => {
    // If event data was passed via navigation state
    if (location.state && location.state.eventData) {
      const event = location.state.eventData;

      // Format the received data to match what your components expect
      setEventData({
        title: event.name,
        image: "/api/placeholder/800/400", // You might want to add images to your event data
        date: event.date,
        time: event.time,
        location: event.venue,
        organizer: event.featuredArtists?.[0] || "Event Organizer",
        organizerEmail: "contact@example.com", // You might want to add this to your event data
        description: `Join us for an amazing ${event.category} event at ${
          event.venue
        }. ${event.trending ? "This is a trending event! " : ""}${
          event.discount ? "Special discount available!" : ""
        }`,
        category: event.category,
        featuredArtists: event.featuredArtists || [],
        price: event.price,
        bookingAvailable: event.bookingAvailable,
      });
      setIsLoading(false);
    } else {
      // If no state was passed, you could fetch the event data using the ID
      // This is a mock example - you would replace this with your actual data fetching
      const fetchEventData = async () => {
        try {
          // Simulating API call - replace with your actual data fetching
          // const response = await fetch(`/api/events/${id}`);
          // const data = await response.json();

          // For now, let's use a placeholder
          setTimeout(() => {
            setEventData({
              title: "Event Information Loading...",
              image: "/api/placeholder/800/400",
              date: "Loading...",
              time: "Loading...",
              location: "Loading...",
              organizer: "Loading...",
              organizerEmail: "info@example.com",
              description: "Loading event details...",
            });
            setIsLoading(false);
          }, 500);
        } catch (error) {
          console.error("Error fetching event data:", error);
          setIsLoading(false);
        }
      };

      fetchEventData();
    }
  }, [id, location.state]);

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

  if (isLoading) {
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
                eventData.featuredArtists || [
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

            {/* Content after Order Summary would go here */}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventBookingPage;
