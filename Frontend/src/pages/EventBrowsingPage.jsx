import React, { useState } from "react";
import EventCard from "../components/EventCard"; // Using your existing component

const EventBrowsingPage = () => {
  // Sample event data
  const eventsData = [
    {
      id: 1,
      name: "Summer Beats Festival",
      date: "August 15-17, 2025",
      time: "12:00 PM - 11:00 PM",
      venue: "Riverside Park, Downtown",
      price: "$89.99",
      discount: true,
      trending: true,
      category: "Music",
      location: "Downtown",
      featuredArtists: [
        "The Groove Collective",
        "Neon Pulse",
        "Rhythm Republic",
      ],
    },
    {
      id: 2,
      name: "Tech Innovation Summit",
      date: "June 5-7, 2025",
      time: "9:00 AM - 6:00 PM",
      venue: "Tech Hub Convention Center",
      price: "$199.99",
      discount: false,
      trending: true,
      category: "Technology",
      location: "Midtown",
      featuredArtists: [
        "Leading Tech CEOs",
        "Startup Founders",
        "Industry Experts",
      ],
    },
    {
      id: 3,
      name: "Culinary Masterclass",
      date: "May 22, 2025",
      time: "3:00 PM - 8:00 PM",
      venue: "Gourmet Gallery",
      price: "$75.00",
      discount: true,
      trending: false,
      category: "Food",
      location: "Uptown",
      featuredArtists: [
        "Chef Marco",
        "Pastry Expert Lisa",
        "Wine Sommelier John",
      ],
    },
    {
      id: 4,
      name: "Fitness Expo 2025",
      date: "July 10-12, 2025",
      time: "8:00 AM - 7:00 PM",
      venue: "Sports Complex, Westside",
      price: "$45.50",
      discount: false,
      trending: false,
      category: "Sports",
      location: "Westside",
      featuredArtists: [
        "Olympic Athletes",
        "Fitness Influencers",
        "Nutrition Experts",
      ],
    },
    {
      id: 5,
      name: "Art & Design Festival",
      date: "September 3-5, 2025",
      time: "10:00 AM - 9:00 PM",
      venue: "Modern Gallery, Arts District",
      price: "$35.00",
      discount: true,
      trending: true,
      category: "Arts",
      location: "Arts District",
      featuredArtists: [
        "Contemporary Artists",
        "Digital Designers",
        "Sculptors Guild",
      ],
    },
    {
      id: 6,
      name: "Business Leadership Conference",
      date: "October 15-16, 2025",
      time: "8:30 AM - 5:30 PM",
      venue: "Grand Hotel Conference Center",
      price: "$249.99",
      discount: true,
      trending: false,
      category: "Business",
      location: "Financial District",
      featuredArtists: [
        "Fortune 500 CEOs",
        "Leadership Coaches",
        "Industry Pioneers",
      ],
    },
  ];

  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("upcoming");
  const [filters, setFilters] = useState({
    categories: [],
    locations: [],
    date: "all",
  });

  // Get unique categories and locations for filters
  const categories = [...new Set(eventsData.map((event) => event.category))];
  const locations = [...new Set(eventsData.map((event) => event.location))];

  // Handle filter changes
  const handleCategoryChange = (category) => {
    setFilters((prev) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  };

  const handleLocationChange = (location) => {
    setFilters((prev) => {
      const newLocations = prev.locations.includes(location)
        ? prev.locations.filter((l) => l !== location)
        : [...prev.locations, location];
      return { ...prev, locations: newLocations };
    });
  };

  // Filter and sort events
  const filteredEvents = eventsData
    .filter((event) => {
      // Search filter
      const matchesSearch =
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(event.category);

      // Location filter
      const matchesLocation =
        filters.locations.length === 0 ||
        filters.locations.includes(event.location);

      // Date filter - simplified for demo
      const matchesDate =
        filters.date === "all" ||
        (filters.date === "upcoming" && new Date(event.date) > new Date());

      return matchesSearch && matchesCategory && matchesLocation && matchesDate;
    })
    .sort((a, b) => {
      if (sortOption === "popular") {
        // Sort by trending first
        return b.trending - a.trending;
      } else {
        // Sort by date (simplified)
        return new Date(a.date) - new Date(b.date);
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container px-4 py-4 mx-auto md:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <h1 className="text-2xl font-bold text-gray-800">
              Discover Events
            </h1>

            <div className="flex flex-col w-full space-y-4 md:flex-row md:w-auto md:space-y-0 md:space-x-4">
              {/* Search bar */}
              <div className="relative w-full md:w-64 lg:w-80">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full px-4 py-2 pl-10 text-gray-700 transition duration-150 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Sort dropdown */}
              <select
                className="w-full px-4 py-2 text-gray-700 transition duration-150 bg-gray-100 border-none rounded-lg appearance-none md:w-48 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="upcoming">Upcoming</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-8 mx-auto md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar filters */}
          <aside className="p-6 bg-white shadow-sm rounded-xl">
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

          {/* Events grid */}
          <div className="lg:col-span-3">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                {filteredEvents.length} Events Found
              </h2>

              {/* View toggle - could be implemented */}
              <div className="flex items-center space-x-2">
                <button className="p-2 text-indigo-600 rounded-md bg-indigo-50">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 bg-white rounded-md">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Grid of event cards */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredEvents.map((event) => (
                  <div key={event.id}>
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl">
                <svg
                  className="w-16 h-16 mb-4 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mb-1 text-lg font-medium text-gray-700">
                  No events found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredEvents.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button className="px-3 py-2 text-gray-500 rounded-md hover:bg-gray-100">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button className="px-3 py-2 font-medium text-white bg-indigo-600 rounded-md">
                    1
                  </button>
                  <button className="px-3 py-2 rounded-md hover:bg-gray-100">
                    2
                  </button>
                  <button className="px-3 py-2 rounded-md hover:bg-gray-100">
                    3
                  </button>
                  <span className="px-3 py-2 text-gray-500">...</span>
                  <button className="px-3 py-2 rounded-md hover:bg-gray-100">
                    8
                  </button>
                  <button className="px-3 py-2 text-gray-500 rounded-md hover:bg-gray-100">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventBrowsingPage;
