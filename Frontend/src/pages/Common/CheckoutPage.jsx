import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaymentForm from "./PaymentForm";
import NavBar from "../../components/Common/Navbar";
import { createOrder } from "../../Redux/Slicers/orderSlice";
import { fetchEventById } from "../../Redux/Slicers/EventSlice";
import { resetPaymentStatus } from "../../Redux/Slicers/PaymentSlice";

// Set PayPal options
const paypalOptions = {
  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
  "data-client-token": import.meta.env.VITE_PAYPAL_CLIENT_TOKEN, // Add client token if available
  "disable-funding": "card", // Optional: disable specific payment methods if needed
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pendingOrder, setPendingOrder] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isRetryingPayment, setIsRetryingPayment] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Preparing your order..."
  );

  const { user: currentUser } = useSelector((state) => state.user || {});
  const { event, loading } = useSelector((state) => state.events || {});
  const { error: paymentError } = useSelector((state) => state.payments || {});

  // Reset payment status when the component mounts
  useEffect(() => {
    dispatch(resetPaymentStatus());

    // Check for pendingPayment in localStorage
    const pendingPaymentData = localStorage.getItem("pendingPayment");
    if (pendingPaymentData) {
      try {
        const pendingPayment = JSON.parse(pendingPaymentData);
        const timestamp = pendingPayment.timestamp || 0;
        const currentTime = Date.now();

        // If the pending payment is more than 30 minutes old, remove it
        if (currentTime - timestamp > 30 * 60 * 1000) {
          localStorage.removeItem("pendingPayment");
        } else {
          setIsRetryingPayment(true);
          setLoadingMessage("Resuming your previous payment...");
        }
      } catch (error) {
        console.error("Error parsing pendingPayment data:", error);
        localStorage.removeItem("pendingPayment");
      }
    }

    return () => {
      // Clean up on unmount
      dispatch(resetPaymentStatus());
    };
  }, [dispatch]);

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

  // Update error message if payment error occurs
  useEffect(() => {
    if (paymentError && !errorMessage) {
      setErrorMessage(`Payment issue: ${paymentError}`);
    }
  }, [paymentError]);

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

      // Ensure we have a valid amount
      if (!orderData.totalAmount || orderData.totalAmount <= 0) {
        throw new Error("Invalid order amount");
      }

      // Create the tickets array for the order
      const ticketsArray = [];

      for (const [type, quantity] of Object.entries(
        orderData.ticketSelections
      )) {
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

      // Check if we already have an orderId in the pendingOrder
      if (orderData.orderId) {
        console.log("Using existing orderId:", orderData.orderId);
        setOrderId(orderData.orderId);
      } else {
        // Create a new order
        const result = await dispatch(createOrder(orderPayload)).unwrap();
        console.log("Order creation result:", result);

        // Make sure the order total is saved in localStorage for the payment form
        const updatedOrderData = {
          ...orderData,
          orderId: result.order._id,
        };
        localStorage.setItem("pendingOrder", JSON.stringify(updatedOrderData));

        setOrderId(result.order._id);
      }
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
    console.log("Payment successful:", paymentIntent);

    // Clear the pending order and payment from localStorage
    localStorage.removeItem("pendingOrder");
    localStorage.removeItem("pendingPayment");

    // Navigate to success page
    navigate(`/payment-success/${paymentIntent.id}`);
  };

const handlePaymentError = (error) => {
  console.error("Payment failed:", error);

  const errorMessage =
    typeof error === "string" ? error : error?.message || "Unknown error";

  // Handle window closure errors with more specific guidance
  if (
    errorMessage.includes("Window closed") ||
    errorMessage.includes("closed before") ||
    errorMessage.includes("Window_closed")
  ) {
    // Don't immediately show error if it's just a window closure
    // The PaymentForm will handle showing the pending payment status
    setErrorMessage(
      "The payment window was closed. If you completed payment in PayPal, please wait a moment while we verify it. Otherwise, you can try again."
    );

    // Check if we have a pending payment in localStorage that needs verification
    const pendingPaymentData = localStorage.getItem("pendingPayment");
    if (pendingPaymentData) {
      try {
        JSON.parse(pendingPaymentData); // Just verify it's valid JSON
        // Don't set error message as the payment may still be processing
        setErrorMessage("");
      } catch (e) {
        console.error("Invalid pending payment data:", e);
      }
    }
  } else {
    // Handle other payment errors
    setErrorMessage(`Payment failed: ${errorMessage}`);
  }
};

  const handleRetryPayment = () => {
    setErrorMessage("");
    // Don't remove pendingPayment to allow continuation
    window.location.reload(); // Simple reload to restart the process
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
            <div className="flex flex-col items-center mt-6 space-y-3">
              {errorMessage.includes("window was closed") && (
                <button
                  className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                  onClick={handleRetryPayment}
                >
                  Resume Payment
                </button>
              )}
              <button
                className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                onClick={() => navigate("/events")}
              >
                Browse Events
              </button>
            </div>
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
              {loadingMessage}
            </p>
            {isRetryingPayment && (
              <p className="mt-2 text-sm text-gray-600">
                We detected a previously started payment. Preparing to resume...
              </p>
            )}
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
                  // Ask for confirmation before cancelling if there's a pending payment
                  const pendingPayment = localStorage.getItem("pendingPayment");
                  if (pendingPayment) {
                    if (
                      window.confirm(
                        "A payment may be in progress. Are you sure you want to cancel?"
                      )
                    ) {
                      localStorage.removeItem("pendingOrder");
                      localStorage.removeItem("pendingPayment");
                      navigate(-1);
                    }
                  } else {
                    localStorage.removeItem("pendingOrder");
                    navigate(-1);
                  }
                }}
              >
                Cancel and return to event
              </button>
            </div>

            {/* Payment Security Notice */}
            <div className="flex items-center justify-center mt-6 text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
              <span>Secure payment processed by PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
