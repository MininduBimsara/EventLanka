import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButtons } from "@paypal/react-paypal-js";
import {
  createPaymentIntent,
  processPayment,
  confirmPayment,
  setPaymentIntentId,
  setOrderId,
} from "../../Redux/Slicers/PaymentSlice";

const PaymentForm = ({ orderId, eventName, onSuccess, onError }) => {
  const dispatch = useDispatch();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [formVisible, setFormVisible] = useState(true);

  const { clientSecret, intentLoading, loading, error, success } = useSelector(
    (state) => state.payments
  );

  // Get the order details when the component mounts
  useEffect(() => {
    if (orderId) {
      // Load order details from localStorage
      const storedOrder = localStorage.getItem("pendingOrder");
      if (storedOrder) {
        try {
          const parsedOrder = JSON.parse(storedOrder);
          setOrderDetails(parsedOrder);
          console.log("Loaded order details from storage:", parsedOrder);
        } catch (error) {
          console.error("Error parsing stored order:", error);
          setPaymentError("Error loading order details. Please try again.");
        }
      }

      // Create payment intent
      dispatch(createPaymentIntent(orderId));
      dispatch(setOrderId(orderId));
    }
  }, [dispatch, orderId]);

  // Extract amount from orderDetails
  const amount = orderDetails?.totalAmount || 0;

  // Create order for PayPal - properly format the amount
  const createOrder = (data, actions) => {
    if (!amount || amount <= 0) {
      setPaymentError("Invalid order amount. Please try again.");
      return Promise.reject("Invalid amount");
    }

    const paymentAmount = parseFloat(amount).toFixed(2);
    console.log("Creating PayPal order for orderId:", orderId);
    console.log("Using amount from stored order:", paymentAmount);

    return actions.order.create({
      purchase_units: [
        {
          description: eventName,
          amount: {
            currency_code: "USD",
            value: paymentAmount,
          },
        },
      ],
      // Add application context to improve flow
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    });
  };

  // Simplified onApprove - handle the PayPal approval
  const onApprove = async (data, actions) => {
    setIsProcessing(true);
    console.log("Payment approved by user, capturing payment...");

    try {
      // Capture the funds from the transaction
      const details = await actions.order.capture();
      console.log("PayPal capture details:", details);

      // Store the payment intent ID
      dispatch(setPaymentIntentId(details.id));

      // Process the payment on our backend
      const paymentData = {
        orderId,
        paymentMethod: "paypal",
        amount: parseFloat(amount),
        paypalOrderId: details.id,
        paypalPayerId: details.payer.payer_id,
      };

      await dispatch(processPayment(paymentData)).unwrap();

      // Success handling
      setPaymentSuccess(true);
      setFormVisible(false);
      if (onSuccess) onSuccess({ id: details.id });

      return true; // This is important for PayPal to know the flow completed
    } catch (error) {
      console.error("Payment processing error:", error);
      setPaymentError(error.message || "Payment processing failed");
      if (onError) onError(error.message || "Payment processing failed");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle errors from PayPal
  const onError = (err) => {
    console.error("PayPal error:", err);
    setPaymentError(
      "PayPal payment failed. Please try again or use another payment method."
    );
    if (onError) onError("PayPal payment failed");
  };

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
        className="absolute w-24 h-24 transform bg-no-repeat bg-contain -bottom-10 -left-6 opacity-20 -rotate-12"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23f8d12f' d='M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z'/%3E%3C/svg%3E")`,
        }}
      ></div>
      <div
        className="absolute w-24 h-24 transform bg-no-repeat bg-contain -bottom-12 -right-10 opacity-20 -rotate-12"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23f8d12f' d='M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <h2 className="relative z-10 mb-6 text-2xl font-bold text-center text-red-600 font-festive">
        Complete Your Registration
      </h2>

      <div className="flex items-center justify-between p-4 mb-6 border-l-4 border-red-600 rounded-lg bg-yellow-50">
        <span className="font-semibold text-gray-800">{eventName}</span>
        <span className="text-lg font-bold text-red-600">
          ${amount ? parseFloat(amount).toFixed(2) : "0.00"}
        </span>
      </div>

      {paymentSuccess ? (
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
        <div className="space-y-6">
          {formVisible && (
            <>
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
            </>
          )}

          <div className="pt-2">
            <div className="w-full">
              {isProcessing ? (
                <div className="flex items-center justify-center p-4">
                  <div className="w-8 h-8 border-t-4 border-b-4 border-yellow-400 rounded-full animate-spin"></div>
                  <span className="ml-2 text-gray-600">
                    Processing payment...
                  </span>
                </div>
              ) : (
                amount > 0 && (
                  <PayPalButtons
                    style={{
                      color: "gold",
                      layout: "vertical",
                      shape: "rect",
                      label: "pay",
                    }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    disabled={
                      isProcessing || intentLoading || loading || amount <= 0
                    }
                  />
                )
              )}

              {amount <= 0 && !isProcessing && (
                <div className="p-3 text-center rounded-md text-amber-700 bg-amber-50">
                  Loading order details... If this persists, please return to
                  the event page and try again.
                </div>
              )}
            </div>
          </div>

          {(paymentError || error) && (
            <div className="p-3 text-sm text-red-600 rounded-md bg-red-50">
              {paymentError || error}
            </div>
          )}
        </div>
      )}

      {/* Add custom styles for animation and festive font */}
      <style>{`
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
