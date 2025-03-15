import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import OrganizerInfo from "../../components/EventBooking/OrganizerInfo";
import OrderSummary from "../../components/EventBooking/OrderSummary";
import TicketSelecton from "../../components/EventBooking/TicketSelection";
import EventDetails from "../../components/EventBooking/EventDetails";
import EventImage from "../../components/EventBooking/EventImage";
import ColorDivider from "../../components/EventBooking/ColorDivider";
import EventDescription from "../../components/EventBooking/EventDescription";
import EventHighlights from "../../components/EventBooking/EventHighlights";
import NavBar from "../../components/NavBar";

const EventBookingPage = () => {
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

  const eventDetails = {
    title: "Summer Music Festival 2025",
    image: "/api/placeholder/800/400",
    date: "April 18-20, 2025",
    time: "12:00 PM - 11:00 PM",
    location: "Riverside Park, Downtown",
    organizer: "Melody Events Co.",
    organizerEmail: "info@melodyevents.com",
    description:
      "Join us for three days of amazing live performances featuring top artists from around the world. Food, drinks, and unforgettable memories guaranteed!",
  };

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

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-b from-purple-500 via-pink-500 to-orange-400">
        <div className="container px-4 py-8 mx-auto">
          <div className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-xl rounded-2xl">
            {/* Event Image and Title */}
            <EventImage image={eventDetails.image} title={eventDetails.title} />

            {/* Color Divider Component */}
            <ColorDivider />

            {/* Event Details Component */}
            <EventDetails
              date={eventDetails.date}
              time={eventDetails.time}
              location={eventDetails.location}
            />

            {/* Event Description Component */}
            <EventDescription description={eventDetails.description} />

            {/* Event Highlights Component */}

            <EventHighlights
              highlights={[
                "Live performances by top artists",
                "Food and drinks available",
                "Family-friendly event",
              ]}
            />

            {/* Organizer Info Component */}
            <OrganizerInfo
              organizer={eventDetails.organizer}
              email={eventDetails.organizerEmail}
            />

            {/* Ticket Selection Component */}
            <TicketSelecton
              tickets={tickets}
              ticketPrices={ticketPrices}
              onTicketChange={handleTicketChange}
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
