import React from "react";

const FilterSidebar = ({
  filters,
  setFilters,
  categories,
  handleCategoryChange,
  locations,
  handleLocationChange,
}) => {
  return (
    <aside
      id="event-browsing-sidebar"
      className="relative overflow-hidden rounded-xl"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3D0C7D] via-[#7A4495] to-[#F0A8AE] opacity-90 animate-gradient-event"></div>

      <div className="relative z-10 p-6">
        <h2 className="mb-4 text-lg font-bold text-white">Filters</h2>

        {/* Date filter */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-gray-200">DATE</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="date"
                className="w-4 h-4 text-indigo-600"
                checked={filters.date === "all"}
                onChange={() => setFilters({ ...filters, date: "all" })}
              />
              <span className="ml-2 text-white">All Events</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="date"
                className="w-4 h-4 text-indigo-600"
                checked={filters.date === "upcoming"}
                onChange={() => setFilters({ ...filters, date: "upcoming" })}
              />
              <span className="ml-2 text-white">Upcoming</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="date"
                className="w-4 h-4 text-indigo-600"
                checked={filters.date === "today"}
                onChange={() => setFilters({ ...filters, date: "today" })}
              />
              <span className="ml-2 text-white">Today</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="date"
                className="w-4 h-4 text-indigo-600"
                checked={filters.date === "weekend"}
                onChange={() => setFilters({ ...filters, date: "weekend" })}
              />
              <span className="ml-2 text-white">This Weekend</span>
            </label>
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-gray-200">CATEGORY</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 rounded"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <span className="ml-2 text-white">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location filter */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-gray-200">LOCATION</h3>
          <div className="space-y-2">
            {locations.map((location) => (
              <label key={location} className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 rounded"
                  checked={filters.locations.includes(location)}
                  onChange={() => handleLocationChange(location)}
                />
                <span className="ml-2 text-white">{location}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price range filter */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-gray-200">PRICE</h3>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="300"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-200">
              <span>$0</span>
              <span>$300+</span>
            </div>
          </div>
        </div>

        {/* Reset filters button */}
        <button
          className="w-full px-4 py-2 text-sm font-medium text-white transition duration-150 rounded-lg bg-white/20 hover:bg-white/30"
          onClick={() =>
            setFilters({ categories: [], locations: [], date: "all" })
          }
        >
          Reset Filters
        </button>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes gradient-event {
          0% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 50% 100%;
          }
          50% {
            background-position: 100% 50%;
          }
          75% {
            background-position: 50% 0%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-event {
          background-size: 300% 300%;
          animation: gradient-event 20s ease infinite;
        }
      `}</style>
    </aside>
  );
};

export default FilterSidebar;
