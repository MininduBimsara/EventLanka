import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaymentForm from "./PaymentForm";
import NavBar from "../../components/Common/Navbar";
import { createOrder } from "../../Redux/Slicers/orderSlice";
import { fetchEventById } from "../../Redux/Slicers/EventSlice";

// Set PayPal options
const paypalOptions = {
  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
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
  const [currentEvent, setCurrentEvent] = useState(null);

  const { user: currentUser } = useSelector((state) => state.user || {});
  const { event, loading } = useSelector((state) => state.events || {});

  // Retrieve pending order data from localStorage
  useEffect(() => {
    const orderData = localStorage.getItem("pendingOrder");
    if (orderData) {
      try {
        const parsedOrder = JSON.parse(orderData);
        setPendingOrder(parsedOrder);

        // Always fetch fresh event details to ensure we have ticket types
        fetchEventDetails(parsedOrder.eventId);
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

  // Monitor when event data is loaded and then create the order
  useEffect(() => {
    if (currentEvent && pendingOrder && !isCreatingOrder && !orderId) {
      createBackendOrder(pendingOrder);
    }
  }, [currentEvent, pendingOrder]);

  // Function to fetch event details
  const fetchEventDetails = async (eventId) => {
    try {
      // Dispatch the action to fetch event details
      const resultAction = await dispatch(fetchEventById(eventId));

      // Check if action was successful
      if (fetchEventById.fulfilled.match(resultAction)) {
        const eventData = resultAction.payload;
        console.log("Event data loaded:", eventData);

        // Set current event with the loaded data
        setCurrentEvent(eventData);
      } else {
        // Handle error case
        throw new Error(resultAction.error?.message || "Failed to fetch event");
      }
    } catch (error) {
      console.error("Error in fetchEventDetails:", error);
      setErrorMessage(`Failed to fetch event details: ${error.message}`);
    }
  };

  // Create the order in the backend
const createBackendOrder = async (orderData) => {
  if (!currentUser) {
    setErrorMessage("Please log in to complete your purchase.");
    return;
  }

  // Validate event data
  if (!currentEvent) {
    console.error("Current event is null");
    setErrorMessage("Event details not available. Please try again.");
    return;
  }

  if (!currentEvent.ticket_types || currentEvent.ticket_types.length === 0) {
    console.error("Event has no ticket types:", currentEvent);
    setErrorMessage("This event doesn't have any available tickets.");
    return;
  }

  console.log("Creating order with event:", currentEvent);
  console.log("Order data from localStorage:", orderData);

  setIsCreatingOrder(true);

  try {
    // Verify we have the required data
    if (!orderData || !orderData.ticketSelections) {
      throw new Error("Order data incomplete - missing ticket selections");
    }

    // Create the tickets array for the order
    const ticketsArray = [];

    for (const [type, quantity] of Object.entries(orderData.ticketSelections)) {
      if (quantity > 0) {
        // Find the ticket type in the event data
        const ticketInfo = currentEvent.ticket_types.find(
          (ticket) => ticket.type === type
        );

        if (ticketInfo) {
          ticketsArray.push({
            ticket_type: type, // Use the type string, not the ID
            quantity: parseInt(quantity),
            event_id: orderData.eventId, // Add the event ID
          });
        } else {
          console.warn(`Ticket type ${type} not found in event data`);
        }
      }
    }

    if (ticketsArray.length === 0) {
      throw new Error("No valid tickets selected");
    }

    // Create the backend order - use field names that match your backend
    const orderPayload = {
      event_id: orderData.eventId,
      tickets: ticketsArray,
      total_amount: orderData.totalAmount,
      payment_method: "paypal",
    };

    console.log("Submitting order payload:", orderPayload);
    const result = await dispatch(createOrder(orderPayload)).unwrap();
    console.log("Order creation result:", result);
    setOrderId(result.order._id);
  } catch (error) {
    console.error("Order creation failed:", error);
    setErrorMessage(
      `Failed to create order: ${error.message || "Unknown error"}`
    );
  } finally {
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
