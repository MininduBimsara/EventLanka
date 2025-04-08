import React, { useState, useEffect } from "react";
import EventCard from "../../components/Common/EventBrowsing/EventCard"; // Using your existing component
import NavBar from "../../components/Common/Navbar";
import SearchBar from "../../components/Common/EventBrowsing/SearchBar"; // Using your existing component
import SortDropdown from "../../components/Common/EventBrowsing/SortDropdown";
import FilterSidebar from "../../components/Common/EventBrowsing/FilterSidebar";
import ViewToggle from "../../components/Common/EventBrowsing/ViewToggle";
import NoEventsFound from "../../components/Common/EventBrowsing/NoEventsFound";
import Pagination from "../../components/Common/EventBrowsing/Pagination";
import EventBrowsingGradientSync from "../../components/Common/EventBrowsing/EventBrowsingGradientSync";

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
      bookingAvailable: true,
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
      bookingAvailable: false,
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
      bookingAvailable: true,
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
      bookingAvailable: false,
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
      bookingAvailable: true,
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
      bookingAvailable: true,
    },
  ];

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Only show the header when at the top of the page
      // You can adjust the threshold (20) if needed
      if (window.scrollY <= 20) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      }
      if (sortOption === "price-low") {
        return (
          parseFloat(a.price.replace("$", "")) -
          parseFloat(b.price.replace("$", ""))
        );
      }
      if (sortOption === "price-high") {
        return (
          parseFloat(b.price.replace("$", "")) -
          parseFloat(a.price.replace("$", ""))
        );
      } else {
        // Sort by date (simplified)
        return new Date(a.date) - new Date(b.date);
      }
    });

  return (
    <div className="relative min-h-screen">
      {/* Main background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#3D0C7D] via-[#7A4495] to-[#F0A8AE] animate-gradient-event"></div>

      {/* Overlay for better text contrast */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

      {/* Add gradient sync component */}
      <EventBrowsingGradientSync />

      {/* Content container */}
      <div className="relative z-10">
        <NavBar />

        {/* Header */}
        <header
          id="event-browsing-header"
          className={`fixed z-10 w-full border-b top-20 left-0 right-0 transition-all duration-300 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <div className="container relative z-10 px-4 py-4 mx-auto md:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              <div className="flex flex-col w-full space-y-4 md:flex-row md:w-auto md:space-y-0 md:space-x-4 md:ml-auto">
                {/* Search bar */}
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />

                {/* Sort dropdown */}
                <SortDropdown
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Spacer to prevent content overlap with fixed header */}
        <div className="h-40"></div>

        {/* Main content */}
        <main className="container px-4 py-10 mx-auto md:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Sidebar filters with gradient */}
            <div
              id="event-browsing-sidebar"
              className="relative overflow-hidden rounded-lg"
            >
              <div className="relative z-10">
                <FilterSidebar
                  categories={categories}
                  locations={locations}
                  filters={filters}
                  setFilters={setFilters}
                  handleCategoryChange={handleCategoryChange}
                  handleLocationChange={handleLocationChange}
                />
              </div>
            </div>

            {/* Events grid */}
            <div className="lg:col-span-3">
              {/* Results count and view toggle */}
              <div className="flex items-center justify-between p-4 mb-6 bg-black rounded-lg bg-opacity-30">
                <h2 className="text-lg font-bold text-white">
                  {filteredEvents.length} Events Found
                </h2>

                {/* View toggle - could be implemented */}
                <div id="event-view-toggle" className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3D0C7D] via-[#7A4495] to-[#F0A8AE] rounded-lg opacity-90 animate-gradient-event"></div>
                  <div className="relative z-10">
                    <ViewToggle />
                  </div>
                </div>
              </div>

              {/* Grid of event cards */}
              {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="relative event-card-hover">
                      <div className="absolute inset-0 transition-all duration-300 transform bg-black rounded-lg bg-opacity-40 hover:bg-opacity-20"></div>
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              ) : (
                // No events found message
                <div className="relative overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3D0C7D] via-[#7A4495] to-[#F0A8AE] opacity-70 animate-gradient-event"></div>
                  <div className="relative z-10">
                    <NoEventsFound />
                  </div>
                </div>
              )}

              {/* Pagination */}
              {filteredEvents.length > 0 && (
                <div id="event-pagination" className="relative mt-8">
                  <div className="relative z-10">
                    <Pagination />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
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
    </div>
  );
};

export default EventBrowsingPage;
