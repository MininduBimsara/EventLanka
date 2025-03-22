import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Twitter,
  Facebook,
  Send,
} from "lucide-react";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [activeFaq, setActiveFaq] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqItems = [
    {
      question: "How can I get a refund for my tickets?",
      answer:
        "Refunds are available up to 48 hours before the event. Simply log in to your account and visit the 'My Tickets' section to request a refund.",
    },
    {
      question: "Can I transfer my ticket to someone else?",
      answer:
        "Yes! You can transfer tickets to friends by using the 'Transfer' option in your ticket details. The recipient will receive an email with instructions.",
    },
    {
      question: "How early should I arrive at the venue?",
      answer:
        "We recommend arriving at least 30 minutes before the event starts to allow time for security checks and finding your seat.",
    },
    {
      question: "Do you offer group discounts?",
      answer:
        "Yes, we offer discounts for groups of 10 or more. Please contact our support team with your event details for a custom quote.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-purple-600 via-pink-500 to-orange-400">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-20 h-20 bg-yellow-300 rounded-full top-20 left-10 opacity-20 animate-pulse"></div>
        <div className="absolute w-32 h-32 bg-blue-300 rounded-full top-40 right-20 opacity-20 animate-ping"></div>
        <div className="absolute w-16 h-16 bg-green-300 rounded-full bottom-20 left-1/4 opacity-30 animate-bounce"></div>
        <div className="absolute w-24 h-24 bg-red-300 rounded-full top-1/3 right-1/3 opacity-20 animate-pulse"></div>
      </div>

      {/* Hero Section */}
      <div className="relative px-6 pt-20 pb-10 text-center md:px-12">
        <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl animate-pulse">
          Get in Touch & Let's Make Magic Happen!
        </h1>
        <p className="max-w-3xl mx-auto text-xl text-white md:text-2xl opacity-90">
          We're here to help you create unforgettable moments. Reach out and let
          the fun begin!
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl px-4 pb-20 mx-auto">
        <div className="p-6 bg-white border border-white shadow-2xl bg-opacity-10 backdrop-blur-lg rounded-3xl md:p-8 border-opacity-20">
          {/* Tabs */}
          <div className="flex max-w-md p-1 mx-auto mb-8 bg-white rounded-full bg-opacity-20">
            <button
              onClick={() => setActiveTab("form")}
              className={`flex-1 py-3 px-4 rounded-full transition-all duration-300 ${
                activeTab === "form"
                  ? "bg-white text-purple-700 shadow-lg"
                  : "text-white hover:bg-white hover:bg-opacity-10"
              }`}
            >
              Contact Form
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 py-3 px-4 rounded-full transition-all duration-300 ${
                activeTab === "info"
                  ? "bg-white text-purple-700 shadow-lg"
                  : "text-white hover:bg-white hover:bg-opacity-10"
              }`}
            >
              Info & FAQ
            </button>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Contact Form Section */}
            {activeTab === "form" && (
              <div className="p-6 transition-all duration-500 transform bg-white border border-white bg-opacity-10 rounded-2xl backdrop-blur-md border-opacity-20 hover:scale-102 hover:shadow-xl">
                <h2 className="mb-6 text-3xl font-bold text-white">
                  Send Us a Message
                </h2>
                <form>
                  <div className="relative mb-4 group">
                    <label className="block mb-1 text-sm text-white transition-all duration-300 group-focus-within:text-yellow-300">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 text-white placeholder-white transition-all duration-300 bg-white border border-white rounded-lg bg-opacity-10 border-opacity-30 placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="relative mb-4 group">
                    <label className="block mb-1 text-sm text-white transition-all duration-300 group-focus-within:text-yellow-300">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 text-white placeholder-white transition-all duration-300 bg-white border border-white rounded-lg bg-opacity-10 border-opacity-30 placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="relative mb-4 group">
                    <label className="block mb-1 text-sm text-white transition-all duration-300 group-focus-within:text-yellow-300">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full p-3 text-white placeholder-white transition-all duration-300 bg-white border border-white rounded-lg bg-opacity-10 border-opacity-30 placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div className="relative mb-6 group">
                    <label className="block mb-1 text-sm text-white transition-all duration-300 group-focus-within:text-yellow-300">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full p-3 text-white placeholder-white transition-all duration-300 bg-white border border-white rounded-lg bg-opacity-10 border-opacity-30 placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center w-full px-6 py-3 font-bold text-white transition-all duration-300 transform rounded-lg shadow-lg bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-xl hover:scale-105 group animate-pulse"
                  >
                    <span>Send Message</span>
                    <Send
                      size={18}
                      className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </form>
              </div>
            )}

            {/* FAQ & Info Section */}
            {activeTab === "info" && (
              <div className="p-6 bg-white border border-white bg-opacity-10 rounded-2xl backdrop-blur-md border-opacity-20">
                <h2 className="mb-6 text-3xl font-bold text-white">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqItems.map((faq, index) => (
                    <div
                      key={index}
                      className="overflow-hidden transition-all duration-300 border border-white border-opacity-20 rounded-xl hover:bg-white hover:bg-opacity-5"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="flex items-center justify-between w-full p-4 font-medium text-left text-white"
                      >
                        <span>{faq.question}</span>
                        <span
                          className={`transform transition-transform duration-300 ${
                            activeFaq === index ? "rotate-180" : ""
                          }`}
                        >
                          ▼
                        </span>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          activeFaq === index
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="p-4 pt-0 text-white text-opacity-80">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info and Map Section - Always visible */}
            <div>
              <div className="p-6 mb-8 bg-white border border-white bg-opacity-10 rounded-2xl backdrop-blur-md border-opacity-20">
                <h2 className="mb-6 text-3xl font-bold text-white">
                  Get In Touch
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center text-white transition-colors duration-300 group hover:text-yellow-300">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 transition-all duration-300 bg-white rounded-full bg-opacity-10 group-hover:bg-white group-hover:bg-opacity-20">
                      <Phone size={22} />
                    </div>
                    <div>
                      <div className="text-sm opacity-70">Phone</div>
                      <a href="tel:+1234567890" className="text-lg font-medium">
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center text-white transition-colors duration-300 group hover:text-yellow-300">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 transition-all duration-300 bg-white rounded-full bg-opacity-10 group-hover:bg-white group-hover:bg-opacity-20">
                      <Mail size={22} />
                    </div>
                    <div>
                      <div className="text-sm opacity-70">Email</div>
                      <a
                        href="mailto:hello@ticketmagic.com"
                        className="text-lg font-medium"
                      >
                        hello@ticketmagic.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center text-white transition-colors duration-300 group hover:text-yellow-300">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 transition-all duration-300 bg-white rounded-full bg-opacity-10 group-hover:bg-white group-hover:bg-opacity-20">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <div className="text-sm opacity-70">Office Address</div>
                      <address className="text-lg not-italic font-medium">
                        123 Event Street, Party City, PC 12345
                      </address>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="mt-8">
                  <h3 className="mb-4 text-lg text-white">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="flex items-center justify-center w-12 h-12 text-white transition-all duration-300 transform bg-white rounded-full bg-opacity-10 hover:scale-110 hover:bg-gradient-to-br from-purple-600 to-pink-500 hover:rotate-6"
                    >
                      <Instagram />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center w-12 h-12 text-white transition-all duration-300 transform bg-white rounded-full bg-opacity-10 hover:scale-110 hover:bg-blue-500 hover:rotate-6"
                    >
                      <Twitter />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center w-12 h-12 text-white transition-all duration-300 transform bg-white rounded-full bg-opacity-10 hover:scale-110 hover:bg-blue-600 hover:rotate-6"
                    >
                      <Facebook />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center w-12 h-12 text-white transition-all duration-300 transform bg-white rounded-full bg-opacity-10 hover:scale-110 hover:bg-black hover:rotate-6"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0v0Z"></path>
                        <path d="M12.5 9.5c.5-1.5 1.5-2 2.5-2 1.5 0 2.5 1.5 2.5 2.5 0 1.5-2.5 2.5-3 3 1 1.5 3 1.5 4 2"></path>
                        <path d="M10.5 12c-1.5 1.5-2 3.5-2 5.5 0 2 1 3 3.5 3s3.5-1 3.5-3c0-2-2-3.5-2-5.5"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="overflow-hidden border-4 border-white shadow-lg rounded-2xl border-opacity-20">
                <div className="relative h-64 pt-0 pb-0 bg-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-900 bg-opacity-20">
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg bg-opacity-90">
                      <MapPin className="mr-2 text-purple-600" />
                      <span className="font-medium">Our Office Location</span>
                    </div>
                    <div className="absolute p-2 bg-white rounded-lg shadow-lg bottom-4 right-4">
                      <img
                        src="/api/placeholder/100/30"
                        alt="Map controls placeholder"
                      />
                    </div>
                  </div>
                  <img
                    src="/api/placeholder/600/300"
                    alt="Location Map"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Widget */}
      <div className="fixed z-50 bottom-6 right-6">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="flex items-center justify-center w-16 h-16 text-white transition-all duration-300 transform rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-110 hover:rotate-6 animate-bounce"
        >
          <MessageCircle size={28} />
        </button>

        {chatOpen && (
          <div className="absolute right-0 overflow-hidden transition-all duration-300 bg-white shadow-2xl bottom-20 w-80 rounded-2xl animate-fadeIn">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-500">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 mr-3 bg-white rounded-full">
                  <MessageCircle size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Live Support</h3>
                  <p className="text-sm text-white text-opacity-80">
                    We typically reply in a few minutes
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end h-64 p-4 bg-gray-50">
              <div className="p-3 mb-3 bg-purple-100 rounded-lg rounded-bl-none max-w-3/4">
                <p className="text-sm text-purple-900">
                  Hi there! 👋 How can we help you today?
                </p>
                <p className="mt-1 text-xs text-gray-500">2:34 PM</p>
              </div>
              <div className="mt-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full py-2 pl-4 pr-12 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button className="absolute flex items-center justify-center w-8 h-8 text-white transform -translate-y-1/2 bg-purple-500 rounded-full right-2 top-1/2">
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUsPage;
