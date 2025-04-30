import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButtons } from "@paypal/react-paypal-js";
import {
  createPaymentIntent,
  processPayment,
  confirmPayment,
  setPaymentIntentId,
  setOrderId,
  checkPaymentStatus,
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
  const [showPendingNotice, setShowPendingNotice] = useState(false);

  const { clientSecret, intentLoading, loading, error, success } = useSelector(
    (state) => state.payments
  );

  useEffect(() => {
    const pendingPaymentData = localStorage.getItem("pendingPayment");
    if (pendingPaymentData) {
      try {
        const pendingPayment = JSON.parse(pendingPaymentData);
        const paymentTimestamp = pendingPayment.timestamp || 0;
        const currentTime = Date.now();
        const thirtyMinutesInMs = 30 * 60 * 1000;

        if (currentTime - paymentTimestamp > thirtyMinutesInMs) {
          console.log("Removing stale pending payment");
          localStorage.removeItem("pendingPayment");
        } else if (pendingPayment.orderId === orderId) {
          setPendingPaymentId(pendingPayment.paypalOrderId);
          setShowPendingNotice(true);
        }
      } catch (error) {
        console.error("Error parsing pending payment data:", error);
        localStorage.removeItem("pendingPayment");
      }
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      const storedOrder = localStorage.getItem("pendingOrder");
      if (storedOrder) {
        try {
          const parsedOrder = JSON.parse(storedOrder);
          setOrderDetails(parsedOrder);
          if (pendingPaymentId) {
            handlePendingPayment(pendingPaymentId, parsedOrder);
          }
        } catch (error) {
          console.error("Error parsing stored order:", error);
          setPaymentError("Error loading order details. Please try again.");
        }
      }

      dispatch(createPaymentIntent(orderId));
      dispatch(setOrderId(orderId));
    }
  }, [dispatch, orderId, pendingPaymentId]);

  useEffect(() => {
    let pollingTimer;
    let attempts = 0;

    if (
      showPendingNotice &&
      pendingPaymentId &&
      !isProcessing &&
      !paymentSuccess
    ) {
      pollingTimer = setInterval(() => {
        if (attempts >= 12) {
          clearInterval(pollingTimer);
          return;
        }
        console.log(`Status check attempt ${attempts + 1}`);
        checkPendingPaymentStatus(pendingPaymentId);
        attempts++;
      }, 5000);
    }

    return () => {
      if (pollingTimer) clearInterval(pollingTimer);
    };
  }, [showPendingNotice, pendingPaymentId, isProcessing, paymentSuccess]);

const checkPendingPaymentStatus = async (paypalOrderId) => {
  if (!orderId || !paypalOrderId) return;

  console.log(
    `Checking payment status for order ${orderId}, PayPal ID: ${paypalOrderId}`
  );

  try {
    const result = await dispatch(
      checkPaymentStatus({ paymentIntentId: paypalOrderId, orderId })
    ).unwrap();

    if (result.success) {
      console.log("Payment verification successful:", result);
      setPaymentSuccess(true);
      setFormVisible(false);
      setIsProcessing(false);
      setShowPendingNotice(false);
      localStorage.removeItem("pendingPayment");

      if (onSuccess) onSuccess({ id: paypalOrderId });
    } else if (result.status === "pending") {
      console.log("Payment still pending, will check again");
      // Keep the pending notice visible
    } else {
      console.log("Payment verification failed with status:", result.status);
    }
  } catch (error) {
    console.error("Payment status check failed:", error);
  }
};

  const handlePendingPayment = async (paypalOrderId, orderData) => {
    setIsProcessing(true);
    setPaymentInProgress(true);
    let attempts = 0;

    while (attempts < 3) {
      try {
        dispatch(setPaymentIntentId(paypalOrderId));

        const statusResult = await dispatch(
          checkPaymentStatus({ paymentIntentId: paypalOrderId, orderId })
        ).unwrap();

        if (statusResult.success) {
          setPaymentSuccess(true);
          setFormVisible(false);
          localStorage.removeItem("pendingPayment");
          if (onSuccess) onSuccess({ id: paypalOrderId });
          return;
        }
      } catch (err) {
        console.warn(`Retry ${attempts + 1} for payment confirmation failed`);
      }

      await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, attempts)));
      attempts++;
    }

    try {
      const confirmResult = await dispatch(
        confirmPayment({
          paymentIntentId: paypalOrderId,
          orderId: orderData.orderId,
        })
      ).unwrap();

      setPaymentSuccess(true);
      setFormVisible(false);
      localStorage.removeItem("pendingPayment");

      if (onSuccess) onSuccess({ id: paypalOrderId });
    } catch (error) {
      console.error("Final confirmation failed:", error);
      setShowPendingNotice(true);
    } finally {
      setIsProcessing(false);
      setPaymentInProgress(false);
    }
  };

  const amount = orderDetails?.totalAmount || 0;

