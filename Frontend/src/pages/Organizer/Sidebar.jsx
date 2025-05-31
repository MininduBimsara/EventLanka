import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Home,
  PlusCircle,
  Users,
  Tag,
  Image,
  Trello,
  BarChart2,
  User,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { fetchOrganizerProfile } from "../../Redux/Slicers/OrganizerSlice"; // Update this path

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get organizer data from Redux store
  const { profile, loading, error } = useSelector((state) => state.organizer); // Adjust state path as needed

  // Fetch organizer profile on component mount
  useEffect(() => {
    dispatch(fetchOrganizerProfile());
  }, [dispatch]);

  const menuItems = [
    {
      title: "Home",
      icon: <Home className="w-5 h-5" />,
      path: "/",
    },
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/organizer/dashboard",
    },
    {
      title: "Create Event",
      icon: <PlusCircle className="w-5 h-5" />,
      path: "/organizer/create-event",
    },
    {
      title: "Manage Events",
      icon: <Trello className="w-5 h-5" />,
      path: "/organizer/manage-events",
    },
    {
      title: "Attendees",
      icon: <Users className="w-5 h-5" />,
      path: "/organizer/attendees",
    },
    {
      title: "Discounts",
      icon: <Tag className="w-5 h-5" />,
      path: "/organizer/discounts",
    },
    // {
    //   title: "Media Manager",
    //   icon: <Image className="w-5 h-5" />,
    //   path: "/organizer/media",
    // },
    {
      title: "Sales Analytics",
      icon: <BarChart2 className="w-5 h-5" />,
      path: "/organizer/sales-analytics",
    },
    {
      title: "Profile",
      icon: <User className="w-5 h-5" />,
      path: "/organizer/profile",
    },
    // {
    //   title: "Settings",
    //   icon: <Settings className="w-5 h-5" />,
    //   path: "/organizer/settings",
    // },
  ];

  // Helper function to get display name
  const getDisplayName = () => {
    if (loading) return "Loading...";
    if (error) return "Event Organizer";

    // Try different possible name fields from your API response
    const name =
      profile?.name ||
      profile?.fullName ||
      profile?.firstName + " " + profile?.lastName ||
      profile?.username ||
      "Event Organizer";

    return name;
  };

  // Helper function to get user role/title
  const getUserRole = () => {
    if (loading) return "...";
    if (error) return "Event Organizer";

    return profile?.role || profile?.title || "Event Organizer";
  };

  // Helper function to get user avatar/initials
  const getUserAvatar = () => {
    const name = getDisplayName();
    if (name === "Loading..." || name === "Event Organizer") return "EO";

    // Get initials from name
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col w-64 h-screen bg-white border-r border-gray-100 shadow-sm">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-600">Event Platform</h1>
        <p className="text-sm text-gray-600">Organizer Portal</p>
      </div>

      <div className="flex-1 px-4 py-2 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div
                className={`p-2 mr-3 rounded-full ${
                  location.pathname === item.path
                    ? "bg-blue-100"
                    : "bg-gray-100"
                }`}
              >
                {React.cloneElement(item.icon, {
                  className: `w-4 h-4 ${
                    location.pathname === item.path
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`,
                })}
              </div>
              <span className="text-sm font-medium">{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-64 p-4 mt-auto border-t border-gray-100">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 overflow-hidden bg-gray-200 rounded-full">
            {profile?.avatar || profile?.profileImage ? (
              <img
                src={profile.avatar || profile.profileImage}
                alt="Profile"
                className="object-cover w-full h-full"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`flex items-center justify-center h-full text-gray-500 ${
                profile?.avatar || profile?.profileImage ? "hidden" : "flex"
              }`}
              style={
                profile?.avatar || profile?.profileImage
                  ? { display: "none" }
                  : {}
              }
            >
              {loading ? (
                <User className="w-6 h-6" />
              ) : (
                <span className="text-sm font-medium">{getUserAvatar()}</span>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {getDisplayName()}
            </p>
            <p className="text-xs text-gray-500 truncate">{getUserRole()}</p>
            {error && (
              <p className="text-xs text-red-400 truncate" title={error}>
                Failed to load profile
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
