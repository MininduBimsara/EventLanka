import React, { useState } from "react";
import {
  FaQuestionCircle,
  FaPaperPlane,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const Support = () => {
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

  return (
    <div className="container px-4 pt-24 pb-16 mx-auto">
      <div className="pb-8 mb-8 border-b border-gray-700">
        <h1 className="mb-2 text-3xl font-bold">Help Center</h1>
        <p className="text-gray-500">
          Find answers to common questions or contact our support team
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* FAQ Section */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-lg shadow">
                <button
                  className="flex items-center justify-between w-full px-6 py-4 text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  {openFAQ === index ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">Contact Support</h2>

          <div className="p-6 bg-gray-800 rounded-lg shadow">
            {submitSuccess ? (
              <div className="p-4 mb-6 text-green-700 bg-green-100 border border-green-400 rounded">
                <p>
                  Thank you for your message! Our support team will get back to
                  you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {submitError && (
                  <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-400 rounded">
                    <p>{submitError}</p>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Booking Issue">Booking Issue</option>
                    <option value="Payment Problem">Payment Problem</option>
                    <option value="Technical Support">Technical Support</option>
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
                    className="block w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-75"
                  disabled={isSubmitting}
                >
                  <FaPaperPlane className="mr-2" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className="p-6 mt-6 bg-gray-800 rounded-lg shadow">
            <h3 className="mb-3 text-xl font-medium">Other Ways to Reach Us</h3>
            <div className="space-y-3 text-gray-400">
              <p>
                <strong>Email:</strong> support@eventsbooking.com
              </p>
              <p>
                <strong>Phone:</strong> +94 77 123 4567 (Mon-Fri, 9AM-5PM)
              </p>
              <p>
                <strong>Address:</strong> 123 Event Street, Colombo, Sri Lanka
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
