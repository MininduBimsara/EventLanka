import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { downloadReceipt } from "../Redux/Slicers/PaymentSlice";
import NavBar from "../components/Common/Navbar";
import { motion } from "framer-motion";

const PaymentSuccessPage = () => {
  const { paymentIntentId } = useParams();
  const dispatch = useDispatch();
  const [transactionId, setTransactionId] = useState(null);
  const { currentPayment, downloading } = useSelector(
    (state) => state.payments
  );

  useEffect(() => {
    // In a real app, you would fetch payment details using the payment intent ID
    // For now, we'll simulate having the transaction ID
    // This is where you'd make an API call to get payment details
    const simulateLoadingPaymentDetails = async () => {
      // Simulating an API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Creating a fake transaction ID (in real app, get this from API)
      setTransactionId(`TXN-${Date.now().toString().slice(-6)}`);
    };

    simulateLoadingPaymentDetails();
  }, [paymentIntentId]);

  const handleDownloadReceipt = () => {
    if (transactionId) {
      dispatch(downloadReceipt(transactionId));
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen pt-20 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-400">
        <div className="container px-4 py-8 mx-auto">
          <motion.div
            className="w-full max-w-lg p-8 mx-auto overflow-hidden bg-white shadow-xl rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
                <svg
                  className="w-16 h-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="mt-6 text-3xl font-bold text-center text-gray-800">
              Payment Successful!
            </h1>
            <p className="mt-2 text-center text-gray-600">
              Your booking has been confirmed. Thank you for your purchase!
            </p>

            {/* Transaction Details */}
            <div className="p-4 mt-6 border rounded-lg bg-gray-50">
              <h2 className="font-semibold text-gray-700">
                Transaction Details
              </h2>
              {transactionId ? (
                <div className="mt-2">
                  <p className="text-gray-600">
                    Transaction ID: {transactionId}
                  </p>
                  <p className="text-gray-600">
                    Date: {new Date().toLocaleDateString()}
                  </p>
                  {currentPayment && (
                    <>
                      <p className="text-gray-600">
                        Amount: ${currentPayment.amount}
                      </p>
                      <p className="text-gray-600">
                        Payment Method: Credit Card
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-20">
                  <div className="w-8 h-8 border-b-2 border-gray-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Download Receipt Button */}
            <div className="mt-6">
              <button
                onClick={handleDownloadReceipt}
                disabled={!transactionId || downloading}
                className="flex items-center justify-center w-full py-3 font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-300"
              >
                {downloading ? (
                  <>
                    <span className="mr-2 animate-spin">⟳</span> Downloading...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      ></path>
                    </svg>
                    Download Receipt
                  </>
                )}
              </button>
            </div>

            {/* View Tickets Button */}
            <div className="mt-4">
              <Link
                to="/my-tickets"
                className="flex items-center justify-center w-full py-3 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  ></path>
                </svg>
                View My Tickets
              </Link>
            </div>

            {/* Back to Events */}
            <div className="mt-8 text-center">
              <Link to="/events" className="text-purple-600 hover:underline">
                Browse More Events
              </Link>
            </div>

            {/* Confetti Animation Effect */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Confetti would be implemented here with particles or a confetti library */}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccessPage;
