import React, { useState, useEffect, useRef } from "react";
import { Download, Search, ChevronDown, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../Redux/Thunks/adminThunks"; // Adjust path as needed

const AdminTransactions = () => {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state) => state.admin.finance);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Refs for dropdown click outside detection
  const paymentMethodRef = useRef(null);
  const statusRef = useRef(null);

  // Filter states
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Dropdown states
  const [isPaymentMethodDropdownOpen, setIsPaymentMethodDropdownOpen] =
    useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Handle clicks outside the dropdowns to close them
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        paymentMethodRef.current &&
        !paymentMethodRef.current.contains(event.target)
      ) {
        setIsPaymentMethodDropdownOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch transactions from API when component mounts or filters change
  useEffect(() => {
    const params = {};
    if (dateRange.start) params.startDate = dateRange.start;
    if (dateRange.end) params.endDate = dateRange.end;
    if (paymentMethodFilter) params.payment_method = paymentMethodFilter;
    if (statusFilter) params.status = statusFilter;

    dispatch(fetchTransactions(params));
  }, [
    dispatch,
    dateRange.start,
    dateRange.end,
    paymentMethodFilter,
    statusFilter,
  ]);

  // Apply client-side search filter
  useEffect(() => {
    if (!transactions) return;

    let results = transactions;

    // Apply search term filter locally
    if (searchTerm) {
      results = results.filter((transaction) => {
        // Get the user name from populated field
        const userName = transaction.user_id?.username || "";
        // Get the event title from populated field
        const eventTitle = transaction.event_id?.title || "";

        return (
          (transaction._id || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          eventTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredTransactions(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, transactions]);

  // Extract unique payment methods and statuses for filter dropdowns
  const paymentMethods = transactions
    ? [...new Set(transactions.map((t) => t.payment_method))]
    : [];
  const statuses = transactions
    ? [...new Set(transactions.map((t) => t.status))]
    : [];

  // Handle CSV export
  const exportToCSV = () => {
    const headers = [
      "ID",
      "User",
      "Amount",
      "Event",
      "Payment Method",
      "Date",
      "Status",
    ];
    const data = filteredTransactions.map((t) => [
      t._id,
      t.user_id?.username || "Unknown User",
      `$${t.amount}`,
      t.event_id?.title || "Unknown Event",
      t.payment_method,
      new Date(t.createdAt).toISOString().split("T")[0],
      t.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...data.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setPaymentMethodFilter("");
    setStatusFilter("");
  };

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Transaction Management
        </h1>

        {/* Filters and actions section */}
        <div className="p-4 mb-6 bg-white rounded-lg shadow">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Filters</h2>
            <div className="flex space-x-2">
              <button
                onClick={resetFilters}
                className="flex items-center px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                <X size={16} className="mr-1" />
                Clear
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center px-3 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                <Download size={16} className="mr-1" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Search and filters row */}
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div className="relative lg:col-span-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date Range */}
            <div className="flex items-center space-x-2 lg:col-span-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Payment Method Dropdown */}
            <div className="relative lg:col-span-1" ref={paymentMethodRef}>
              <button
                onClick={() =>
                  setIsPaymentMethodDropdownOpen(!isPaymentMethodDropdownOpen)
                }
                className="flex items-center justify-between w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span>{paymentMethodFilter || "Payment Method"}</span>
                <ChevronDown size={18} className="text-gray-500" />
              </button>
              {isPaymentMethodDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  <ul className="py-1 overflow-y-auto max-h-48">
                    <li
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setPaymentMethodFilter("");
                        setIsPaymentMethodDropdownOpen(false);
                      }}
                    >
                      All Methods
                    </li>
                    {paymentMethods.map((method, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setPaymentMethodFilter(method);
                          setIsPaymentMethodDropdownOpen(false);
                        }}
                      >
                        {method}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="relative lg:col-span-1" ref={statusRef}>
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="flex items-center justify-between w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span>{statusFilter || "Status"}</span>
                <ChevronDown size={18} className="text-gray-500" />
              </button>
              {isStatusDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  <ul className="py-1 overflow-y-auto max-h-48">
                    <li
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setStatusFilter("");
                        setIsStatusDropdownOpen(false);
                      }}
                    >
                      All Statuses
                    </li>
                    {statuses.map((status, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setStatusFilter(status);
                          setIsStatusDropdownOpen(false);
                        }}
                      >
                        {status}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block w-8 h-8 align-middle border-4 border-blue-600 border-solid rounded-full animate-spin border-r-transparent"></div>
                <p className="mt-2 text-gray-700">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">
                  No transactions found matching your criteria.
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Event
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Payment Method
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTransactions.map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {transaction._id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {transaction.user_id?.username || "Unknown User"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        ${transaction.amount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {transaction.event_id?.title || "Unknown Event"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {transaction.payment_method}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.payment_status === "completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.payment_status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : transaction.payment_status === "failed"
                              ? "bg-red-100 text-red-800"
                              : transaction.payment_status === "refunded"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {transaction.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {filteredTransactions.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
              <div className="flex justify-between flex-1 sm:hidden">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {indexOfFirstTransaction + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        indexOfLastTransaction,
                        filteredTransactions.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredTransactions.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1
                          ? "text-gray-300"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      &larr;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === number
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {number}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages
                          ? "text-gray-300"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      &rarr;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;