const createOrder = async () => {
  if (!amount || amount <= 0) {
    setPaymentError("Invalid order amount. Please try again.");
    return Promise.reject("Invalid amount");
  }

  try {
    // Check if we already have a pending payment
    const pendingPaymentData = localStorage.getItem("pendingPayment");
    if (pendingPaymentData) {
      try {
        const pendingPayment = JSON.parse(pendingPaymentData);
        // If the pending payment is for the current order and recent (less than 10 minutes old)
        if (
          pendingPayment.orderId === orderId &&
          Date.now() - pendingPayment.timestamp < 10 * 60 * 1000
        ) {
          console.log(
            "Using existing PayPal order ID:",
            pendingPayment.paypalOrderId
          );
          return pendingPayment.paypalOrderId;
        }
      } catch (e) {
        console.error("Error parsing pending payment:", e);
        // Continue with creating a new order
      }
    }

    // Create a new payment intent
    const result = await dispatch(createPaymentIntent(orderId)).unwrap();
    const paypalOrderId = result.paypalOrderId;

    if (!paypalOrderId) {
      throw new Error("No PayPal order ID received from server");
    }

    // Save the pending payment
    localStorage.setItem(
      "pendingPayment",
      JSON.stringify({
        orderId,
        paypalOrderId,
        timestamp: Date.now(),
      })
    );

    dispatch(setPaymentIntentId(paypalOrderId));
    return paypalOrderId;
  } catch (error) {
    console.error("Could not initiate PayPal payment:", error);
    setPaymentError("Could not initiate PayPal payment. Please try again.");
    return Promise.reject(error.message || "Payment initialization failed");
  }
};

const onApprove = async (data, actions) => {
  setIsProcessing(true);

  try {
    const paypalOrderId = data.orderID;
    console.log("Payment approved with PayPal order ID:", paypalOrderId);

    // Update pending payment with latest order ID
    localStorage.setItem(
      "pendingPayment",
      JSON.stringify({
        orderId,
        paypalOrderId,
        timestamp: Date.now(),
        status: "approved", // Track that it was approved
      })
    );

    // Store the payment intent ID
    dispatch(setPaymentIntentId(paypalOrderId));

    // Create a capture promise with timeout
    const capturePromise = actions.order.capture();

    // Add a timeout in case capture takes too long
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Capture operation timed out"));
      }, 30000); // 30 second timeout
    });

    // Race the capture against the timeout
    const details = await Promise.race([capturePromise, timeoutPromise]);

    // Process the payment with our backend
    await dispatch(
      processPayment({
        orderId,
        paymentMethod: "paypal",
        amount: parseFloat(amount),
        paypalOrderId: details.id,
        paypalPayerId: details.payer.payer_id,
      })
    ).unwrap();

    setPaymentSuccess(true);
    setFormVisible(false);
    localStorage.removeItem("pendingPayment");
    if (onSuccess) onSuccess({ id: details.id });
    return true;
  } catch (error) {
    console.error("Error in onApprove:", error);

    // If the error contains "Window closed" or similar, handle as pending payment
    if (
      error.message?.includes("Window") ||
      error.message?.includes("closed") ||
      error.message?.toString().includes("timed out")
    ) {
      // We'll show the pending notice and start the verification process
      setShowPendingNotice(true);

      // Start polling for payment status
      const pendingPaymentData = localStorage.getItem("pendingPayment");
      if (pendingPaymentData) {
        try {
          const pendingPayment = JSON.parse(pendingPaymentData);
          setPendingPaymentId(pendingPayment.paypalOrderId);
          // Trigger one immediate check
          setTimeout(() => {
            checkPendingPaymentStatus(pendingPayment.paypalOrderId);
          }, 2000);
        } catch (e) {
          console.error("Error parsing pending payment for verification:", e);
        }
      }
    } else {
      // For other errors, show the error message
      if (onError) onError(error.message || "Payment processing failed");
    }

    setPaymentInProgress(false);
    return false;
  } finally {
    setIsProcessing(false);
  }
};

