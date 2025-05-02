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
    <aside className="overflow-hidden bg-white border border-blue-100 rounded-lg shadow-lg">
      <div className="p-6">
        <h2 className="mb-4 text-xl font-bold text-blue-900">Filters</h2>
        <div className="w-16 h-1 mb-6 bg-pink-400 rounded-full"></div>

        {/* Date filter */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-blue-900">DATE</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="date"
                className="w-4 h-4 text-pink-400"
                checked={filters.date === "all"}
                onChange={() => setFilters({ ...filters, date: "all" })}
              />
              <span className="ml-2 text-blue-800">All Events</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="date"
                className="w-4 h-4 text-pink-400"
                checked={filters.date === "upcoming"}
                onChange={() => setFilters({ ...filters, date: "upcoming" })}
              />
              <span className="ml-2 text-blue-800">Upcoming</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="date"
                className="w-4 h-4 text-pink-400"
                checked={filters.date === "today"}
                onChange={() => setFilters({ ...filters, date: "today" })}
              />
              <span className="ml-2 text-blue-800">Today</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="date"
                className="w-4 h-4 text-pink-400"
                checked={filters.date === "weekend"}
                onChange={() => setFilters({ ...filters, date: "weekend" })}
              />
              <span className="ml-2 text-blue-800">This Weekend</span>
            </label>
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-blue-900">CATEGORY</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-pink-400 rounded"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <span className="ml-2 text-blue-800">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location filter */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-blue-900">LOCATION</h3>
          <div className="space-y-2">
            {locations.map((location) => (
              <label key={location} className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-pink-400 rounded"
                  checked={filters.locations.includes(location)}
                  onChange={() => handleLocationChange(location)}
                />
                <span className="ml-2 text-blue-800">{location}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price range filter */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-blue-900">PRICE</h3>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="300"
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none"
            />
            <div className="flex justify-between mt-2 text-xs text-blue-800">
              <span>$0</span>
              <span>$300+</span>
            </div>
          </div>
        </div>

        {/* Reset filters button */}
        <button
          className="w-full px-6 py-3 font-bold text-white transition-all duration-300 transform bg-blue-800 rounded-full shadow-lg hover:bg-pink-400 hover:scale-105"
          onClick={() =>
            setFilters({ categories: [], locations: [], date: "all" })
          }
        >
          Reset Filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
