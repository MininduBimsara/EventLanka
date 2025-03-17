import React from "react";

const FilterSidebar = ({ filters,setFilters,categories,handleCategoryChange,locations,handleLocationChange}) => {
  return (
              
          <aside className="p-6 shadow-sm bg-gradient-to-b from-gray-300 via-gray-500 to-gray-700 rounded-xl">
            <h2 className="mb-4 text-lg font-bold text-gray-800">Filters</h2>

            {/* Date filter */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-500">DATE</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="date"
                    className="w-4 h-4 text-indigo-600"
                    checked={filters.date === "all"}
                    onChange={() => setFilters({ ...filters, date: "all" })}
                  />
                  <span className="ml-2 text-gray-700">All Events</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="date"
                    className="w-4 h-4 text-indigo-600"
                    checked={filters.date === "upcoming"}
                    onChange={() =>
                      setFilters({ ...filters, date: "upcoming" })
                    }
                  />
                  <span className="ml-2 text-gray-700">Upcoming</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="date"
                    className="w-4 h-4 text-indigo-600"
                    checked={filters.date === "today"}
                    onChange={() => setFilters({ ...filters, date: "today" })}
                  />
                  <span className="ml-2 text-gray-700">Today</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="date"
                    className="w-4 h-4 text-indigo-600"
                    checked={filters.date === "weekend"}
                    onChange={() => setFilters({ ...filters, date: "weekend" })}
                  />
                  <span className="ml-2 text-gray-700">This Weekend</span>
                </label>
              </div>
            </div>

            {/* Category filter */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-500">
                CATEGORY
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 rounded"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <span className="ml-2 text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location filter */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-500">
                LOCATION
              </h3>
              <div className="space-y-2">
                {locations.map((location) => (
                  <label key={location} className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 rounded"
                      checked={filters.locations.includes(location)}
                      onChange={() => handleLocationChange(location)}
                    />
                    <span className="ml-2 text-gray-700">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price range filter */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-500">PRICE</h3>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="300"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>$0</span>
                  <span>$300+</span>
                </div>
              </div>
            </div>

            {/* Reset filters button */}
            <button
              className="w-full px-4 py-2 text-sm font-medium text-indigo-600 transition duration-150 rounded-lg bg-indigo-50 hover:bg-indigo-100"
              onClick={() =>
                setFilters({ categories: [], locations: [], date: "all" })
              }
            >
              Reset Filters
            </button>
          </aside>
  );
};

export default FilterSidebar;