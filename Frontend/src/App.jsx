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


          {/* Organizer Routes */}
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />

          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </>
  );
}

export default App
