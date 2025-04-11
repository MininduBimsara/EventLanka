import React, { useState } from "react";
import {
  FaFileDownload,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

const MyTransactions = () => {
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
    <div className="container px-4 pt-24 pb-16 mx-auto">
      <div className="pb-8 mb-8 border-b border-gray-700">
        <h1 className="mb-2 text-3xl font-bold">Transaction History</h1>
        <p className="text-gray-400">
          View and download receipts for your purchases
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 bg-gray-800 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
        </div>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="p-8 text-center bg-gray-800 rounded-lg">
          <h3 className="mb-2 text-xl">No transactions found</h3>
          <p className="text-gray-400">
            {searchTerm
              ? "No transactions match your search criteria."
              : "You haven't made any transactions yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800 rounded-lg">
            <thead>
              <tr className="text-left border-b border-gray-700">
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
                        <FaSort className="text-gray-500" />
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
                        <FaSort className="text-gray-500" />
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
                        <FaSort className="text-gray-500" />
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
                        <FaSort className="text-gray-500" />
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
                        <FaSort className="text-gray-500" />
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
                        <FaSort className="text-gray-500" />
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
                  className="transition-colors border-b border-gray-700 hover:bg-gray-700"
                >
                  <td className="p-4">{transaction.id}</td>
                  <td className="p-4">
                    {new Date(transaction.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="p-4">{transaction.eventName}</td>
                  <td className="p-4">
                    LKR {transaction.amount.toLocaleString()}
                  </td>
                  <td className="p-4">{transaction.paymentMethod}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        transaction.status === "Completed"
                          ? "bg-green-900 text-green-300"
                          : transaction.status === "Refunded"
                          ? "bg-yellow-900 text-yellow-300"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDownloadReceipt(transaction.id)}
                      className="flex items-center px-3 py-1 ml-auto text-sm text-white transition rounded-md bg-amber-500 hover:bg-amber-600"
                    >
                      <FaFileDownload className="mr-1" /> Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyTransactions;