const handlePayPalError = (err) => {
  console.error("PayPal error:", err);
  setPaymentInProgress(false);
  setIsProcessing(false);

  // Standardize error handling for window closure
  const errorMessage = err.message || String(err);
  console.log("PayPal error message:", errorMessage);

  if (
    errorMessage.includes("Window closed") ||
    errorMessage.includes("closed before") ||
    errorMessage.includes("Window_closed") ||
    errorMessage.includes("message channel closed")
  ) {
    console.log("Detected window closure - checking payment status");
    setShowPendingNotice(true);
    setPaymentError(null);

    // Check if we have a pending payment that needs verification
    const pendingPaymentData = localStorage.getItem("pendingPayment");
    if (pendingPaymentData) {
      try {
        const pendingPayment = JSON.parse(pendingPaymentData);
        if (pendingPayment.paypalOrderId) {
          setPendingPaymentId(pendingPayment.paypalOrderId);

          // Wait a moment before checking (allow PayPal time to process)
          setTimeout(() => {
            checkPendingPaymentStatus(pendingPayment.paypalOrderId);
          }, 5000);

          // Set up multiple check attempts
          for (let i = 1; i <= 3; i++) {
            setTimeout(() => {
              checkPendingPaymentStatus(pendingPayment.paypalOrderId);
            }, 15000 * i); // Check after 15s, 30s, and 45s
          }
        }
      } catch (e) {
        console.error("Error parsing pending payment:", e);
      }
    }
  } else {
    setPaymentError(
      "PayPal payment failed: " + (errorMessage || "Unknown error")
    );
    if (onError) onError("PayPal payment failed");
  }
};

  const handleCancel = () => {
    setPaymentInProgress(false);
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
          {formVisible && !isProcessing && !showPendingNotice && (
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
            ) : showPendingNotice ? (
              <div className="p-4 text-center rounded-md bg-yellow-50">
                <div className="w-16 h-16 mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-16 h-16 text-yellow-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-yellow-700">
                  Payment In Progress
                </h3>
                <p className="mb-4 text-yellow-800">
                  The payment window was closed before we could confirm your
                  payment. If you completed payment in PayPal, please wait a
                  moment while we verify it.
                </p>
                <div className="flex justify-center mt-4 space-x-3">
                  <button
                    onClick={() => checkPendingPaymentStatus(pendingPaymentId)}
                    className="px-4 py-2 text-white bg-yellow-600 rounded hover:bg-yellow-700"
                  >
                    Check Status
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("pendingPayment");
                      setShowPendingNotice(false);
                      window.location.reload();
                    }}
                    className="px-4 py-2 text-yellow-700 bg-yellow-100 rounded hover:bg-yellow-200"
                  >
                    Start New Payment
                  </button>
                </div>
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
                {/* <button
                  onClick={handleRetry}
                  className="px-4 py-2 mt-2 text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Try Again
                </button> */}
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
                    forceReRender={[amount]}
                    disabled={
                      isProcessing ||
                      intentLoading ||
                      loading ||
                      paymentInProgress
                    }
                    fundingSource="paypal"
                    funding={{
                      disallowed: ["card"],
                    }}
                    commit={true}
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
