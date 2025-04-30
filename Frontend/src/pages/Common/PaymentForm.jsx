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
  const [retryCount, setRetryCount] = useState(0);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [pendingPaymentId, setPendingPaymentId] = useState(null);

  const { clientSecret, intentLoading, loading, error, success } = useSelector(
    (state) => state.payments
  );

  // Check for any pending payment on load
  useEffect(() => {
    const pendingPaymentData = localStorage.getItem("pendingPayment");
    if (pendingPaymentData) {
      try {
        const pendingPayment = JSON.parse(pendingPaymentData);
        if (pendingPayment.orderId === orderId) {
          // We have a pending payment for this order
          setPendingPaymentId(pendingPayment.paypalOrderId);
          // We'll handle this after getting order details
        }
      } catch (error) {
        console.error("Error parsing pending payment data:", error);
      }
    }
  }, [orderId]);

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

          // If we have a pending payment ID, attempt to confirm it
          if (pendingPaymentId) {
            handlePendingPayment(pendingPaymentId, parsedOrder);
          }
        } catch (error) {
          console.error("Error parsing stored order:", error);
          setPaymentError("Error loading order details. Please try again.");
        }
      }

      // Create payment intent
      dispatch(createPaymentIntent(orderId));
      dispatch(setOrderId(orderId));
    }
  }, [dispatch, orderId, pendingPaymentId]);

  // Handle pending payment confirmation
  const handlePendingPayment = async (paypalOrderId, orderData) => {
    setIsProcessing(true);
    setPaymentInProgress(true);

    try {
      console.log("Attempting to confirm pending payment:", paypalOrderId);

      // Store the payment ID in case of page refresh/error
      dispatch(setPaymentIntentId(paypalOrderId));

      // Try to confirm the payment
      const confirmResult = await dispatch(
        confirmPayment({
          paymentIntentId: paypalOrderId,
          orderId: orderData.orderId,
        })
      ).unwrap();

      console.log("Payment confirmation result:", confirmResult);

      // If confirmed successfully, complete the process
      setPaymentSuccess(true);
      setFormVisible(false);
      localStorage.removeItem("pendingPayment");

      if (onSuccess) onSuccess({ id: paypalOrderId });
    } catch (error) {
      console.error("Error confirming pending payment:", error);
      setPaymentError(
        "We couldn't verify your previous payment. Please try again or contact support."
      );
      localStorage.removeItem("pendingPayment");
    } finally {
      setIsProcessing(false);
      setPaymentInProgress(false);
    }
  };

  // Extract amount from orderDetails
  const amount = orderDetails?.totalAmount || 0;

  // Create order for PayPal - properly format the amount
