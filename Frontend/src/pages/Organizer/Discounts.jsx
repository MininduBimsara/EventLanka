import { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  Copy,
  Clock,
  Check,
  X,
  ChevronDown,
} from "lucide-react";

export default function Discounts() {
  const [discounts, setDiscounts] = useState([
    {
      id: 1,
      code: "SUMMER2025",
      type: "percentage",
      value: 15,
      event: "Summer Music Festival",
      startDate: "2025-06-01",
      endDate: "2025-07-15",
      usageCount: 24,
      maxUses: 100,
      active: true,
      ticketTypes: ["General", "VIP"],
    },
    {
      id: 2,
      code: "EARLYBIRD",
      type: "percentage",
      value: 20,
      event: "Tech Conference 2025",
      startDate: "2025-04-01",
      endDate: "2025-04-30",
      usageCount: 45,
      maxUses: 50,
      active: true,
      ticketTypes: ["All"],
    },
    {
      id: 3,
      code: "FLAT10",
      type: "flat",
      value: 10,
      event: "Charity Gala",
      startDate: "2025-05-01",
      endDate: "2025-05-30",
      usageCount: 12,
      maxUses: 50,
      active: false,
      ticketTypes: ["General"],
    },
  ]);

  const [events, setEvents] = useState([
    "Summer Music Festival",
    "Tech Conference 2025",
    "Charity Gala",
    "Art Exhibition",
    "Food Festival 2025",
  ]);

  const [ticketTypes, setTicketTypes] = useState([
    "General",
    "VIP",
    "Early Access",
    "Student",
    "Senior",
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    event: "",
    startDate: "",
    endDate: "",
    maxUses: "",
    active: true,
    ticketTypes: ["All"],
  });

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

  const handleTicketTypeChange = (e) => {
    const { value, checked } = e.target;
    let updatedTicketTypes;

    if (value === "All" && checked) {
      updatedTicketTypes = ["All"];
    } else {
      // Remove 'All' if any specific ticket type is selected
      const withoutAll = formData.ticketTypes.filter((type) => type !== "All");

      if (checked) {
        updatedTicketTypes = [...withoutAll, value];
      } else {
        updatedTicketTypes = withoutAll.filter((type) => type !== value);
      }

      // If no ticket types are selected, default to 'All'
      if (updatedTicketTypes.length === 0) {
        updatedTicketTypes = ["All"];
      }
    }

    setFormData({
      ...formData,
      ticketTypes: updatedTicketTypes,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDiscount = {
      id: discounts.length + 1,
      ...formData,
      usageCount: 0,
    };
    setDiscounts([...discounts, newDiscount]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      code: "",
      type: "percentage",
      value: "",
      event: "",
      startDate: "",
      endDate: "",
      maxUses: "",
      active: true,
      ticketTypes: ["All"],
    });
    setIsFormOpen(false);
  };

  const toggleDiscountActive = (id) => {
    setDiscounts(
      discounts.map((discount) =>
        discount.id === id
          ? { ...discount, active: !discount.active }
          : discount
      )
    );
  };

  const deleteDiscount = (id) => {
    setDiscounts(discounts.filter((discount) => discount.id !== id));
  };

  const duplicateDiscount = (discount) => {
    const newDiscount = {
      ...discount,
      id: discounts.length + 1,
      code: `${discount.code}_COPY`,
      usageCount: 0,
    };
    setDiscounts([...discounts, newDiscount]);
  };

  const formatValue = (discount) => {
    return discount.type === "percentage"
      ? `${discount.value}%`
      : `$${discount.value}`;
  };

  const getStatusBadge = (discount) => {
    const now = new Date();
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);

    if (!discount.active) {
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
    } else if (discount.usageCount >= discount.maxUses) {
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
                  Event
                </label>
                <select
                  name="event"
                  value={formData.event}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select an event</option>
                  {events.map((event, index) => (
                    <option key={index} value={event}>
                      {event}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Discount Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount ($)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {formData.type === "percentage"
                    ? "Percentage (%)"
                    : "Amount ($)"}
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder={formData.type === "percentage" ? "10" : "5"}
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
                  name="startDate"
                  value={formData.startDate}
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
                  name="endDate"
                  value={formData.endDate}
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
                  name="maxUses"
                  value={formData.maxUses}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="100"
                  min="1"
                  required
                />
              </div>

              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleToggleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>

            <div className="mt-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Apply to Ticket Types
              </label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ticketType-All"
                    value="All"
                    checked={formData.ticketTypes.includes("All")}
                    onChange={handleTicketTypeChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="ticketType-All"
                    className="ml-2 text-sm text-gray-700"
                  >
                    All Tickets
                  </label>
                </div>

                {ticketTypes.map((type, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`ticketType-${type}`}
                      value={type}
                      checked={formData.ticketTypes.includes(type)}
                      onChange={handleTicketTypeChange}
                      disabled={formData.ticketTypes.includes("All")}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label
                      htmlFor={`ticketType-${type}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {type}
                    </label>
                  </div>
                ))}
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
              >
                Create Discount Code
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
                Event
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
            {discounts.map((discount) => (
              <tr
                key={discount.id}
                className={!discount.active ? "bg-gray-50" : ""}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {discount.code}
                  </div>
                  <div className="text-xs text-gray-500">
                    {discount.ticketTypes.join(", ")} tickets
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold leading-5 text-blue-800 bg-blue-100 rounded-full">
                    {formatValue(discount)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {discount.event}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  <div>
                    From: {new Date(discount.startDate).toLocaleDateString()}
                  </div>
                  <div>
                    To: {new Date(discount.endDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {discount.usageCount} / {discount.maxUses}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(discount)}
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleDiscountActive(discount.id)}
                      className={`p-1 rounded ${
                        discount.active
                          ? "text-red-600 hover:bg-red-100"
                          : "text-green-600 hover:bg-green-100"
                      }`}
                      title={discount.active ? "Deactivate" : "Activate"}
                    >
                      {discount.active ? <X size={16} /> : <Check size={16} />}
                    </button>
                    <button
                      onClick={() => duplicateDiscount(discount)}
                      className="p-1 text-blue-600 rounded hover:bg-blue-100"
                      title="Duplicate"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => deleteDiscount(discount.id)}
                      className="p-1 text-red-600 rounded hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
