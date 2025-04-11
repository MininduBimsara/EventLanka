import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // your custom sidebar

function OrganizerLayout() {
  return (
    <div className="flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right: Page content */}
      <div className="flex-1 min-h-screen p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}

export default OrganizerLayout;
