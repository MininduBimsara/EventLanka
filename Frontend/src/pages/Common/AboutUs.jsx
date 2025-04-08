import React, { useState, useEffect } from "react";
import {
  Star,
  Calendar,
  CreditCard,
  Share2,
  Bell,
  Tag,
  Users,
  ArrowRight,
} from "lucide-react";
import Hero from "../../components/Common/AboutUs/Hero";
import About from "../../components/Common/AboutUs/About";
import Stats from "../../components/Common/AboutUs/Stats";
import HowItWorks from "../../components/Common/AboutUs/HowItWorks";
import { Story } from "../../components/Common/AboutUs/Story";
import { Features } from "../../components/Common/AboutUs/Features";
import { Testimonials } from "../../components/Common/AboutUs/Testimonials";
import { Team } from "../../components/Common/AboutUs/Team";
import { CalltoAction } from "../../components/Common/AboutUs/CalltoAction";
import Navbar from "../../components/Common/Navbar";

const AboutPage = () => {
  const [animateCounter, setAnimateCounter] = useState(false);
  const [counters, setCounters] = useState({ events: 0, users: 0, tickets: 0 });
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimateCounter(true);
        }
      },
      { threshold: 0.1 }
    );

    const counterSection = document.getElementById("stats-section");
    if (counterSection) observer.observe(counterSection);

    return () => {
      if (counterSection) observer.unobserve(counterSection);
    };
  }, []);

  useEffect(() => {
    if (animateCounter) {
      const duration = 2000;
      const interval = 20;
      const steps = duration / interval;
      const targetValues = { events: 5000, users: 100000, tickets: 250000 };
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep += 1;
        const progress = currentStep / steps;

        setCounters({
          events: Math.floor(targetValues.events * progress),
          users: Math.floor(targetValues.users * progress),
          tickets: Math.floor(targetValues.tickets * progress),
        });

        if (currentStep >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [animateCounter]);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(testimonialInterval);
  }, []);

  const features = [
    {
      title: "Secure Ticketing",
      icon: <CreditCard className="w-12 h-12" />,
      description:
        "Encrypted ticket processing with instant delivery and fraud protection",
    },
    {
      title: "Exclusive Events",
      icon: <Star className="w-12 h-12" />,
      description:
        "Access to limited-edition experiences and VIP packages you won't find elsewhere",
    },
    {
      title: "Easy Booking",
      icon: <Calendar className="w-12 h-12" />,
      description:
        "Three-click booking process with personalized recommendations",
    },
    {
      title: "Social Sharing",
      icon: <Share2 className="w-12 h-12" />,
      description:
        "Connect with friends and share your event plans across all platforms",
    },
  ];

  const howItWorks = [
    {
      title: "Discover",
      description: "Browse thousands of events by category, location, or date",
      icon: <Bell className="w-8 h-8" />,
    },
    {
      title: "Book",
      description: "Select your tickets with our secure one-click checkout",
      icon: <Tag className="w-8 h-8" />,
    },
    {
      title: "Enjoy",
      description: "Receive digital tickets and event reminders instantly",
      icon: <Calendar className="w-8 h-8" />,
    },
    {
      title: "Share",
      description: "Create memories and share experiences with friends",
      icon: <Users className="w-8 h-8" />,
    },
  ];

  const testimonials = [
    {
      name: "Alex M.",
      event: "Summer Music Festival",
      quote:
        "Found tickets to my favorite band in seconds! The app made everything so easy.",
    },
    {
      name: "Jamie L.",
      event: "Food & Wine Expo",
      quote:
        "I've booked three events this month alone. The exclusive access is worth every penny!",
    },
    {
      name: "Taylor R.",
      event: "Comic Convention",
      quote:
        "Sharing events with friends and planning group outings has never been this simple.",
    },
  ];

  const teamMembers = [
    {
      name: "Jordan Rivera",
      role: "Founder & CEO",
      image: "/api/placeholder/200/200",
    },
    {
      name: "Casey Wong",
      role: "Event Director",
      image: "/api/placeholder/200/200",
    },
    {
      name: "Taylor Morgan",
      role: "Head of Design",
      image: "/api/placeholder/200/200",
    },
    {
      name: "Alex Johnson",
      role: "Customer Experience",
      image: "/api/placeholder/200/200",
    },
  ];

  return (
    <div className="relative overflow-hidden font-sans">
      <Navbar />

      {/* Decorative elements */}
      <div className="absolute hidden w-64 h-64 bg-purple-500 rounded-full md:block top-40 left-20 opacity-10 blur-3xl"></div>
      <div className="absolute hidden bg-pink-500 rounded-full md:block top-96 right-20 w-80 h-80 opacity-10 blur-3xl"></div>
      <div className="absolute hidden bg-yellow-500 rounded-full md:block bottom-40 left-40 w-72 h-72 opacity-10 blur-3xl"></div>

      {/* Hero Section */}
      <Hero />

      {/* About the Platform */}
      <About />

      {/* Stats Counter */}
      <Stats counters={counters} />

      {/* How It Works */}
      <HowItWorks howItWorks={howItWorks} />

      {/* Our Story */}
      <Story />

      {/* Features */}
      <Features features={features} />

      {/* Testimonials */}
      <Testimonials
        testimonials={testimonials}
        activeTestimonial={activeTestimonial}
      />

      {/* Team */}
      <Team teamMembers={teamMembers} />

      {/* Call to Action */}
      <CalltoAction />
    </div>
  );
};

export default AboutPage;
