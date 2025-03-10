import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt, FaSearch, FaArrowRight } from 'react-icons/fa';

// Main NewHome Component
function NewHome() {
  return (
    <div className="min-h-screen text-white bg-gray-900">
      <Navbar />
      <HeroSection />
      <FeaturedEvents />
      <Testimonials />
      <HowItWorks />
      <Newsletter />
      <Footer />
    </div>
  );
}

// Navbar Component
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900 shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="container flex items-center justify-between px-4 mx-auto">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-2 bg-gray-100 rounded-full"></div>
          <h1 className="text-2xl font-bold">Eventify</h1>
        </div>
        
        <div className="hidden space-x-8 md:flex">
          <a href="#" className="transition-colors hover:text-amber-400">Home</a>
          <a href="#" className="transition-colors hover:text-amber-400">Events</a>
          <a href="#" className="transition-colors hover:text-amber-400">About</a>
          <a href="#" className="transition-colors hover:text-amber-400">Contact</a>
        </div>
        
        <div className="flex items-center">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search in site" 
              className="py-1 pl-3 pr-10 text-white bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
          </div>
          <button className="text-2xl md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <div className="relative h-screen bg-gray-800">
      <div 
        className="absolute inset-0 z-10 bg-gradient-to-r from-gray-900 to-transparent"
      ></div>
      <div className="container relative z-20 flex items-center h-full px-4 mx-auto">
        <div className="w-full space-y-6 md:w-1/2">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Experience the Best Events Near You!
          </h1>
          <button className="px-8 py-3 font-bold text-black transition-colors duration-300 transform rounded-full bg-amber-500 hover:bg-amber-600 hover:scale-105">
            Browse Events
          </button>
        </div>
        <div className="hidden bg-gray-300 md:block md:w-1/2 h-3/4">
          {/* This would be your hero image */}
        </div>
      </div>
    </div>
  );
};

// Featured Events Component
const FeaturedEvents = () => {
  const events = [
    {
      id: 1,
      title: 'Music Festival',
      date: 'June 20',
      location: 'New York',
      emoji: '😀'
    },
    {
      id: 2,
      title: 'Comedy Show',
      date: 'July 5',
      location: 'Los Angeles',
      emoji: '🎉'
    },
    {
      id: 3,
      title: 'Theater Play',
      date: 'Aug 15',
      location: 'Chicago',
      emoji: '🎭'
    },
    {
      id: 4,
      title: 'Live Concert',
      date: 'Sep 10',
      location: 'Miami',
      emoji: '🎸'
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container px-4 mx-auto">
        <h2 className="mb-16 text-3xl font-bold text-center">Featured Events</h2>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {events.map(event => (
            <div 
              key={event.id} 
              className="flex flex-col items-center transition-all duration-300 transform cursor-pointer group hover:-translate-y-2"
            >
              <div className="flex items-center justify-center w-20 h-20 mb-4 text-4xl bg-gray-200 rounded-full">
                {event.emoji}
              </div>
              <h3 className="mb-1 text-xl font-semibold">{event.title}</h3>
              <p className="mb-2 text-gray-400">{event.date}</p>
              <p className="text-xl font-medium text-amber-400">{event.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Component
const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah',
      comment: 'Absolutely loved the event! Great experience.',
      rating: 5
    },
    {
      id: 2,
      name: 'John',
      comment: 'Easiest way to book event tickets online!',
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gray-800">
      <div className="container px-4 mx-auto">
        <h2 className="mb-16 text-3xl font-bold text-center">User Testimonials</h2>
        
        <div className="grid max-w-4xl grid-cols-1 gap-8 mx-auto md:grid-cols-2">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="p-6 transition-transform duration-300 bg-gray-700 rounded-lg hover:transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 mr-3 bg-gray-300 rounded-full"></div>
                <span className="font-medium">{testimonial.name}</span>
                <div className="ml-auto">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <p className="text-gray-300">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Component
const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: 'Browse Events',
      description: 'Discover a variety of events in your city.',
      icon: <div className="w-20 h-20 mb-4 bg-gray-200 rounded"></div>
    },
    {
      id: 2,
      title: 'Select Tickets',
      description: 'Choose your desired event and ticket type.',
      icon: <div className="w-20 h-20 mb-4 bg-gray-200 rounded"></div>
    },
    {
      id: 3,
      title: 'Enjoy the Event',
      description: 'Have a fantastic time at the event you chose.',
      icon: <div className="w-20 h-20 mb-4 bg-gray-200 rounded"></div>
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container px-4 mx-auto">
        <h2 className="mb-16 text-3xl font-bold text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {steps.map(step => (
            <div key={step.id} className="flex flex-col items-center text-center">
              {step.icon}
              <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Newsletter Component
const Newsletter = () => {
  return (
    <section className="py-16 bg-gray-800">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl p-8 mx-auto text-center bg-gray-700 rounded-lg">
          <h3 className="mb-4 text-2xl font-bold">Join us to experience the thrill of live events and entertainment!</h3>
          <div className="flex flex-col max-w-md gap-4 mx-auto mt-8 md:flex-row">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-3 bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button className="px-6 py-3 font-bold text-black transition-colors rounded-lg bg-amber-500 hover:bg-amber-600">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="py-8 bg-gray-900 border-t border-gray-800">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="mb-4 text-gray-400 md:mb-0">© 2023 Event Ticket Booking Platform. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 transition-colors hover:text-white">Privacy Policy</a>
            <a href="#" className="text-gray-400 transition-colors hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NewHome;