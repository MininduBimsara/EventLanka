import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTicketAlt,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";
import Navbar from "../../components/Common/Navbar";
import Footer from "../../components/Common/HomePage/Footer";
import TrendingEventsSlider from "../../components/Common/HomePage/TrendingEventsSlider";
import Newsletter from "../../components/Common/HomePage/Newsletter";
import Testimonials from "../../components/Common/HomePage/Testimonials";
import HowItWorks from "../../components/Common/HomePage/HowItWorks";
import HeroSection from "../../components/Common/HomePage/HeroSection";
import FeaturedEvents from "../../components/Common/HomePage/FeaturedEvents";
import GradientSync from "../../components/Common/HomePage/GradientSync";
import MouseEffect from "../../Artifacts/MouseEffects";

// Main NewHome Component
function NewHome() {
  return (
    <>
      {" "}
      <div className="min-h-screen">
        <Navbar />
        <GradientSync />
        <HeroSection />
        <MouseEffect />
        <FeaturedEvents />
        <TrendingEventsSlider />
        <HowItWorks />
        <Newsletter />
        <Testimonials />
        <Footer />
      </div>
    </>
  );
}

export default NewHome;
