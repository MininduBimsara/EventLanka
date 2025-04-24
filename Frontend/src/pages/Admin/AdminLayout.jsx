import { Outlet } from "react-router-dom";
import Sidebar from "./AdminSidebar"; // your custom sidebar

function AdminLayout() {
  return (
    <div className="flex">
      {/* Left Sidebar */}
      <div className="fixed top-0 left-0 h-screen">
        <Sidebar />
      </div>

      {/* Right: Page content */}
      <div className="flex-1 min-h-screen p-8 ml-64 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
