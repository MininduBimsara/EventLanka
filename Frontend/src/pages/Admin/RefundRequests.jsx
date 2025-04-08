import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, RefreshCw, Info } from "lucide-react";

const RefundRequests = () => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'

  // Fetch refund requests from your API
  useEffect(() => {
    const fetchRefundRequests = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch("/api/admin/refund-requests");

        if (!response.ok) {
          throw new Error("Failed to fetch refund requests");
        }

        const data = await response.json();
        setRefundRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRefundRequests();
  }, []);

  const handleAction = (requestId, action) => {
    setActiveRequestId(requestId);
    setActionType(action);
    setShowNoteModal(true);
  };

  const processRefund = async (approve) => {
    if (!activeRequestId) return;

    try {
      setLoading(true);

      const request = refundRequests.find((req) => req.id === activeRequestId);
      if (!request) return;

      const endpoint = approve
        ? "/api/admin/approve-refund"
        : "/api/admin/reject-refund";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: activeRequestId,
          note: noteInput,
          stripeRefundId: request.stripePaymentId, // Pass the payment ID for processing with Stripe
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${approve ? "approve" : "reject"} refund`);
      }

      // Update local state to reflect the change
      setRefundRequests(
        refundRequests.map((req) =>
          req.id === activeRequestId
            ? {
                ...req,
                status: approve ? "Approved" : "Rejected",
                adminNote: noteInput,
              }
            : req
        )
      );

      // Reset modal state
      setShowNoteModal(false);
      setNoteInput("");
      setActiveRequestId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    processRefund(actionType === "approve");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && refundRequests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2">Loading refund requests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-800 rounded-lg bg-red-50">
        <p className="font-semibold">Error loading refund requests</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Refund Requests</h1>
        <button
          onClick={() => setRefundRequests([])}
          className="flex items-center px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {refundRequests.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <Info className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No refund requests to display</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Event Details
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Reason
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {refundRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 font-semibold text-gray-700 bg-gray-200 rounded-full">
                        {request.userName.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {request.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {request.eventName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {request.ticketType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(request.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs text-sm text-gray-500 truncate">
                      {request.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    {request.status === "Pending" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAction(request.id, "approve")}
                          className="flex items-center text-green-600 hover:text-green-900"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(request.id, "reject")}
                          className="flex items-center text-red-600 hover:text-red-900"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                    {request.status !== "Pending" && (
                      <div className="text-xs text-gray-500">
                        {request.adminNote && (
                          <span className="italic">"{request.adminNote}"</span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for adding notes when approving/rejecting */}
      {showNoteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  {actionType === "approve"
                    ? "Approve Refund"
                    : "Reject Refund"}
                </h3>
                <p className="mb-4 text-sm text-gray-500">
                  {actionType === "approve"
                    ? "This will process the refund through Stripe and notify the customer."
                    : "Please provide a reason for rejecting this refund request."}
                </p>
                <textarea
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                  rows="3"
                  placeholder="Add a note (optional)"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                ></textarea>
              </div>
              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    actionType === "approve"
                      ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  }`}
                  onClick={handleSubmit}
                >
                  {actionType === "approve" ? "Approve" : "Reject"}
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowNoteModal(false);
                    setNoteInput("");
                    setActiveRequestId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundRequests;
