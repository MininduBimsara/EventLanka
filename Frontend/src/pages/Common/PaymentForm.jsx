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

  const { clientSecret, intentLoading, loading, error, success } = useSelector(
    (state) => state.payments
  );

  // Get the order details when the component mounts
  useEffect(() => {
    if (orderId) {
      dispatch(createPaymentIntent(orderId));
      dispatch(setOrderId(orderId));
    }
  }, [dispatch, orderId]);

  // Extract amount from eventName or use a default
  const amount = eventName.includes("$")
    ? eventName.split("$")[1].trim()
    : "0.00";

  // Create order for PayPal
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: eventName,
          amount: {
            currency_code: "USD",
            value: amount,
          },
        },
      ],
    });
  };

  // Handle approval
  const onApprove = (data, actions) => {
    setIsProcessing(true);

    return actions.order.capture().then((details) => {
      // Store the payment details
      setOrderDetails(details);

      // Store the payment intent ID (PayPal order ID in this case)
      dispatch(setPaymentIntentId(details.id));

      // Process the payment on our backend
      const paymentData = {
        orderId,
        paymentMethod: "paypal",
        amount: parseFloat(amount),
        paypalOrderId: details.id,
        paypalPayerId: details.payer.payer_id,
      };

      return dispatch(processPayment(paymentData))
        .unwrap()
        .then(() => {
          // Confirm the payment on our backend
          return dispatch(
            confirmPayment({
              paymentIntentId: details.id,
              orderId,
            })
          ).unwrap();
        })
        .then(() => {
          setPaymentSuccess(true);
          onSuccess && onSuccess({ id: details.id });
        })
        .catch((err) => {
          setPaymentError(err.message || "Payment processing failed");
          onError && onError(err.message || "Payment processing failed");
        })
        .finally(() => {
          setIsProcessing(false);
        });
    });
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
        <div className="space-y-6">
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
                <PayPalButtons
                  style={{
                    color: "gold",
                    layout: "vertical",
                    shape: "rect",
                    label: "pay",
                  }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={(err) => {
                    setPaymentError(err.message || "PayPal payment failed");
                    onError && onError(err.message || "PayPal payment failed");
                  }}
                  disabled={isProcessing || intentLoading || loading}
                />
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
