import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents } from "../../Redux/Thunks/eventThunk"; // Adjust path as needed
import EventCard from "../../components/Common/EventBrowsing/EventCard";
import NavBar from "../../components/Common/Navbar";
import SearchBar from "../../components/Common/EventBrowsing/SearchBar";
import SortDropdown from "../../components/Common/EventBrowsing/SortDropdown";
import FilterSidebar from "../../components/Common/EventBrowsing/FilterSidebar";
import ViewToggle from "../../components/Common/EventBrowsing/ViewToggle";
import NoEventsFound from "../../components/Common/EventBrowsing/NoEventsFound";
import Pagination from "../../components/Common/EventBrowsing/Pagination";

const EventBrowsingPage = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);

  const [isVisible, setIsVisible] = useState(true);

  const [viewMode, setViewMode] = useState("grid");

  // Fetch events when component mounts
  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY <= 20);
    };

    window.addEventListener("scroll", handleScroll);

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  // Get unique categories and locations for filters from actual data
  const categories = events
    ? [...new Set(events.map((event) => event.category))]
    : [];
  const locations = events
    ? [...new Set(events.map((event) => event.location))]
    : [];

  // Handle filter changes
  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
    setCurrentPage(1);
  };

  const handleLocationChange = (location) => {
    setFilters((prev) => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter((l) => l !== location)
        : [...prev.locations, location],
    }));
    setCurrentPage(1);
  };

  // Reset pagination on search term or sort option change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOption]);

  // Helper function to get the primary ticket price
  const getPrimaryTicketPrice = (event) => {
    try {
      if (
        event &&
        event.ticket_types &&
        Array.isArray(event.ticket_types) &&
        event.ticket_types.length > 0
      ) {
        const price = parseFloat(event.ticket_types[0].price);
        return isNaN(price) ? Infinity : price;
      }
    } catch (error) {
      console.error("Error getting primary ticket price:", error);
    }
    return Infinity;
  };

  // Filter and sort events
  const filteredEvents = events
    ? events
        .filter((event) => {
          const matchesSearch =
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesCategory =
            filters.categories.length === 0 ||
            filters.categories.includes(event.category);

          const matchesLocation =
            filters.locations.length === 0 ||
            filters.locations.includes(event.location);

          const matchesDate =
            filters.date === "all" ||
            (filters.date === "upcoming" && new Date(event.date) > new Date());

          return (
            matchesSearch && matchesCategory && matchesLocation && matchesDate
          );
        })
        .sort((a, b) => {
          if (sortOption === "popular") {
            return (b.trending || 0) - (a.trending || 0);
          } else if (sortOption === "price-low") {
            return getPrimaryTicketPrice(a) - getPrimaryTicketPrice(b);
          } else if (sortOption === "price-high") {
            return getPrimaryTicketPrice(b) - getPrimaryTicketPrice(a);
          } else {
            return new Date(a.date || 0) - new Date(b.date || 0);
          }
        })
    : [];

  // Pagination calculations
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Simplified blue textured background */}
      <div className="fixed inset-0 bg-blue-100">
        {/* Simple dotted pattern - less density, larger spacing */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232563eb' fill-opacity='0.45' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='2'/%3E%3Ccircle cx='17' cy='17' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        ></div>

        {/* Gradient overlay with more blue */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 via-blue-100/40 to-white/60"></div>

        {/* Simple blue radial highlights */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 30%, rgba(37, 99, 235, 0.25) 0%, rgba(255, 255, 255, 0) 50%)",
          }}
        ></div>
      </div>

      <div className="relative z-10">
        <NavBar />

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
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                <SortDropdown
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                />
              </div>
            </div>
          </div>
        </header>

        <div className="h-40"></div>

        <main className="container px-4 py-10 mx-auto md:px-6 lg:px-8">
          {loading && (
            <div className="flex items-center justify-center w-full p-8">
              <div className="w-12 h-12 border-4 rounded-full border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin"></div>
            </div>
          )}

          {error && (
            <div className="p-4 mb-6 text-white bg-red-600 rounded-lg">
              <p>Error loading events: {error}</p>
              <button
                className="px-4 py-2 mt-2 text-white bg-red-700 rounded hover:bg-red-800"
                onClick={() => dispatch(fetchAllEvents())}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
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

              <div className="lg:col-span-3">
                <div className="flex items-center justify-between p-4 mb-6 bg-black rounded-lg bg-opacity-30">
                  <h2 className="text-lg font-bold text-white">
                    {filteredEvents.length} Events Found
                    {filteredEvents.length > 0 && (
                      <span className="ml-2 text-sm font-normal text-white/70">
                        (Page {currentPage} of {totalPages})
                      </span>
                    )}
                  </h2>
                  <div id="event-view-toggle" className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3D0C7D] via-[#7A4495] to-[#F0A8AE] rounded-lg opacity-90 animate-gradient-event"></div>
                    <div className="relative z-10">
                      <ViewToggle
                        viewMode={viewMode}
                        onViewChange={setViewMode}
                      />
                    </div>
                  </div>
                </div>
                {filteredEvents.length > 0 ? (
                <div
                  className={
                    viewMode === "list"
                      ? "space-y-4"
                      : "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                  }
                >
                  {currentEvents.map((event) => (
                    <div
                      key={event._id || event.id}
                      className={`event-card-hover ${
                        viewMode === "list" ? "w-full" : ""
                      }`}
                    >
                      <EventCard event={event} viewMode={viewMode} />
                    </div>
                  ))}
                </div>
                ) : (
                <div className="relative overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3D0C7D] via-[#7A4495] to-[#F0A8AE] opacity-70 animate-gradient-event"></div>
                  <div className="relative z-10">
                    <NoEventsFound />
                  </div>
                </div>
                )}
                {filteredEvents.length > 0 && (
                  <div id="event-pagination" className="relative mt-8">
                    <div className="relative z-10">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EventBrowsingPage;
