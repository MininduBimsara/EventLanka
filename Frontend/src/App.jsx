import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { ThemeProvider } from "./Context/ThemeContext";

// Common Pages
import NewHome from "./pages/Common/NewHome";
import EventBrowsingPage from "./pages/Common/EventBrowsingPage";
import EventBookingPage from "./pages/Common/EventBookingPage";
import LoginRegistrationUI from "./pages/Common/Login";
import NewEventBookingUI from "./pages/Common/NewEventBookingUI";
import AboutPage from "./pages/Common/AboutUs";
import ContactUsPage from "./pages/Common/ContactUs";

//Organizer Pages
import OrganizerDashboard from "./pages/Organizer/OrganizerDashboard";
import Attendees from "./pages/Organizer/Attendees";
import CreateEvent from "./pages/Organizer/CreateEvent";
import Discounts from "./pages/Organizer/Discounts";
import ManageEvents from "./pages/Organizer/ManageEvents";
import MediaManager from "./pages/Organizer/MediaManager";
import SalesAnalytics from "./pages/Organizer/SalesAnalytics";
import OrganizerProfile from "./pages/Organizer/OrganizerProfile";
import OrganizerSettings from "./pages/Organizer/OrganizerSettings";
// import OrganizerLayout from "./pages/Organizer/OrganizerLayout";

//Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminSettings from "./pages/Admin/AdminSettings";
import EventApprovals from "./pages/Admin/EventApprovals";
import OrganizersAdmin from "./pages/Admin/Organizers";
import RefundRequests from "./pages/Admin/RefundRequests";
import Reports from "./pages/Admin/Reports";
import AdminTransactions from "./pages/Admin/Transactions";
import AdminUsers from "./pages/Admin/Users";

//User Pages
import EditProfile from "./pages/User/EditProfile";
import Support from "./pages/User/HelpCenter";
import MyBookings from "./pages/User/MyBookings";
import Notifications from "./pages/User/Notifications";
import MyTransactions from "./pages/User/MyTransactions";
import MyReviews from "./pages/User/MyReviews";

function App() {
  // Add this code to initialize authentication headers
  const token = sessionStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return (
    <>
      <Router>
        <Routes>
          {/* Common Routes */}
          <Route path="/" element={<NewHome />} />
          <Route path="/newhome" element={<NewHome />} />
          <Route path="/eventbrowsing" element={<EventBrowsingPage />} />
          <Route path="/login" element={<LoginRegistrationUI />} />
          <Route path="/neweventbooking" element={<NewEventBookingUI />} />
          <Route path="/event/:id" element={<EventBookingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          {/* <Route path="/home" element={<Home />} /> */}

          {/* Organizer Routes element={<OrganizerLayout />}*/}
          <Route path="/organizer">
            <Route path="dashboard" element={<OrganizerDashboard />} />
            <Route path="profile" element={<OrganizerProfile />} />
            <Route path="settings" element={<OrganizerSettings />} />
            <Route path="attendees" element={<Attendees />} />
            <Route path="createevent" element={<CreateEvent />} />
            <Route path="discounts" element={<Discounts />} />
            <Route path="manageevents" element={<ManageEvents />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="salesanalytics" element={<SalesAnalytics />} />
          </Route>

          {/* Admin Routes*/}
          <Route path="/admin">
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="eventapprovals" element={<EventApprovals />} />
            <Route path="organizers" element={<OrganizersAdmin />} />
            <Route path="refundrequests" element={<RefundRequests />} />
            <Route path="reports" element={<Reports />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* User Routes */}
          <ThemeProvider>
            <Route path="/user">
              <Route path="editprofile" element={<EditProfile />} />
              <Route path="helpcenter" element={<Support />} />
              <Route path="mybookings" element={<MyBookings />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="transactions" element={<MyTransactions />} />
              <Route path="myreviews" element={<MyReviews />} />
            </Route>
          </ThemeProvider>
        </Routes>
      </Router>
    </>
  );
}

export default App;
