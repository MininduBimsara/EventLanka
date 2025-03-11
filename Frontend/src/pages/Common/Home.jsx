import React, { useState, useEffect } from "react";

const FuturisticCodeSquadren = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white font-sans">
      {/* Futuristic NavBar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/80 backdrop-blur-md py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-600 to-yellow-500 mr-3 flex items-center justify-center">
              <span className="font-bold text-xs">CS</span>
            </div>
            <span className="font-bold text-xl tracking-tight">
              CodeSquadren
            </span>
          </div>

          <div className="hidden md:flex space-x-8">
            {[
              "Home",
              "Services",
              "Projects",
              "Testimonials",
              "About Us",
              "Contact",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-gray-300 hover:text-amber-400 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="md:hidden">
            <button className="p-2 rounded-full bg-amber-600/20">
              <div className="w-5 h-0.5 bg-white mb-1"></div>
              <div className="w-5 h-0.5 bg-white mb-1"></div>
              <div className="w-5 h-0.5 bg-white"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-yellow-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-amber-600/10 blur-3xl"></div>
          <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-yellow-600/10 blur-3xl"></div>
          <div className="absolute bottom-10 left-1/3 w-48 h-48 rounded-full bg-amber-600/10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <div className="inline-block mb-3 px-4 py-1 bg-gradient-to-r from-amber-900/30 to-yellow-900/30 backdrop-blur-sm rounded-full">
              <p className="text-xs font-medium text-amber-300">
                Leading Edge of Technology
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Welcome to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">
                CodeSquadren
              </span>
            </h1>
            <p className="text-gray-400 mb-8 max-w-md mx-auto md:mx-0">
              We are a futuristic tech startup that specializes in full-stack
              applications, mobile apps, web apps, and cutting-edge AI
              solutions.
            </p>
            <button className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20">
              Explore More
            </button>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div
                className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-yellow-400/20 rounded-full animate-pulse"
                style={{ animationDuration: "3s" }}
              ></div>
              <div
                className="absolute inset-4 bg-gradient-to-br from-amber-600/30 to-yellow-400/30 rounded-full animate-pulse"
                style={{ animationDuration: "4s" }}
              ></div>
              <div
                className="absolute inset-8 bg-gradient-to-br from-amber-600/40 to-yellow-400/40 rounded-full animate-pulse"
                style={{ animationDuration: "5s" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-600 to-yellow-500 flex items-center justify-center shadow-xl shadow-amber-800/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Expertise Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Expertise
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Explore our advanced tech services
            </p>
            <div className="mt-8">
              <button className="px-6 py-2 border border-amber-500 text-amber-400 rounded-lg hover:bg-amber-500/10 transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Custom Solutions",
                subtitle: "CodeDevMaster",
                icon: "💻",
                description: "Full-Stack Development",
              },
              {
                title: "Seamless Experiences",
                subtitle: "AppGenius",
                icon: "📱",
                description: "Mobile Apps",
              },
              {
                title: "Interactive Interfaces",
                subtitle: "WebVision",
                icon: "🌐",
                description: "Web Apps",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:translate-y-[-5px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-yellow-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex justify-between items-start">
                    <span className="text-2xl">{service.icon}</span>
                    <span className="text-xs text-gray-500">
                      {service.subtitle}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    {service.description}
                  </p>
                  <div className="inline-block w-10 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Secure Infrastructure</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-2xl">
                Our cloud-native solutions provide enterprise-grade security
                with advanced threat detection and real-time monitoring.
              </p>
              <div className="text-center">
                <span className="text-sm text-gray-500">27 Solutions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-amber-600/5 blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-yellow-600/5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose CodeSquadren?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Discover the reasons to partner with us
            </p>
            <div className="mt-8">
              <button className="px-6 py-2 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200 transform hover:scale-105">
                Experience Innovation
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Scalability",
                description:
                  "Infinitely scalable solutions for your tech needs",
                icon: "📈",
              },
              {
                title: "Innovation",
                description: "Stay ahead with our innovative approach",
                icon: "💡",
              },
              {
                title: "AI-Driven Development",
                description: "Experience the power of AI in every project",
                icon: "🤖",
              },
              {
                title: "Rapid Deployment",
                description: "Swift deployment for faster results",
                icon: "🚀",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 border border-gray-800 hover:border-amber-500/30"
              >
                <div className="flex items-start mb-4">
                  <div className="text-3xl mr-4">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Client Testimonials
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              See what our clients say about us
            </p>
            <div className="mt-8">
              <button className="px-6 py-2 border border-amber-500 text-amber-400 rounded-lg hover:bg-amber-500/10 transition-colors duration-200">
                Read More
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                client: "Client 1",
                rating: 5,
                text: "Amazing experience working with CodeSquadren",
              },
              {
                client: "Client 2",
                rating: 5,
                text: "Top-notch technological solutions provided",
              },
              {
                client: "Client 3",
                rating: 5,
                text: "Highly recommended for all IT needs",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 border border-gray-800"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-yellow-500 flex items-center justify-center mr-3">
                    <span className="text-xs font-bold">
                      {testimonial.client[0]}
                    </span>
                  </div>
                  <span className="font-medium">{testimonial.client}</span>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-400">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Projects
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Explore our portfolio of innovative projects
            </p>
            <div className="mt-8">
              <button className="px-6 py-2 border border-amber-500 text-amber-400 rounded-lg hover:bg-amber-500/10 transition-colors duration-200">
                View All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Project 1",
                status: "Completed",
                icon: "😃",
                category: "Full-Stack Application",
              },
              {
                title: "Project 2",
                status: "In Progress",
                icon: "😊",
                category: "Mobile Application",
              },
              {
                title: "Project 3",
                status: "Upcoming",
                icon: "🚀",
                category: "Web Application",
              },
            ].map((project, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:translate-y-[-5px]"
              >
                <div className="h-40 bg-gradient-to-br from-gray-700/30 to-gray-800/30 flex items-center justify-center">
                  <span className="text-4xl">{project.icon}</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">{project.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        project.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : project.status === "In Progress"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{project.category}</p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/5 to-yellow-900/5"></div>

          {/* Abstract patterns */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-0 left-0 w-full h-full">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(245, 158, 11, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(245, 158, 11, 0.1) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-xl md:text-2xl font-medium mb-6">
            Explore our global presence and partners
          </h2>
          {/* Placeholder for images */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="h-32 bg-gray-800/50 rounded-lg flex items-center justify-center"
              >
                <span className="text-gray-500">Image {index}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="text-sm text-gray-500">
                © 2023 CodeSquadren. All Rights Reserved
              </p>
            </div>

            <div className="flex space-x-6">
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-amber-400 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-amber-400 transition-colors duration-200"
              >
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FuturisticCodeSquadren;
