import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTicketAlt,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/HomePage/Footer";
import TrendingEventsSlider from "../../components/HomePage/TrendingEventsSlider";
import Newsletter from "../../components/HomePage/Newsletter";
import Testimonials from "../../components/HomePage/Testimonials";
import HowItWorks from "../../components/HomePage/HowItWorks";
import HeroSection from "../../components/HomePage/HeroSection";
import FeaturedEvents from "../../components/HomePage/FeaturedEvents";
import GradientSync from "../../components/HomePage/GradientSync";

// Main NewHome Component
function NewHome() {
  return (
    <>
      {" "}
      <div className="min-h-screen text-white ">
        <Navbar />
        <GradientSync />
        <HeroSection />
        <FeaturedEvents />
        <TrendingEventsSlider />
        <Testimonials />
        <HowItWorks />
        <Newsletter />
        <Footer />
      </div>
    </>
  );
}

export default NewHome;
