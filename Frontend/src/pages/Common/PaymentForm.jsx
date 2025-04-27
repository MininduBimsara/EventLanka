import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import {
  createPaymentIntent,
  confirmPayment,
  setPaymentIntentId,
  setOrderId,
} from "./PaymentSlice";

const PaymentForm = ({ orderId, eventName, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { clientSecret, intentLoading, loading, error, success } = useSelector(
    (state) => state.payments
  );

  // Get the client secret when the component mounts
  useEffect(() => {
    if (orderId) {
      dispatch(createPaymentIntent(orderId));
      dispatch(setOrderId(orderId));
    }
  }, [dispatch, orderId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      // Stripe.js has not yet loaded or client secret not available
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Process the payment with Stripe using the client secret
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
          },
        },
      });

      if (result.error) {
        setPaymentError(result.error.message);
        onError && onError(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          // Store the payment intent ID
          dispatch(setPaymentIntentId(result.paymentIntent.id));

          // Confirm the payment on our backend
          await dispatch(
            confirmPayment({
              paymentIntentId: result.paymentIntent.id,
              orderId,
            })
          );

          setPaymentSuccess(true);
          onSuccess && onSuccess(result.paymentIntent);
        }
      }
    } catch (error) {
      setPaymentError("An unexpected error occurred. Please try again.");
      onError && onError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#4B5563",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        "::placeholder": {
          color: "#9CA3AF",
        },
      },
      invalid: {
        color: "#EF4444",
      },
    },
  };

  // Calculate the amount display from the event name (assuming it's stored in format "Event Name - $XX.XX")
  const amount = eventName.includes("$")
    ? eventName.split("$")[1].trim()
    : "0.00";

  return (
    <div className="relative max-w-md p-6 mx-auto overflow-hidden bg-white border-2 border-yellow-400 shadow-lg rounded-xl">
      {/* Festive decorations */}
      <div
        className="absolute w-24 h-24 transform bg-no-repeat bg-contain -top-12 -left-12 opacity-20 rotate-12"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23f8d12f' d='M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z'/%3E%3C/svg%3E")`,
        }}
      ></div>
      <div
        className="absolute w-24 h-24 transform rotate-45 bg-no-repeat bg-contain -top-8 -right-8 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23f8d12f' d='M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z'/%3E%3C/svg%3E")`,
        }}
      ></div>
      <div
        className="absolute w-24 h-24 transform bg-no-repeat bg-contain -bottom-10 -left-6 opacity-20 -rotate-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23f8d12f' d='M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z'/%3E%3C/svg%3E")`,
        }}
      ></div>
      <div
        className="absolute w-24 h-24 transform bg-no-repeat bg-contain -bottom-12 -right-10 opacity-20 -rotate-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23f8d12f' d='M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <h2 className="relative z-10 mb-6 text-2xl font-bold text-center text-red-600 font-festive">
        Complete Your Registration
      </h2>

      <div className="flex items-center justify-between p-4 mb-6 border-l-4 border-red-600 rounded-lg bg-yellow-50">
        <span className="font-semibold text-gray-800">{eventName}</span>
        <span className="text-lg font-bold text-red-600">${amount}</span>
      </div>

      {paymentSuccess || success ? (
        <div className="relative py-8 text-center">
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23f8d12f' x='0' y='0' width='10' height='10'/%3E%3Crect fill='%23e63946' x='20' y='10' width='8' height='8'/%3E%3Crect fill='%232ecc71' x='40' y='20' width='12' height='12'/%3E%3Crect fill='%23f39c12' x='60' y='5' width='7' height='7'/%3E%3Crect fill='%233498db' x='80' y='15' width='9' height='9'/%3E%3C/svg%3E")`,
            }}
          ></div>
          <h3 className="mb-4 text-2xl font-bold text-green-600 font-festive">
            Payment Successful!
          </h3>
          <p className="text-gray-700">
            Thank you for registering for this event. You will receive a
            confirmation email shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="card-element"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Credit or Debit Card
            </label>
            <div className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-transparent">
              <CardElement id="card-element" options={cardElementOptions} />
            </div>
          </div>

          {(paymentError || error) && (
            <div className="p-3 text-sm text-red-600 rounded-md bg-red-50">
              {paymentError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              !stripe ||
              !clientSecret ||
              isProcessing ||
              intentLoading ||
              loading
            }
            className={`w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors ${
              isProcessing || intentLoading || loading
                ? "relative overflow-hidden bg-opacity-70"
                : ""
            }`}
          >
            {isProcessing || intentLoading || loading ? (
              <>
                <span>Processing...</span>
                <span className="absolute inset-0 overflow-hidden">
                  <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
                </span>
              </>
            ) : (
              `Pay $${amount}`
            )}
          </button>
        </form>
      )}

      {/* Add custom styles for animation and festive font */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap");

        .font-festive {
          font-family: "Dancing Script", cursive;
        }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentForm;
