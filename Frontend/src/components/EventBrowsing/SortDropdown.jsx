import { React } from "react";

const SortDropdown = ({ sortOption, setSortOption }) => {
  return (
    <select
      className="w-full px-4 py-2 text-gray-700 bg-gray-100 border-none rounded-md appearance-none md:w-48 focus:outline-none focus:ring-1 focus:ring-gray-300"
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value)}
    >
      <option value="upcoming">Upcoming</option>
      <option value="popular">Most Popular</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
    </select>
  );
};

export default SortDropdown;
