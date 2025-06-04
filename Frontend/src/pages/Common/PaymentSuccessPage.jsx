import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadReceipt,
  fetchPaymentHistory,
} from "../../Redux/Thunks/paymentThunks";
import NavBar from "../../components/Common/Navbar";
import { motion } from "framer-motion";

const PaymentSuccessPage = () => {
  const { paymentIntentId } = useParams();
  const dispatch = useDispatch();
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const { currentPayment, downloading, paymentHistory } = useSelector(
    (state) => state.payments
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch payment history to get the latest transaction
    dispatch(fetchPaymentHistory());
  }, [dispatch]);

  useEffect(() => {
    // Find the current transaction from payment history
    if (paymentHistory && paymentHistory.length > 0) {
      // Get the most recent transaction or find by payment intent ID
      const latestTransaction = paymentIntentId
        ? paymentHistory.find(
            (payment) => payment.payment_intent_id === paymentIntentId
          )
        : paymentHistory[0]; // Get the most recent one

      if (latestTransaction) {
        setCurrentTransaction({
          id: latestTransaction.transaction_id || latestTransaction._id,
          date: latestTransaction.createdAt || new Date().toISOString(),
          eventName: latestTransaction.event_id?.title || "Unknown Event",
          amount: latestTransaction.amount || 0,
          paymentMethod: latestTransaction.payment_method || "Credit Card",
          status: latestTransaction.payment_status || "Completed",
        });
      }
    }
  }, [paymentHistory, paymentIntentId]);

  const handleDownloadReceipt = () => {
    if (currentTransaction?.id) {
      dispatch(downloadReceipt(currentTransaction.id));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
              {currentTransaction ? (
                <div className="mt-2">
                  <p className="text-gray-600">
                    Transaction ID: {currentTransaction.id}
                  </p>
                  <p className="text-gray-600">
                    Date: {formatDate(currentTransaction.date)}
                  </p>
                  <p className="text-gray-600">
                    Event: {currentTransaction.eventName}
                  </p>
                  <p className="text-gray-600">
                    Amount: LKR {currentTransaction.amount.toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    Payment Method: {currentTransaction.paymentMethod}
                  </p>
                  <p className="text-gray-600">
                    Status: {currentTransaction.status}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-20">
                  <div className="w-8 h-8 border-b-2 border-gray-500 rounded-full animate-spin"></div>
                  <span className="ml-2 text-gray-600">
                    Loading transaction details...
                  </span>
                </div>
              )}
            </div>

            {/* Download Receipt Button */}
            <div className="mt-6">
              <button
                onClick={handleDownloadReceipt}
                disabled={!currentTransaction?.id || downloading}
                className="flex items-center justify-center w-full py-3 font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed"
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
              <button
                onClick={() => navigate("/user/mybookings")}
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
              </button>
            </div>

            {/* View All Transactions */}
            <div className="mt-4">
              <button
                onClick={() => navigate("/user/transactions")}
                className="flex items-center justify-center w-full py-3 font-medium text-purple-600 transition-colors border-2 border-purple-600 rounded-lg hover:bg-purple-600 hover:text-white"
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                View All Transactions
              </button>
            </div>

            {/* Back to Events */}
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate("eventbrowsing")}
                className="text-purple-600 hover:underline"
              >
                Browse More Events
              </button>
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
