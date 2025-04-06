// File: components/contact/InfoFaqSection.jsx
import React, { useState } from "react";

const InfoFaqSection = () => {
  const [activeFaq, setActiveFaq] = useState(null);

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
  );
};

export default InfoFaqSection;
