import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PlusCircle,
  Trash2,
  Copy,
  Clock,
  Check,
  X,
  ChevronDown,
  Loader,
} from "lucide-react";
import {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getEventDiscounts,
} from "../../Redux/Slicers/OrganizerSlice"; // Adjust path as needed
import { fetchEvents } from "../../Redux/Slicers/EventSlice"; // Import the action to fetch all events


export default function Discounts() {
  const dispatch = useDispatch();

  // Access Organizer slice state
  const { discounts, isLoading, error } = useSelector(
    (state) => state.organizer
  );

const events = useSelector((state) => state.events?.events || []);
const loadingEvents = useSelector((state) => state.events?.loading);

  const [selectedEvent, setSelectedEvent] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loadingState, setLoadingState] = useState(true); // Add this to track overall loading

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    description: "",
    applicable_events: [],
    start_date: "",
    end_date: "",
    usage_limit: "",
    minimum_purchase_amount: 0,
    is_active: true,
  });

  // Fetch all events when component mounts
  useEffect(() => {
    setLoadingState(true);
    dispatch(fetchEvents())
      .unwrap()
      .then(() => {
        // Set loading state to false when events are loaded
        if (!selectedEvent) {
          setLoadingState(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoadingState(false);
      });
  }, [dispatch]);

  // Initialize with first event if available
  useEffect(() => {
    if (events?.length > 0 && !selectedEvent) {
      setSelectedEvent(events[0]._id);
    }
  }, [events, selectedEvent]);

  // Fetch discounts for the selected event
  useEffect(() => {
    if (selectedEvent) {
      setLoadingState(true); // Set loading back to true when fetching discounts
      dispatch(getEventDiscounts(selectedEvent))
        .unwrap()
        .then(() => {
          setLoadingState(false); // Set loading to false when discounts are loaded
        })
        .catch((error) => {
          console.error("Error fetching discounts:", error);
          setLoadingState(false);
        });
    }
  }, [selectedEvent, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleEventSelectionChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      applicable_events: [value],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate if we have an event selected
    if (!formData.applicable_events?.length) {
      alert("Please select an event for this discount code");
      return;
    }

    // Prepare data for API
    const discountData = {
      code: formData.code,
      description: formData.description || "",
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      applicable_events: formData.applicable_events,
      start_date: formData.start_date,
      end_date: formData.end_date,
      usage_limit: parseInt(formData.usage_limit) || 0,
      minimum_purchase_amount: parseInt(formData.minimum_purchase_amount) || 0,
      is_active: formData.is_active,
    };

    dispatch(createDiscount(discountData))
      .unwrap()
      .then(() => {
        resetForm();
        dispatch(getEventDiscounts(selectedEvent)); // Refresh discounts list
      })
      .catch((error) => {
        console.error("Error creating discount:", error);
        // You might want to show an error message to the user
      });
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: "",
      description: "",
      applicable_events: [],
      start_date: "",
      end_date: "",
      usage_limit: "",
      minimum_purchase_amount: 0,
      is_active: true,
    });
    setIsFormOpen(false);
  };

  const toggleDiscountActive = (discountId, currentActive) => {
    dispatch(
      updateDiscount({
        discountId,
        discountData: { is_active: !currentActive },
      })
    )
      .unwrap()
      .then(() => {
        dispatch(getEventDiscounts(selectedEvent)); // Refresh the list
      })
      .catch((error) => {
        console.error("Error toggling discount status:", error);
      });
  };

  const handleDeleteDiscount = (discountId) => {
    if (window.confirm("Are you sure you want to delete this discount code?")) {
      dispatch(deleteDiscount(discountId))
        .unwrap()
        .then(() => {
          dispatch(getEventDiscounts(selectedEvent)); // Refresh the list
        })
        .catch((error) => {
          console.error("Error deleting discount:", error);
        });
    }
  };

  const duplicateDiscount = (discount) => {
    // Create a copy with a new code
    const newDiscount = {
      ...discount,
      code: `${discount.code}_COPY`,
      // We don't include the id here as the backend will generate a new one
    };

    delete newDiscount._id; // Remove the ID so the backend creates a new record

    dispatch(createDiscount(newDiscount))
      .unwrap()
      .then(() => {
        dispatch(getEventDiscounts(selectedEvent)); // Refresh the list
      })
      .catch((error) => {
        console.error("Error duplicating discount:", error);
      });
  };

  const formatValue = (discount) => {
    return discount.discount_type === "percentage"
      ? `${discount.discount_value}%`
      : `$${discount.discount_value}`;
  };

  const getStatusBadge = (discount) => {
    const now = new Date();
    const startDate = new Date(discount.start_date);
    const endDate = new Date(discount.end_date);

    if (!discount.is_active) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-gray-200 rounded-full">
          <X size={12} className="mr-1" /> Inactive
        </span>
      );
    } else if (now < startDate) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
          <Clock size={12} className="mr-1" /> Upcoming
        </span>
      );
    } else if (now > endDate) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
          <X size={12} className="mr-1" /> Expired
        </span>
      );
    } else if (discount.usage_count >= discount.usage_limit) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full">
          <X size={12} className="mr-1" /> Depleted
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
          <Check size={12} className="mr-1" /> Active
        </span>
      );
    }
  };

  // Render loading state for initial load
  if (loadingState) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl p-6 mx-auto bg-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Discount Codes</h1>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center px-4 py-2 text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <PlusCircle size={16} className="mr-2" />
          {isFormOpen ? "Cancel" : "New Discount Code"}
        </button>
      </div>

      {/* Event Selection Dropdown for viewing discounts */}
      {events?.length > 0 ? (
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            View Discounts for Event
          </label>
          <div className="relative">
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full p-2 pr-8 text-gray-700 border border-gray-300 rounded-md appearance-none"
            >
              {events.map((event) => (
                <option
                  key={event._id}
                  value={event._id}
                  className="text-gray-700"
                >
                  {event.title || event.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 mb-6 text-yellow-700 bg-yellow-100 border border-yellow-200 rounded-md">
          No events found. Please create an event first before adding discount
          codes.
        </div>
      )}

      {/* Error Message Display */}
      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {isFormOpen && (
        <div className="p-6 mb-8 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="mb-4 text-lg font-semibold">
            Create New Discount Code
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Code Name
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g. SUMMER2025"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Short description of this discount"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Discount Type
                </label>
                <select
                  name="discount_type"
                  value={formData.discount_type}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount ($)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {formData.discount_type === "percentage"
                    ? "Percentage (%)"
                    : "Amount ($)"}
                </label>
                <input
                  type="number"
                  name="discount_value"
                  value={formData.discount_value}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder={
                    formData.discount_type === "percentage" ? "10" : "5"
                  }
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Valid From
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Valid Until
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Max Uses
                </label>
                <input
                  type="number"
                  name="usage_limit"
                  value={formData.usage_limit}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="100"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Minimum Purchase Amount
                </label>
                <input
                  type="number"
                  name="minimum_purchase_amount"
                  value={formData.minimum_purchase_amount}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Apply to Event
                </label>
                <div className="relative">
                  <select
                    value={formData.applicable_events[0] || ""}
                    onChange={handleEventSelectionChange}
                    className="w-full p-2 pr-8 border border-gray-300 rounded-md appearance-none"
                    required
                  >
                    <option value="">Select an event</option>
                    {events?.map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.title || event.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleToggleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="is_active"
                  className="ml-2 text-sm text-gray-700"
                >
                  Active
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 mr-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader size={16} className="mr-2 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create Discount Code"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Code
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Discount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Validity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Usage
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {selectedEvent && discounts?.length > 0 ? (
              discounts.map((discount) => (
                <tr
                  key={discount._id}
                  className={!discount.is_active ? "bg-gray-50" : ""}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {discount.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold leading-5 text-blue-800 bg-blue-100 rounded-full">
                      {formatValue(discount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {discount.description || "No description"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <div>
                      From: {new Date(discount.start_date).toLocaleDateString()}
                    </div>
                    <div>
                      To: {new Date(discount.end_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {discount.usage_count} / {discount.usage_limit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(discount)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          toggleDiscountActive(discount._id, discount.is_active)
                        }
                        className={`p-1 rounded ${
                          discount.is_active
                            ? "text-red-600 hover:bg-red-100"
                            : "text-green-600 hover:bg-green-100"
                        }`}
                        title={discount.is_active ? "Deactivate" : "Activate"}
                      >
                        {discount.is_active ? (
                          <X size={16} />
                        ) : (
                          <Check size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => duplicateDiscount(discount)}
                        className="p-1 text-blue-600 rounded hover:bg-blue-100"
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteDiscount(discount._id)}
                        className="p-1 text-red-600 rounded hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  {selectedEvent
                    ? "No discount codes found for this event. Create one to get started."
                    : "Please select an event to view discount codes."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
