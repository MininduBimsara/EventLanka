import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaymentForm from "./PaymentForm";
import NavBar from "../../components/Common/Navbar";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create an async thunk for creating an order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders/create",
        orderData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);

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

  const { currentUser } = useSelector((state) => state.auth || {});
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
        createBackendOrder(parsedOrder);
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

  // Create the order in the backend
  const createBackendOrder = async (orderData) => {
    if (!currentUser) {
      setErrorMessage("Please log in to complete your purchase.");
      return;
    }

    setIsCreatingOrder(true);
    try {
      // Create the backend order
      const orderPayload = {
        eventId: orderData.eventId,
        userId: currentUser._id,
        tickets: Object.entries(orderData.ticketSelections).map(
          ([type, quantity]) => ({
            ticket_type: type,
            quantity,
          })
        ),
        totalAmount: orderData.totalAmount,
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
