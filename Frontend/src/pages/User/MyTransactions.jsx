import React, { useState } from "react";
import {
  FaFileDownload,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaMoon,
  FaSun,
  FaFilter,
} from "react-icons/fa";

const MyTransactions = () => {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // Filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data for transactions
  const [transactions, setTransactions] = useState([
    {
      id: "TRX-1234",
      date: "2025-04-09",
      eventName: "Jazz Festival 2025",
      amount: 5000,
      paymentMethod: "Credit Card",
      status: "Completed",
    },
    {
      id: "TRX-1235",
      date: "2025-04-02",
      eventName: "Tech Conference",
      amount: 2500,
      paymentMethod: "PayPal",
      status: "Completed",
    },
    {
      id: "TRX-1236",
      date: "2025-03-28",
      eventName: "Food Festival",
      amount: 3500,
      paymentMethod: "Credit Card",
      status: "Completed",
    },
    {
      id: "TRX-1237",
      date: "2025-03-15",
      eventName: "DJ Night",
      amount: 1500,
      paymentMethod: "Credit Card",
      status: "Refunded",
    },
    {
      id: "TRX-1238",
      date: "2025-03-10",
      eventName: "Beach Party",
      amount: 2000,
      paymentMethod: "PayPal",
      status: "Refunded",
    },
  ]);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting and filtering
  const sortedTransactions = [...transactions]
    .filter((transaction) => {
      // Apply status filter
      if (statusFilter !== "all" && transaction.status !== statusFilter) {
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
  const handleDownloadReceipt = (id) => {
    // In a real application, this would generate and download a PDF receipt
    alert(`Downloading receipt for transaction ${id}`);
  };

  return (
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
            onClick={toggleDarkMode}
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
                      checked={statusFilter === "Completed"}
                      onChange={() => setStatusFilter("Completed")}
                    />
                    <span>Completed</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      checked={statusFilter === "Refunded"}
                      onChange={() => setStatusFilter("Refunded")}
                    />
                    <span>Refunded</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {sortedTransactions.length === 0 ? (
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
        ) : (
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
                      <td className="p-4">
                        {new Date(transaction.date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="p-4">{transaction.eventName}</td>
                      <td className="p-4 font-medium">
                        LKR {transaction.amount.toLocaleString()}
                      </td>
                      <td className="p-4">{transaction.paymentMethod}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            transaction.status === "Completed"
                              ? darkMode
                                ? "bg-green-900 text-green-300"
                                : "bg-green-100 text-green-800"
                              : transaction.status === "Refunded"
                              ? darkMode
                                ? "bg-yellow-900 text-yellow-300"
                                : "bg-yellow-100 text-yellow-800"
                              : darkMode
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDownloadReceipt(transaction.id)}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white rounded-md bg-amber-500 hover:bg-amber-600 transition-colors shadow-sm"
                        >
                          <FaFileDownload className="mr-1.5" /> Receipt
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
  );
};

export default MyTransactions;