const createOrder = async () => {
  if (!amount || amount <= 0) {
    setPaymentError("Invalid order amount. Please try again.");
    return Promise.reject("Invalid amount");
  }

  try {
    console.log("Requesting backend PayPal order for orderId:", orderId);

    const result = await dispatch(createPaymentIntent(orderId)).unwrap();
    const paypalOrderId = result.paypalOrderId;

    if (!paypalOrderId) {
      throw new Error("No PayPal order ID returned from backend");
    }

    // Save it in localStorage in case the window is closed or refreshed
    localStorage.setItem(
      "pendingPayment",
      JSON.stringify({
        orderId,
        paypalOrderId,
        timestamp: Date.now(),
      })
    );

    dispatch(setPaymentIntentId(paypalOrderId));
    return paypalOrderId; // Returning PayPal order ID to PayPalButtons
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    setPaymentError("Could not initiate PayPal payment. Please try again.");
    return Promise.reject(error.message || "PayPal order creation failed");
  }
};


  // Enhanced onApprove with better error handling
  const onApprove = async (data, actions) => {
    setIsProcessing(true);
    console.log("Payment approved by user, capturing payment...");

    try {
      // Store the PayPal order ID in localStorage in case of window closure
      const paypalOrderId = data.orderID;
      localStorage.setItem(
        "pendingPayment",
        JSON.stringify({
          orderId: orderId,
          paypalOrderId: paypalOrderId,
          timestamp: Date.now(),
        })
      );

      // Set a timeout to prevent hanging if capture takes too long
      const capturePromise = actions.order.capture();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Payment capture timed out")), 30000)
      );

      // Race between capture and timeout
      const details = await Promise.race([capturePromise, timeoutPromise]);
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

      // Clear pending payment data
      localStorage.removeItem("pendingPayment");

      if (onSuccess) onSuccess({ id: details.id });

      return true;
    } catch (error) {
      console.error("Payment processing error:", error);

      // Special handling for "Window closed" error
      if (
        error.message?.includes("Window closed") ||
        error.message?.includes("closed before") ||
        error.name === "AbortError"
      ) {
        setPaymentError(
          "The payment window was closed. Don't worry - if you completed payment in PayPal, it should be processed when you return to this page. If you'd like to try again now, click the button below."
        );
      } else {
        setPaymentError(
          error.message || "Payment processing failed. Please try again."
        );
      }

      if (onError) onError(error.message || "Payment processing failed");
      return false;
    } finally {
      setIsProcessing(false);
      setPaymentInProgress(false);
    }
  };

  // Handle errors from PayPal
  const handlePayPalError = (err) => {
    console.error("PayPal error:", err);
    setPaymentInProgress(false);

    if (
      err.message?.includes("Window closed") ||
      err.message?.includes("closed before")
    ) {
      // Don't immediately show error - the user might have completed payment
      setPaymentError(
        "The PayPal window was closed. If you completed payment in PayPal, please wait a moment while we verify it."
      );

      // Wait briefly then check if we have a pending payment
      setTimeout(() => {
        const pendingPaymentData = localStorage.getItem("pendingPayment");
        if (pendingPaymentData) {
          try {
            const pendingPayment = JSON.parse(pendingPaymentData);
            if (
              pendingPayment.orderId === orderId &&
              pendingPayment.paypalOrderId
            ) {
              // If we have a payment ID, attempt to confirm it
              handlePendingPayment(pendingPayment.paypalOrderId, orderDetails);
            }
          } catch (error) {
            console.error(
              "Error parsing pending payment after window closed:",
              error
            );
          }
        }
      }, 2000);
    } else {
      setPaymentError(
        "PayPal payment failed. Please try again or use another payment method."
      );
      if (onError) onError("PayPal payment failed");
    }
  };

  // Reset error to try again
  const handleRetry = () => {
    setPaymentError(null);
    localStorage.removeItem("pendingPayment");
  };

  // Handle payment cancellation
  const handleCancel = () => {
    console.log("Payment cancelled by user");
    setPaymentInProgress(false);
    localStorage.removeItem("pendingPayment");
    setPaymentError(
      "Payment was cancelled. Please try again when you're ready."
    );
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
          {formVisible && !isProcessing && (
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
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center p-6 space-y-3">
                <div className="w-10 h-10 border-t-4 border-b-4 border-yellow-400 rounded-full animate-spin"></div>
                <span className="text-lg font-medium text-gray-700">
                  Processing payment...
                </span>
                <p className="text-sm text-center text-gray-500">
                  Please wait while we confirm your payment. This might take a
                  few moments.
                </p>
              </div>
            ) : pendingPaymentId ? (
              <div className="p-4 text-center rounded-md bg-blue-50">
                <p className="mb-3 text-blue-800">
                  We detected a pending payment for this order. Verifying
                  payment status...
                </p>
                <div className="w-8 h-8 mx-auto border-t-4 border-b-4 border-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : paymentError ? (
              <div className="p-4 text-sm rounded-md bg-red-50">
                <p className="mb-2 font-medium text-red-600">{paymentError}</p>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 mt-2 text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            ) : (
              amount > 0 && (
                <div className="w-full">
                  <PayPalButtons
                    style={{
                      color: "gold",
                      layout: "vertical",
                      shape: "rect",
                      label: "pay",
                    }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={handlePayPalError}
                    onCancel={handleCancel}
                    disabled={
                      isProcessing ||
                      intentLoading ||
                      loading ||
                      amount <= 0 ||
                      paymentInProgress
                    }
                  />
                  <p className="mt-3 text-xs text-center text-gray-500">
                    Please do not close the PayPal window until your payment is
                    complete.
                  </p>
                </div>
              )
            )}

            {amount <= 0 &&
              !isProcessing &&
              !pendingPaymentId &&
              !paymentError && (
                <div className="p-3 text-center rounded-md text-amber-700 bg-amber-50">
                  Loading order details... If this persists, please return to
                  the event page and try again.
                </div>
              )}
          </div>

          {error && !paymentError && (
            <div className="p-4 text-sm rounded-md bg-red-50">
              <p className="font-medium text-red-600">{error}</p>
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
