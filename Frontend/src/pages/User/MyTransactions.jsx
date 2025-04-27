import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaFileDownload,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaMoon,
  FaSun,
  FaFilter,
  FaSpinner,
} from "react-icons/fa";
import { useTheme } from "../../Context/ThemeContext";
import UserNavbar from "../../components/User/UserNavbar";
import {
  fetchPaymentHistory,
  downloadReceipt,
} from "../../Redux/Slicers/PaymentSlice";

const MyTransactions = () => {
  // Use theme context
  const { darkMode, toggleTheme } = useTheme();

  // Redux state and dispatch
  const dispatch = useDispatch();
  const { paymentHistory, loading, error, downloading } = useSelector(
    (state) => state.payments
  );

  // Filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch payment history on component mount
  useEffect(() => {
    dispatch(fetchPaymentHistory());
  }, [dispatch]);

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Format the backend data to match the frontend structure
  const formatTransactions = () => {
    if (!paymentHistory || paymentHistory.length === 0) return [];

    return paymentHistory.map((payment) => ({
      id: payment.transaction_id || payment._id,
      date: payment.createdAt || new Date().toISOString(),
      eventName: payment.event_id?.title || "Unknown Event",
      amount: payment.amount || 0,
      paymentMethod: payment.payment_method || "Unknown",
      status: payment.status || "Pending",
    }));
  };

  // Apply sorting and filtering to the transactions
  const sortedTransactions = formatTransactions()
    .filter((transaction) => {
      // Apply status filter
      if (
        statusFilter !== "all" &&
        transaction.status.toLowerCase() !== statusFilter.toLowerCase()
      ) {
        return false;
      }

      // Apply search filter
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        transaction.eventName.toLowerCase().includes(searchLower) ||
        transaction.id.toLowerCase().includes(searchLower) ||
        transaction.paymentMethod.toLowerCase().includes(searchLower) ||
        transaction.status.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  // Function to download receipt
  const handleDownloadReceipt = (transactionId) => {
    dispatch(downloadReceipt(transactionId));
  };

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <UserNavbar />
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
        } transition-colors duration-200`}
      >
        <div className="container px-4 pt-16 pb-16 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Transaction History</h1>
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                View and download receipts for your purchases
              </p>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full ${
                darkMode
                  ? "bg-gray-800 text-yellow-400"
                  : "bg-white text-gray-800"
              } shadow-md hover:shadow-lg transition-all`}
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </div>

          <div className="flex flex-col gap-4 mb-6 md:flex-row">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              />
              <FaSearch
                className={`absolute transform -translate-y-1/2 left-3 top-1/2 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`px-4 py-3 rounded-lg flex items-center gap-2 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                }`}
              >
                <FaFilter />
                <span>Filter</span>
              </button>

              {filterOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg p-3 z-10 ${
                    darkMode ? "bg-gray-800" : "bg-white border border-gray-200"
                  }`}
                >
                  <h4 className="mb-2 font-medium">Status</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        checked={statusFilter === "all"}
                        onChange={() => setStatusFilter("all")}
                      />
                      <span>All</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        checked={statusFilter === "completed"}
                        onChange={() => setStatusFilter("completed")}
                      />
                      <span>Completed</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        checked={statusFilter === "refunded"}
                        onChange={() => setStatusFilter("refunded")}
                      />
                      <span>Refunded</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="w-8 h-8 mr-2 animate-spin text-amber-500" />
              <span className="text-lg font-medium">
                Loading transactions...
              </span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div
              className={`p-6 rounded-lg shadow-md ${
                darkMode
                  ? "bg-red-900 text-white"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <h3 className="mb-2 text-lg font-medium">
                {error.includes("ERR_BLOCKED_BY_CLIENT")
                  ? "Browser Security Notice"
                  : "Error Loading Transactions"}
              </h3>
              <p>
                {error.includes("ERR_BLOCKED_BY_CLIENT")
                  ? "Your browser security or ad blocker flagged the download request. If the PDF did not download automatically, please try again or temporarily disable any ad blockers."
                  : error}
              </p>
              <button
                className="px-4 py-2 mt-3 text-white rounded bg-amber-500 hover:bg-amber-600"
                onClick={() => dispatch(fetchPaymentHistory())}
              >
                Try Again
              </button>
            </div>
          )}

          {/* No results */}
          {!loading && !error && sortedTransactions.length === 0 && (
            <div
              className={`p-8 text-center rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white shadow-md"
              }`}
            >
              <h3 className="mb-2 text-xl">No transactions found</h3>
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                {searchTerm || statusFilter !== "all"
                  ? "No transactions match your search criteria."
                  : "You haven't made any transactions yet."}
              </p>
            </div>
          )}

          {/* Transactions table */}
          {!loading && !error && sortedTransactions.length > 0 && (
            <div
              className={`rounded-lg overflow-hidden shadow-md ${
                darkMode ? "" : "border border-gray-200"
              }`}
            >
              <div className="overflow-x-auto">
                <table
                  className={`w-full ${darkMode ? "bg-gray-800" : "bg-white"}`}
                >
                  <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                    <tr
                      className={`text-left ${
                        darkMode
                          ? "border-b border-gray-700"
                          : "border-b border-gray-200"
                      }`}
                    >
                      <th className="p-4">
                        <button
                          onClick={() => handleSort("id")}
                          className="flex items-center font-medium"
                        >
                          Transaction ID
                          <span className="ml-1">
                            {sortConfig.key === "id" ? (
                              sortConfig.direction === "asc" ? (
                                <FaSortUp />
                              ) : (
                                <FaSortDown />
                              )
                            ) : (
                              <FaSort
                                className={
                                  darkMode ? "text-gray-500" : "text-gray-400"
                                }
                              />
                            )}
                          </span>
                        </button>
                      </th>
                      <th className="p-4">
                        <button
                          onClick={() => handleSort("date")}
                          className="flex items-center font-medium"
                        >
                          Date
                          <span className="ml-1">
                            {sortConfig.key === "date" ? (
                              sortConfig.direction === "asc" ? (
                                <FaSortUp />
                              ) : (
                                <FaSortDown />
                              )
                            ) : (
                              <FaSort
                                className={
                                  darkMode ? "text-gray-500" : "text-gray-400"
                                }
                              />
                            )}
                          </span>
                        </button>
                      </th>
                      <th className="p-4">
                        <button
                          onClick={() => handleSort("eventName")}
                          className="flex items-center font-medium"
                        >
                          Event
                          <span className="ml-1">
                            {sortConfig.key === "eventName" ? (
                              sortConfig.direction === "asc" ? (
                                <FaSortUp />
                              ) : (
                                <FaSortDown />
                              )
                            ) : (
                              <FaSort
                                className={
                                  darkMode ? "text-gray-500" : "text-gray-400"
                                }
                              />
                            )}
                          </span>
                        </button>
                      </th>
                      <th className="p-4">
                        <button
                          onClick={() => handleSort("amount")}
                          className="flex items-center font-medium"
                        >
                          Amount
                          <span className="ml-1">
                            {sortConfig.key === "amount" ? (
                              sortConfig.direction === "asc" ? (
                                <FaSortUp />
                              ) : (
                                <FaSortDown />
                              )
                            ) : (
                              <FaSort
                                className={
                                  darkMode ? "text-gray-500" : "text-gray-400"
                                }
                              />
                            )}
                          </span>
                        </button>
                      </th>
                      <th className="p-4">
                        <button
                          onClick={() => handleSort("paymentMethod")}
                          className="flex items-center font-medium"
                        >
                          Payment Method
                          <span className="ml-1">
                            {sortConfig.key === "paymentMethod" ? (
                              sortConfig.direction === "asc" ? (
                                <FaSortUp />
                              ) : (
                                <FaSortDown />
                              )
                            ) : (
                              <FaSort
                                className={
                                  darkMode ? "text-gray-500" : "text-gray-400"
                                }
                              />
                            )}
                          </span>
                        </button>
                      </th>
                      <th className="p-4">
                        <button
                          onClick={() => handleSort("status")}
                          className="flex items-center font-medium"
                        >
                          Status
                          <span className="ml-1">
                            {sortConfig.key === "status" ? (
                              sortConfig.direction === "asc" ? (
                                <FaSortUp />
                              ) : (
                                <FaSortDown />
                              )
                            ) : (
                              <FaSort
                                className={
                                  darkMode ? "text-gray-500" : "text-gray-400"
                                }
                              />
                            )}
                          </span>
                        </button>
                      </th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className={`transition-colors hover:bg-opacity-50 ${
                          darkMode
                            ? "border-b border-gray-700 hover:bg-gray-700"
                            : "border-b border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <td className="p-4 font-medium">{transaction.id}</td>
                        <td className="p-4">{formatDate(transaction.date)}</td>
                        <td className="p-4">{transaction.eventName}</td>
                        <td className="p-4 font-medium">
                          LKR {transaction.amount.toLocaleString()}
                        </td>
                        <td className="p-4">
                          {transaction.paymentMethod.charAt(0).toUpperCase() +
                            transaction.paymentMethod
                              .slice(1)
                              .replace(/([A-Z])/g, " $1")}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              transaction.status.toLowerCase() === "completed"
                                ? darkMode
                                  ? "bg-green-900 text-green-300"
                                  : "bg-green-100 text-green-800"
                                : transaction.status.toLowerCase() ===
                                  "refunded"
                                ? darkMode
                                  ? "bg-yellow-900 text-yellow-300"
                                  : "bg-yellow-100 text-yellow-800"
                                : darkMode
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() =>
                              handleDownloadReceipt(transaction.id)
                            }
                            disabled={downloading}
                            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium text-white rounded-md transition-colors shadow-sm ${
                              downloading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-amber-500 hover:bg-amber-600"
                            }`}
                          >
                            {downloading ? (
                              <>
                                <FaSpinner className="w-4 h-4 mr-1.5 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <FaFileDownload className="mr-1.5" /> Receipt
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyTransactions;
