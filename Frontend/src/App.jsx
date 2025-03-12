import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Common/Home';
import NewHome from './pages/Common/NewHome';
import EventBrowsingPage from './pages/Common/EventBrowsingPage';
import EventBookingUI from './pages/Common/EventDescription';
import LoginRegistrationUI from './pages/Common/Login'; 
function App() {

  return (
    <>
      <Router>
        <Routes>
          \ <Route path="/" element={<Home />} />
          <Route path="/newhome" element={<NewHome />} />
          <Route path="/eventbrowsing" element={<EventBrowsingPage />} />
          <Route path="/eventbooking" element={<EventBookingUI />} />
          <Route path="/login" element={<LoginRegistrationUI />} />
          {/* <Route path="/home" element={<Home />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App
