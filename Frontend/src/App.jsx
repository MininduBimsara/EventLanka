import "./App.css";
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { ThemeProvider } from "./Context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./Redux/Thunks/userThunks";
import { verifyAuth } from "./Redux/Thunks/authThunks";
import { checkGoogleAuthStatus } from "./Redux/Thunks/googleAuththunks";

// Common Pages
import NewHome from "./pages/Common/NewHome";
import EventBrowsingPage from "./pages/Common/EventBrowsingPage";
import EventBookingPage from "./pages/Common/EventBookingPage";
import LoginRegistrationUI from "./pages/Common/Login";
import AboutPage from "./pages/Common/AboutUs";
import ContactUsPage from "./pages/Common/ContactUs";
import PaymentSuccessPage from "./pages/Common/PaymentSuccessPage";
import CheckoutPage from "./pages/Common/CheckoutPage";
import PaymentForm from "./pages/Common/PaymentForm";
import ForgotPasswordForm from "./components/Common/PasswordReset/ForgotPasswordForm";
import ResetPasswordForm from "./components/Common/PasswordReset/ResetPasswordForm";

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
import OrganizerLayout from "./pages/Organizer/OrganizerLayout";
import UpdateEvent from "./pages/Organizer/UpdateEvent";

//Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminSettings from "./pages/Admin/AdminSettings";
import EventApprovals from "./pages/Admin/EventApprovals";
import OrganizersAdmin from "./pages/Admin/Organizers";
import RefundRequests from "./pages/Admin/RefundRequests";
import Reports from "./pages/Admin/Reports";
import AdminTransactions from "./pages/Admin/Transactions";
import AdminUsers from "./pages/Admin/Users";
import AdminLayout from "./pages/Admin/AdminLayout";

//User Pages
import EditProfile from "./pages/User/EditProfile";
import Support from "./pages/User/HelpCenter";
import MyBookings from "./pages/User/MyBookings";
import Notifications from "./pages/User/Notifications";
import MyTransactions from "./pages/User/MyTransactions";
// import MyReviews from "./pages/User/MyReviews";


import { ToastProvider } from "./components/Common/Notification/ToastContext";

function App() {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const { isAuthenticated, loading } = useSelector((state) => state.googleAuth);

  useEffect(() => {
    // Check Google authentication status
    dispatch(checkGoogleAuthStatus());

    // Only attempt to fetch profile and verify auth if a token exists
    if (token) {
      // Set auth header for axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Dispatch auth verification actions
      dispatch(fetchUserProfile());
      dispatch(verifyAuth());
    }
  }, [dispatch, token]);

  // Protected route wrapper component
  // const ProtectedRoute = ({ children }) => {
  //   if (loading) {
  //     return <div>Loading...</div>; // Or your loading component
  //   }

  //   if (!isAuthenticated) {
  //     return <Navigate to="/login" />;
  //   }

  //   return children;
  // };

  return (
    <>
      <ToastProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginRegistrationUI />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordForm />}
              />

              {/* Protected Common Routes */}
              <Route path="/" element={<NewHome />} />
              <Route path="/newhome" element={<NewHome />} />
              <Route path="/eventbrowsing" element={<EventBrowsingPage />} />
              <Route path="/event/:id" element={<EventBookingPage />} />
              <Route
                path="/payment-success/:paymentIntentId"
                element={<PaymentSuccessPage />}
              />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment-form/:orderId" element={<PaymentForm />} />

              {/* Protected Organizer Routes */}
              <Route path="/organizer" element={<OrganizerLayout />}>
                <Route path="dashboard" element={<OrganizerDashboard />} />
                <Route path="profile" element={<OrganizerProfile />} />
                <Route path="settings" element={<OrganizerSettings />} />
                <Route path="attendees" element={<Attendees />} />
                <Route path="create-event" element={<CreateEvent />} />
                <Route path="discounts" element={<Discounts />} />
                <Route path="manage-events" element={<ManageEvents />} />
                <Route path="media" element={<MediaManager />} />
                <Route path="sales-analytics" element={<SalesAnalytics />} />
                <Route path="update-event/:id" element={<UpdateEvent />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="event-approvals" element={<EventApprovals />} />
                <Route path="organizers" element={<OrganizersAdmin />} />
                <Route path="refund-requests" element={<RefundRequests />} />
                <Route path="reports" element={<Reports />} />
                <Route path="transactions" element={<AdminTransactions />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>

              {/* Protected User Routes */}
              <Route path="/user">
                <Route path="editprofile" element={<EditProfile />} />
                <Route path="helpcenter" element={<Support />} />
                <Route path="mybookings" element={<MyBookings />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="transactions" element={<MyTransactions />} />
                {/* <Route path="myreviews" element={<MyReviews />} /> */}
              </Route>

              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </ToastProvider>
    </>
  );
}

export default App;
