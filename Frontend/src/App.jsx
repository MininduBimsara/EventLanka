import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Common Pages
import NewHome from './pages/Common/NewHome';
import EventBrowsingPage from './pages/Common/EventBrowsingPage';
import EventBookingPage from './pages/Common/EventBookingPage';
import LoginRegistrationUI from './pages/Common/Login'; 
import NewEventBookingUI from './pages/Common/NewEventBookingUI';
import AboutPage from './pages/Common/AboutUs';
import ContactUsPage from './pages/Common/ContactUs';

//Organizer Pages
import OrganizerDashboard from './pages/Organizer/OrganizerDashboard';
import Attendees from './pages/Organizer/Attendees';
import CreateEvent from './pages/Organizer/CreateEvent';
import Discounts from "./pages/Organizer/Discounts";
import ManageEvents from "./pages/Organizer/ManageEvents";
import MediaManager from "./pages/Organizer/MediaManager";
import SalesAnalytics from "./pages/Organizer/SalesAnalytics"
import OrganizerProfile from "./pages/Organizer/OrganizerProfile";
import OrganizerSettings from "./pages/Organizer/OrganizerSettings";
// import OrganizerLayout from "./pages/Organizer/OrganizerLayout";

function App() {

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
        </Routes>
      </Router>
    </>
  );
}

export default App
