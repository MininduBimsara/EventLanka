import { useState, useEffect } from "react";
import { Search, Filter, User, Ban, Eye, Check, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUserStatus } from "../../Redux/Slicers/adminSlice"; // Adjust the import path as needed

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { usersList: allUsers, loading } = useSelector(
    (state) => state.admin.users
  );

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Apply search and filter when users, query, or filter changes
  useEffect(() => {
    // Make sure allUsers exists and is an array before proceeding
    if (!allUsers || !Array.isArray(allUsers)) return;

    let result = [...allUsers];

    // Apply status filter
    if (activeFilter !== "all") {
      if (activeFilter === "active") {
        result = result.filter((user) => user.status === "active");
      } else if (activeFilter === "banned") {
        result = result.filter((user) => user.status === "banned");
      }
      // Removed the organizers filter
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(result);
  }, [allUsers, searchQuery, activeFilter]);

  const toggleBan = (userId) => {
    // Make sure allUsers exists and is an array before proceeding
    if (!allUsers || !Array.isArray(allUsers)) return;

    // Find the user to get current status
    const user = allUsers.find((u) => u._id === userId);
    if (!user) return;

    // Determine new status
    const newStatus = user.status === "active" ? "banned" : "active";

    // Dispatch action to update status
    dispatch(
      updateUserStatus({
        userId,
        statusData: { status: newStatus },
      })
    ).then(() => {
      // If the currently selected user is being updated, update the selected user too
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    });
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  // Role-based badge color
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "organizer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>

      {/* Search and Filter Controls */}
      <div className="flex flex-col justify-between gap-4 mb-6 md:flex-row">
        <div className="relative">
          <Search
            className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email"
            className="w-full py-2 pl-10 pr-4 border rounded-lg md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeFilter === "active"
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
            onClick={() => setActiveFilter("active")}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeFilter === "banned"
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
            onClick={() => setActiveFilter("banned")}
          >
            Banned
          </button>
          {/* Removed the Organizers filter button */}
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Signup Date
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="mr-2 text-gray-400" size={18} />
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(
                      user.createdAt || user.signupDate
                    ).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <button
                      onClick={() => viewUserDetails(user)}
                      className="mr-4 text-blue-600 hover:text-blue-900"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => toggleBan(user._id)}
                      className={`${
                        user.status === "active"
                          ? "text-red-600 hover:text-red-900"
                          : "text-green-600 hover:text-green-900"
                      }`}
                    >
                      {user.status === "active" ? (
                        <Ban size={18} />
                      ) : (
                        <Check size={18} />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No users found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">User Details</h2>
              <button
                onClick={closeUserDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1 text-gray-900">{selectedUser.name}</div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 text-gray-900">{selectedUser.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <div className="mt-1">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(
                        selectedUser.role
                      )}`}
                    >
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedUser.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Signup Date
                  </label>
                  <div className="mt-1 text-gray-900">
                    {new Date(
                      selectedUser.createdAt || selectedUser.signupDate
                    ).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    User ID
                  </label>
                  <div className="mt-1 text-gray-900">{selectedUser._id}</div>
                </div>
                {/* Display additional user details if available */}
                {selectedUser.phone && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <div className="mt-1 text-gray-900">
                      {selectedUser.phone}
                    </div>
                  </div>
                )}
                {selectedUser.address && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="mt-1 text-gray-900">
                      {selectedUser.address}
                    </div>
                  </div>
                )}
                {selectedUser.city && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1 text-gray-900">
                      {selectedUser.city}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => toggleBan(selectedUser._id)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedUser.status === "active"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {selectedUser.status === "active" ? "Ban User" : "Unban User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
