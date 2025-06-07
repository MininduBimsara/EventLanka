import { useState, useEffect, useMemo, useCallback } from "react";
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
} from "../../Redux/Thunks/organizerThunk";
import { fetchEvents } from "../../Redux/Thunks/eventThunk";
import { useToast } from "../../components/Common/Notification/ToastContext"; // Updated import

export default function Discounts() {
  const dispatch = useDispatch();
  const toast = useToast();

  const { discounts, isLoading, error } = useSelector(
    (state) => state.organizer
  );

  const events = useSelector((state) => state.events?.events || []);
  const loadingEvents = useSelector((state) => state.events?.loading);

  const [selectedEvent, setSelectedEvent] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [eventsInitialized, setEventsInitialized] = useState(false);

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

  // Memoize the first event ID to prevent unnecessary re-renders
  const firstEventId = useMemo(() => {
    return events?.length > 0 ? events[0]._id : null;
  }, [events]);

  // Fetch events only once when component mounts
  useEffect(() => {
    let isMounted = true;

    const fetchEventsData = async () => {
      try {
        setLoadingState(true);
        await dispatch(fetchEvents()).unwrap();
        if (isMounted) {
          setEventsInitialized(true);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        if (isMounted) {
          toast.error("Failed to load events");
          setLoadingState(false);
        }
      }
    };

    fetchEventsData();

    return () => {
      isMounted = false;
    };
  }, [dispatch, toast]);

  // Set initial selected event only after events are loaded and initialized
  useEffect(() => {
    if (eventsInitialized && firstEventId && !selectedEvent) {
      setSelectedEvent(firstEventId);
    }
  }, [eventsInitialized, firstEventId, selectedEvent]);

  // Fetch discounts when selectedEvent changes
  useEffect(() => {
    let isMounted = true;

    const fetchDiscounts = async () => {
      if (!selectedEvent) return;

      try {
        setLoadingState(true);
        await dispatch(getEventDiscounts(selectedEvent)).unwrap();
        if (isMounted) {
          setLoadingState(false);
        }
      } catch (error) {
        console.error("Error fetching discounts:", error);
        if (isMounted) {
          toast.error("Failed to load discounts");
          setLoadingState(false);
        }
      }
    };

    fetchDiscounts();

    return () => {
      isMounted = false;
    };
  }, [selectedEvent, dispatch, toast]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleToggleChange = useCallback((e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  }, []);

  const handleEventSelectionChange = useCallback((e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      applicable_events: [value],
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!formData.applicable_events?.length) {
        toast.warning("Please select an event for this discount code");
        return;
      }

      const discountData = {
        code: formData.code,
        description: formData.description || "",
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        applicable_events: formData.applicable_events,
        start_date: formData.start_date,
        end_date: formData.end_date,
        usage_limit: parseInt(formData.usage_limit) || 0,
        minimum_purchase_amount:
          parseInt(formData.minimum_purchase_amount) || 0,
        is_active: formData.is_active,
      };

      try {
        await dispatch(createDiscount(discountData)).unwrap();
        toast.success("Discount code created successfully!");
        resetForm();
        // Refresh the discounts list
        await dispatch(getEventDiscounts(selectedEvent)).unwrap();
      } catch (error) {
        console.error("Error creating discount:", error);
        toast.error("Failed to create discount code");
      }
    },
    [formData, dispatch, toast, selectedEvent]
  );

  const resetForm = useCallback(() => {
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
  }, []);

  const toggleDiscountActive = useCallback(
    async (discountId, currentActive) => {
      try {
        await dispatch(
          updateDiscount({
            discountId,
            discountData: { is_active: !currentActive },
          })
        ).unwrap();

        toast.success(
          `Discount ${
            !currentActive ? "activated" : "deactivated"
          } successfully!`
        );

        // Refresh the list
        await dispatch(getEventDiscounts(selectedEvent)).unwrap();
      } catch (error) {
        console.error("Error toggling discount status:", error);
        toast.error("Failed to update discount status");
      }
    },
    [dispatch, toast, selectedEvent]
  );

  const handleDeleteDiscount = useCallback(
    async (discountId) => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this discount code?"
      );

      if (!confirmed) return;

      try {
        await dispatch(deleteDiscount(discountId)).unwrap();
        toast.success("Discount code deleted successfully!");
        // Refresh the list
        await dispatch(getEventDiscounts(selectedEvent)).unwrap();
      } catch (error) {
        console.error("Error deleting discount:", error);
        toast.error("Failed to delete discount code");
      }
    },
    [dispatch, toast, selectedEvent]
  );

  const duplicateDiscount = useCallback(
    async (discount) => {
      const newDiscount = {
        ...discount,
        code: `${discount.code}_COPY`,
      };

      delete newDiscount._id;

      try {
        await dispatch(createDiscount(newDiscount)).unwrap();
        toast.success("Discount code duplicated successfully!");
        // Refresh the list
        await dispatch(getEventDiscounts(selectedEvent)).unwrap();
      } catch (error) {
        console.error("Error duplicating discount:", error);
        toast.error("Failed to duplicate discount code");
      }
    },
    [dispatch, toast, selectedEvent]
  );

  const formatValue = useCallback((discount) => {
    return discount.discount_type === "percentage"
      ? `${discount.discount_value}%`
      : `$${discount.discount_value}`;
  }, []);

  const getStatusBadge = useCallback((discount) => {
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
  }, []);

  // Handle event selection change with useCallback
  const handleEventDropdownChange = useCallback((e) => {
    setSelectedEvent(e.target.value);
  }, []);

  // Render loading state for initial load
  if (loadingState && !eventsInitialized) {
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
              onChange={handleEventDropdownChange}
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

      {loadingState && selectedEvent ? (
        <div className="flex items-center justify-center h-32">
          <Loader className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : (
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
                        From:{" "}
                        {new Date(discount.start_date).toLocaleDateString()}
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
                            toggleDiscountActive(
                              discount._id,
                              discount.is_active
                            )
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
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {selectedEvent
                      ? "No discount codes found for this event. Create one to get started."
                      : "Please select an event to view discount codes."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
