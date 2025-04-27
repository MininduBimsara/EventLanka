import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaymentForm from "./PaymentForm";
import NavBar from "../../components/Common/Navbar";
import axios from "axios";
import { createOrder } from "../../Redux/Slicers/orderSlice";
import { fetchEventById } from "../../Redux/Slicers/EventSlice"; // Import the thunk

// Set PayPal options
const paypalOptions = {
  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, // Make sure to add this to your .env file
  currency: "USD",
  intent: "capture",
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pendingOrder, setPendingOrder] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentEvent, setCurrentEvent] = useState(null); // Add state for current event

  const { user: currentUser } = useSelector((state) => state.user || {});
  const { loading, error, success } = useSelector(
    (state) => state.payments || {}
  );

  // Retrieve pending order data from localStorage
  useEffect(() => {
    const orderData = localStorage.getItem("pendingOrder");
    if (orderData) {
      try {
        const parsedOrder = JSON.parse(orderData);
        setPendingOrder(parsedOrder);

        // If we already have ticket types from localStorage, use them directly
        if (parsedOrder.ticketTypes) {
          setCurrentEvent({ ticket_types: parsedOrder.ticketTypes });
          // Create order with the data we already have
          createBackendOrder(parsedOrder);
        } else {
          // Otherwise fetch event details
          fetchEventDetails(parsedOrder.eventId);
        }
      } catch (error) {
        console.error("Error parsing order data:", error);
        setErrorMessage("Invalid order data. Please try booking again.");
      }
    } else {
      setErrorMessage(
        "No order found. Please select an event to book tickets."
      );
    }
  }, []);

  // Function to fetch event details
const fetchEventDetails = async (eventId) => {
  try {
    const resultAction = await dispatch(fetchEventById(eventId)).unwrap();

    if (!resultAction || !resultAction.ticket_types) {
      throw new Error("Event details incomplete or invalid");
    }

    setCurrentEvent(resultAction);
    createBackendOrder(JSON.parse(localStorage.getItem("pendingOrder")));
  } catch (error) {
    console.error("Error fetching event details:", error);
    setErrorMessage("Failed to fetch event details. Please try again.");
  }
};

  // Create the order in the backend
  const createBackendOrder = async (orderData) => {
    if (!currentUser) {
      setErrorMessage("Please log in to complete your purchase.");
      return;
    }

    if (!currentEvent) {
      setErrorMessage("Event details not available. Please try again.");
      return;
    }

    setIsCreatingOrder(true);
    try {
      // Create the backend order
      const orderPayload = {
        eventId: orderData.eventId,
        userId: currentUser._id,
        tickets: Object.entries(orderData.ticketSelections)
          .map(([type, quantity]) => {
            // Find the ticket ID that corresponds to this type
            const ticketInfo = currentEvent.ticket_types.find(
              (ticket) => ticket.type === type
            );

            // Only proceed if we found the ticket info
            if (!ticketInfo) {
              console.error(`Ticket type ${type} not found in event data`);
              return null;
            }

            return {
              ticket_type: ticketInfo._id, // Send the ID instead of the string
              quantity,
            };
          })
          .filter((ticket) => ticket && ticket.quantity > 0), // Only include valid tickets with quantity > 0
        totalAmount: orderData.totalAmount,
        payment_method: "paypal",
      };

      const result = await dispatch(createOrder(orderPayload)).unwrap();
      setOrderId(result.order._id);
      setIsCreatingOrder(false);
    } catch (error) {
      console.error("Order creation failed:", error);
      setErrorMessage(
        error.message || "Failed to create order. Please try again."
      );
      setIsCreatingOrder(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    // Clear the pending order from localStorage
    localStorage.removeItem("pendingOrder");

    // Navigate to success page
    navigate(`/payment-success/${paymentIntent.id}`);
  };

  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
    setErrorMessage(`Payment failed: ${error}`);
  };

  if (errorMessage) {
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
              {errorMessage}
            </p>
            <button
              className="px-4 py-2 mt-4 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              onClick={() => navigate("/events")}
            >
              Browse Events
            </button>
          </div>
        </div>
      </>
    );
  }

  if (isCreatingOrder || !orderId) {
    return (
      <>
        <NavBar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-500 via-pink-500 to-orange-400">
          <div className="p-8 text-center bg-white rounded-lg shadow-xl">
            <div className="w-16 h-16 mx-auto border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-xl font-semibold text-purple-700">
              Preparing your order...
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
          <div className="w-full max-w-4xl p-6 mx-auto bg-white shadow-xl rounded-2xl">
            <h1 className="mb-6 text-3xl font-bold text-center text-purple-700">
              Complete Your Purchase
            </h1>

            {/* Order Summary */}
            {pendingOrder && (
              <div className="p-4 mb-6 bg-purple-100 rounded-lg">
                <h2 className="text-xl font-semibold text-purple-800">
                  Order Summary
                </h2>
                <div className="mt-2">
                  <p className="text-lg font-medium">
                    {pendingOrder.eventName}
                  </p>
                  <p className="mt-1 text-gray-600">
                    Total: ${pendingOrder.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* PayPal Integration */}
            <PayPalScriptProvider options={paypalOptions}>
              <PaymentForm
                orderId={orderId}
                eventName={pendingOrder?.eventName || "Event Booking"}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </PayPalScriptProvider>

            {/* Cancel Button */}
            <div className="mt-6 text-center">
              <button
                className="text-gray-600 hover:text-purple-700"
                onClick={() => {
                  localStorage.removeItem("pendingOrder");
                  navigate(-1);
                }}
              >
                Cancel and return to event
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
