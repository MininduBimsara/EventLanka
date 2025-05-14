import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  FileCheck,
  Users,
  ArrowLeftRight,
  BarChart2,
  PlusCircle,
  Trello,
  Tag,
  Image,
  User,
  FileText,
  Home,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Home",
      icon: <Home className="w-5 h-5" />,
      path: "/",
    },
    {
      title: "Admin Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/admin/dashboard",
    },
    {
      title: "Admin Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/admin/settings",
    },
    {
      title: "Event Approvals",
      icon: <FileCheck className="w-5 h-5" />,
      path: "/admin/event-approvals",
    },
    {
      title: "Organizers",
      icon: <Users className="w-5 h-5" />,
      path: "/admin/organizers",
    },
    // {
    //   title: "Refund Requests",
    //   icon: <ArrowLeftRight className="w-5 h-5" />,
    //   path: "/admin/refund-requests",
    // },
    // {
    //   title: "Reports",
    //   icon: <BarChart2 className="w-5 h-5" />,
    //   path: "/admin/reports",
    // },
    {
      title: "Transactions",
      icon: <ArrowLeftRight className="w-5 h-5" />,
      path: "/admin/transactions",
    },
    {
      title: "Users",
      icon: <Users className="w-5 h-5" />,
      path: "/admin/users",
    },
    
  ];

  return (
    <div className="flex flex-col w-64 h-screen text-gray-300 bg-gray-900 shadow-md">
      <div className="p-6">
        <h1 className="text-xl font-bold text-yellow-500">Admin Portal</h1>
        <p className="text-sm text-gray-400">Event Management System</p>
      </div>

      <div className="flex-1 px-4 py-2 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-gray-800 text-yellow-400"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <div
                className={`p-2 mr-3 rounded-full ${
                  location.pathname === item.path
                    ? "bg-gray-700"
                    : "bg-gray-700"
                }`}
              >
                {React.cloneElement(item.icon, {
                  className: `w-4 h-4 ${
                    location.pathname === item.path
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`,
                })}
              </div>
              <span className="text-sm font-medium">{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-64 p-4 mt-auto border-t border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 overflow-hidden bg-gray-700 rounded-full">
            <div className="flex items-center justify-center h-full text-gray-300">
              <User className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-300">Admin User</p>
            <p className="text-xs text-gray-500">System Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
