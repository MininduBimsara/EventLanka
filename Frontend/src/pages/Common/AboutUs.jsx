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
      {/* Decorative elements */}
      <div className="absolute hidden w-64 h-64 bg-purple-500 rounded-full md:block top-40 left-20 opacity-10 blur-3xl"></div>
      <div className="absolute hidden bg-pink-500 rounded-full md:block top-96 right-20 w-80 h-80 opacity-10 blur-3xl"></div>
      <div className="absolute hidden bg-yellow-500 rounded-full md:block bottom-40 left-40 w-72 h-72 opacity-10 blur-3xl"></div>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={`dot-${i}-${Math.random()}`}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 5 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              <div
                className="w-2 h-2 bg-white rounded-full opacity-70"
                style={{
                  transform: `scale(${Math.random() * 2 + 0.5})`,
                }}
              ></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl px-4 mx-auto text-center">
          <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl drop-shadow-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-50">
              Celebrate Every Moment
            </span>
          </h1>
          <p className="mb-8 text-xl text-white md:text-2xl opacity-90">
            Your one-stop destination for discovering and booking the most
            exciting events in town
          </p>
          <button className="px-8 py-3 text-lg font-bold text-indigo-900 transition-all duration-300 transform bg-yellow-400 rounded-full animate-pulse hover:bg-yellow-300 hover:shadow-lg hover:scale-105">
            Explore Events
          </button>
        </div>
      </section>

      {/* About the Platform */}
      <section className="px-4 py-24 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-12 text-4xl font-bold text-center text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Where Memories Begin
          </h2>

          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                Welcome to{" "}
                <span className="font-bold text-indigo-600">Festiva!</span> –
                where every ticket opens the door to unforgettable experiences.
                We're not just an event platform; we're your personal guide to a
                world of entertainment, culture, and celebration.
              </p>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                Born from a passion for bringing people together, we've created
                a vibrant marketplace where event lovers and organizers connect.
                From intimate gallery openings to stadium-filling concerts, our
                mission is to make every event accessible, every ticket secure,
                and every experience extraordinary.
              </p>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-0.5 rounded-lg hover:p-1 transition-all duration-300">
                <div className="p-6 bg-white rounded-lg">
                  <p className="text-lg font-semibold text-indigo-700">
                    "We believe that the right event can change your day, your
                    year, or sometimes even your life. That's why we're here –
                    to make those moments happen."
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute inset-0 transform rounded-lg bg-gradient-to-r from-yellow-400 to-pink-500 rotate-3"></div>
                <div className="relative p-1 transition-all duration-500 transform bg-white rounded-lg -rotate-3 hover:rotate-0">
                  <img
                    src="/api/placeholder/600/400"
                    alt="People enjoying an event"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section
        id="stats-section"
        className="px-4 py-16 text-white bg-indigo-900"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            <div className="p-8 transition-all duration-300 bg-indigo-800 bg-opacity-50 rounded-xl hover:transform hover:scale-105">
              <div className="mb-2 text-4xl font-bold md:text-5xl">
                {counters.events.toLocaleString()}+
              </div>
              <div className="text-xl text-indigo-200">Events Monthly</div>
            </div>
            <div className="p-8 transition-all duration-300 bg-indigo-800 bg-opacity-50 rounded-xl hover:transform hover:scale-105">
              <div className="mb-2 text-4xl font-bold md:text-5xl">
                {counters.users.toLocaleString()}+
              </div>
              <div className="text-xl text-indigo-200">Happy Attendees</div>
            </div>
            <div className="p-8 transition-all duration-300 bg-indigo-800 bg-opacity-50 rounded-xl hover:transform hover:scale-105">
              <div className="mb-2 text-4xl font-bold md:text-5xl">
                {counters.tickets.toLocaleString()}+
              </div>
              <div className="text-xl text-indigo-200">Tickets Sold</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-16 text-4xl font-bold text-center text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            How It Works
          </h2>

          <div className="grid gap-6 md:grid-cols-4">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="absolute z-0 hidden w-full h-1 transform -translate-x-1/2 md:block top-12 left-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                )}
                <div className="relative z-10 p-8 transition-all duration-300 bg-white border-2 border-transparent shadow-lg rounded-xl hover:transform hover:scale-105 hover:border-indigo-200">
                  <div className="inline-flex items-center justify-center p-3 mb-4 text-white rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                    {step.icon}
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-800">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 py-24 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-16 text-4xl font-bold text-center text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Our Story
          </h2>

          <div className="space-y-24">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <div className="relative">
                  <div className="absolute inset-0 transform bg-yellow-400 rounded-lg rotate-3"></div>
                  <img
                    src="/api/placeholder/600/400"
                    alt="The beginning"
                    className="relative transition-all duration-500 transform rounded-lg -rotate-3 hover:rotate-0"
                  />
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-3xl font-bold text-indigo-800">
                  The Spark
                </h3>
                <p className="text-lg leading-relaxed text-gray-700">
                  It all started with a missed concert. Our founders, tired of
                  complicated booking processes and sold-out shows, decided
                  there had to be a better way to connect people with the events
                  they love. In 2018, from a tiny apartment and a big dream,
                  Festiva was born.
                </p>
              </div>
            </div>

            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="order-2 md:order-1">
                <h3 className="mb-4 text-3xl font-bold text-indigo-800">
                  Growing Together
                </h3>
                <p className="text-lg leading-relaxed text-gray-700">
                  What began as a simple ticket marketplace quickly evolved into
                  a community. We partnered with venues, artists, and event
                  creators who shared our vision. Together, we've built more
                  than just a platform—we've created a movement that celebrates
                  the magic of live experiences.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <div className="relative">
                  <div className="absolute inset-0 transform bg-pink-400 rounded-lg -rotate-3"></div>
                  <img
                    src="/api/placeholder/600/400"
                    alt="Company growth"
                    className="relative transition-all duration-500 transform rounded-lg rotate-3 hover:rotate-0"
                  />
                </div>
              </div>
            </div>

            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <div className="relative">
                  <div className="absolute inset-0 transform bg-indigo-400 rounded-lg rotate-3"></div>
                  <img
                    src="/api/placeholder/600/400"
                    alt="Our vision"
                    className="relative transition-all duration-500 transform rounded-lg -rotate-3 hover:rotate-0"
                  />
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-3xl font-bold text-indigo-800">
                  Today and Tomorrow
                </h3>
                <p className="text-lg leading-relaxed text-gray-700">
                  Now, with millions of users across the country, we're just
                  getting started. Our vision extends beyond tickets—we're
                  building a platform where memories are made, communities are
                  formed, and culture thrives. As we grow, our commitment
                  remains the same: to make every event an unforgettable
                  experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-24 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-16 text-4xl font-bold text-center text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Why Choose Festiva
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl"
              >
                <div className="p-8">
                  <div className="inline-flex items-center justify-center p-3 mb-4 text-white rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="px-8 py-3 text-lg font-bold text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:scale-105 group">
              Get Started
              <ArrowRight className="inline-block ml-2 transition-transform duration-300 transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-24 text-white bg-gradient-to-r from-indigo-900 to-purple-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-16 text-4xl font-bold text-center md:text-5xl">
            What Our Users Say
          </h2>

          <div className="relative h-64">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute w-full transition-all duration-500 ${
                  index === activeTestimonial
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-full"
                }`}
              >
                <div className="p-8 text-center bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl">
                  <p className="mb-6 text-xl italic">"{testimonial.quote}"</p>
                  <div className="text-lg font-bold">{testimonial.name}</div>
                  <div className="text-indigo-200">{testimonial.event}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full mx-1 ${
                  index === activeTestimonial
                    ? "bg-white"
                    : "bg-white bg-opacity-30"
                }`}
                onClick={() => setActiveTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-4 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-16 text-4xl font-bold text-center text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Meet Our Team
          </h2>

          <div className="grid gap-8 md:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-indigo-900 to-transparent group-hover:opacity-100">
                    <div className="flex justify-center space-x-4">
                      <a href="#" className="text-white hover:text-indigo-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-indigo-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-indigo-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-indigo-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 py-24 text-white bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Ready to Experience the Magic?
          </h2>
          <p className="mb-8 text-xl opacity-90">
            Join thousands of event-goers discovering their next favorite
            experience every day.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="px-8 py-3 text-lg font-bold text-indigo-800 transition-all duration-300 transform bg-white rounded-full hover:shadow-lg hover:scale-105">
              Find Events
            </button>
            <button className="px-8 py-3 text-lg font-bold text-white transition-all duration-300 transform bg-transparent border-2 border-white rounded-full hover:shadow-lg hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
