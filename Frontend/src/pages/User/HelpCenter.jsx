import React, { useState } from "react";
import {
  FaQuestionCircle,
  FaPaperPlane,
  FaChevronDown,
  FaChevronUp,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useTheme } from "../../Context/ThemeContext";
import UserNavbar from "../../components/User/UserNavbar"; // Import the UserNavbar component

const HelpCenter = () => {
  // Use the ThemeContext instead of prop
  const { darkMode, toggleTheme } = useTheme();

  // State for contact form
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // State for FAQ accordion
  const [openFAQ, setOpenFAQ] = useState(0);

  // FAQ data
  const faqs = [
    {
      question: "How do I book tickets for an event?",
      answer:
        "You can book tickets by navigating to the event page and clicking on the 'Book Now' button. Follow the steps to select your seats, add any extras, and complete the payment process.",
    },
    {
      question: "Can I cancel my booking and get a refund?",
      answer:
        "Yes, you can cancel your booking up to 48 hours before the event and receive a full refund. For cancellations within 48 hours of the event, a 50% refund will be issued. Navigate to 'My Bookings' to cancel your reservation.",
    },
    {
      question: "How do I download my ticket?",
      answer:
        "You can download your ticket from the 'My Bookings' section. Click on the event and then the 'Download Ticket' button. You can also access your QR code for quick entry at the venue.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards, PayPal, and bank transfers. For certain events, we also offer payment plans that allow you to pay in installments.",
    },
    {
      question: "How can I update my personal information?",
      answer:
        "You can update your personal information in the 'Edit Profile' section. Here you can change your name, email, contact number, address, and password.",
    },
  ];

  // Handle contact form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    // Simulate API call with timeout
    setTimeout(() => {
      // In a real app, you would send this data to your API
      console.log("Contact form data:", contactForm);
      setSubmitSuccess(true);
      setIsSubmitting(false);

      // Reset form after successful submission
      setContactForm({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });
    }, 1000);
  };

  // Toggle FAQ accordion
  const toggleFAQ = (index) => {
    if (openFAQ === index) {
      setOpenFAQ(null);
    } else {
      setOpenFAQ(index);
    }
  };

  // Theme-based classes
  const themeClasses = {
    background: darkMode ? "bg-gray-900" : "bg-white",
    text: darkMode ? "text-white" : "text-gray-800",
    subText: darkMode ? "text-gray-400" : "text-gray-600",
    card: darkMode ? "bg-gray-800" : "bg-gray-50",
    cardHover: darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100",
    input: darkMode
      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
      : "bg-white border-gray-300 text-gray-800 focus:border-blue-500",
    border: darkMode ? "border-gray-700" : "border-gray-200",
    divider: darkMode ? "border-gray-700" : "border-gray-200",
  };

  return (
    <>
      <UserNavbar /> {/* Include the UserNavbar component */}
      <div
        className={`container px-4 pt-20 pb-16 mx-auto ${themeClasses.background} ${themeClasses.text} min-h-screen`}
      >
        {/* Dark Mode Toggle Button - Added to match EditProfile page */}
        <div className="fixed z-10 p-2 text-xl bg-white rounded-full shadow-lg top-20 right-4 dark:bg-gray-800">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <div className={`pb-8 mb-8 border-b ${themeClasses.border}`}>
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight">
            Help Center
          </h1>
          <p className={`${themeClasses.subText}`}>
            Find answers to common questions or contact our support team
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* FAQ Section */}
          <div>
            <div className="flex items-center mb-6">
              <FaQuestionCircle className="mr-3 text-blue-500" size={22} />
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`rounded-lg shadow-sm transition duration-200 ${themeClasses.card} ${themeClasses.cardHover}`}
                >
                  <button
                    className="flex items-center justify-between w-full px-6 py-4 text-left focus:outline-none"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="text-lg font-medium">{faq.question}</span>
                    <span
                      className={`p-1 rounded-full ${
                        openFAQ === index ? "bg-blue-100 text-blue-600" : ""
                      }`}
                    >
                      {openFAQ === index ? (
                        <FaChevronUp
                          className={`${
                            openFAQ === index
                              ? "text-blue-500"
                              : themeClasses.subText
                          }`}
                        />
                      ) : (
                        <FaChevronDown className={themeClasses.subText} />
                      )}
                    </span>
                  </button>

                  {openFAQ === index && (
                    <div className="px-6 pt-1 pb-5">
                      <div
                        className={`w-full h-px mb-4 ${themeClasses.border}`}
                      ></div>
                      <p className={`${themeClasses.subText} leading-relaxed`}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="flex items-center mb-6">
              <FaEnvelope className="mr-3 text-blue-500" size={20} />
              <h2 className="text-2xl font-bold">Contact Support</h2>
            </div>

            <div className={`p-6 rounded-lg shadow-sm ${themeClasses.card}`}>
              {submitSuccess ? (
                <div className="p-5 mb-6 text-green-800 bg-green-100 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h3 className="font-semibold">
                      Message Sent Successfully!
                    </h3>
                  </div>
                  <p className="mt-2 ml-8">
                    Thank you for reaching out. Our support team will get back
                    to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {submitError && (
                    <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-400 rounded">
                      <p>{submitError}</p>
                    </div>
                  )}

                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      className={`block w-full px-4 py-3 border rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.input}`}
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      className={`block w-full px-4 py-3 border rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.input}`}
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      className={`block w-full px-4 py-3 border rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.input}`}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Booking Issue">Booking Issue</option>
                      <option value="Payment Problem">Payment Problem</option>
                      <option value="Technical Support">
                        Technical Support
                      </option>
                      <option value="Feature Request">Feature Request</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      rows="5"
                      className={`block w-full px-4 py-3 border rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.input}`}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center w-full px-6 py-3 text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-75"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div
              className={`p-6 mt-6 rounded-lg shadow-sm ${themeClasses.card}`}
            >
              <h3 className="mb-4 text-xl font-medium">
                Other Ways to Reach Us
              </h3>
              <div className={`space-y-4 ${themeClasses.subText}`}>
                <div className="flex items-center">
                  <FaEnvelope className="flex-shrink-0 mr-3 text-blue-500" />
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    support@eventsbooking.com
                  </p>
                </div>
                <div className="flex items-center">
                  <FaPhone className="flex-shrink-0 mr-3 text-blue-500" />
                  <p>
                    <span className="font-medium">Phone:</span> +94 77 123 4567
                    (Mon-Fri, 9AM-5PM)
                  </p>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="flex-shrink-0 mr-3 text-blue-500" />
                  <p>
                    <span className="font-medium">Address:</span> 123 Event
                    Street, Colombo, Sri Lanka
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpCenter;
