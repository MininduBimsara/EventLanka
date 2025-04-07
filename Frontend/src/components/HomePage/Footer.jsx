import React, { useState } from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const FestiveFooter = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  // Generate confetti elements for background animation
  const generateConfetti = () => {
    const confettiElements = [];
    for (let i = 0; i < 50; i++) {
      const delay = Math.random() * 10;
      const left = Math.random() * 100;
      confettiElements.push(
        <div
          key={i}
          className="absolute bg-white rounded-full bg-opacity-20 animate-fall"
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${Math.random() * 5 + 8}s`,
          }}
        />
      );
    }
    return confettiElements;
  };

  // Back to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      // Reset subscription success message after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer
      id="gradient-sync-footer"
      className="relative w-full overflow-hidden text-white"
    >
      {/* Animated gradient background - using EXACT same gradient as other sections */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 animate-gradient-x"></div>

      {/* Animated confetti overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {generateConfetti()}
      </div>

      <div className="relative z-10 max-w-6xl px-4 py-10 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info Section */}
          <div className="space-y-4">
            <div className="transition-transform transform hover:scale-105">
              <div className="inline-flex items-center text-2xl font-bold text-white transition-colors duration-300 hover:text-yellow-300">
                EventSync
                <span className="relative ml-1">
                  <span className="absolute inset-0 bg-white rounded-full opacity-75 animate-ping"></span>
                  ✨
                </span>
              </div>
            </div>
            <h2 className="text-xl font-semibold">
              Bringing Unforgettable Events to Life! ✨
            </h2>
            <p className="text-white/90">
              We connect passionate fans with the events they love, creating
              memories that last a lifetime.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h2 className="pb-2 text-xl font-semibold border-b border-white/20">
              Quick Links
            </h2>
            <ul className="space-y-2">
              {["Home", "Browse Events", "About Us", "Contact", "FAQ"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="block transition-all duration-300 hover:translate-x-1 hover:text-yellow-300 hover:font-medium"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Stay Connected Section */}
          <div className="space-y-4">
            <h2 className="pb-2 text-xl font-semibold border-b border-white/20">
              Stay Connected
            </h2>
            <div className="flex space-x-3">
              {[
                { Icon: Facebook, color: "hover:text-blue-400" },
                { Icon: Twitter, color: "hover:text-blue-300" },
                { Icon: Instagram, color: "hover:text-pink-400" },
                { Icon: Youtube, color: "hover:text-red-500" },
              ].map(({ Icon, color }, index) => (
                <a
                  key={index}
                  href="#"
                  className={`p-2 rounded-full bg-white/10 transition-all duration-300 hover:bg-white/20 ${color} transform hover:scale-110`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
            <a
              href="#"
              className="inline-block px-4 py-2 mt-2 font-medium transition-all duration-300 rounded-full bg-white/10 hover:bg-white/20 hover:text-yellow-300"
            >
              Join Our Community
            </a>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-4">
            <h2 className="pb-2 text-xl font-semibold border-b border-white/20">
              Get Event Updates
            </h2>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Get event updates & exclusive discounts!"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 text-gray-800 transition-all duration-300 rounded-full bg-white/90 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-bold transition-all duration-300 transform rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Subscribe
              </button>
              {isSubscribed && (
                <div className="p-2 mt-2 text-center text-green-100 bg-green-600 rounded-lg animate-bounce">
                  Thanks for subscribing! ✅
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Legal & Copyright Section */}
        <div className="pt-8 mt-8 text-sm text-center border-t border-white/20">
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <span>|</span>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
          </div>
          <p>© 2025 EventSync. All Rights Reserved.</p>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="inline-flex items-center justify-center p-2 mt-4 text-white transition-all duration-300 transform rounded-full bg-white/10 hover:bg-white/20 hover:translate-y-1 hover:scale-105"
            aria-label="Back to top"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Custom animation for confetti */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(1000px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall 10s linear infinite;
        }
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </footer>
  );
};

export default FestiveFooter;
