import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewHome from './pages/Common/NewHome';
import EventBrowsingPage from './pages/Common/EventBrowsingPage';
import EventBookingPage from './pages/Common/EventBookingPage';
import LoginRegistrationUI from './pages/Common/Login'; 
import NewEventBookingUI from './pages/Common/NewEventBookingUI';
function App() {

  return (
    <>
      <Router>
        <Routes>
          \ <Route path="/" element={<NewHome />} />
          <Route path="/newhome" element={<NewHome />} />
          <Route path="/eventbrowsing" element={<EventBrowsingPage />} />
          <Route path="/login" element={<LoginRegistrationUI />} />
          <Route path="/neweventbooking" element={<NewEventBookingUI />} />
          <Route path="/event/:id" element={<EventBookingPage />} />
          {/* <Route path="/home" element={<Home />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App
