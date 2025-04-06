// File: ContactUsPage.jsx (Main Component)
import React, { useState } from "react";
import HeroSection from "../../components/Contact/HeroSection";
import ContactTabs from "../../components/Contact/ContactTabs";
import ContactFormSection from "../../components/Contact/ContactFormSection";
import InfoFaqSection from "../../components/Contact/InfoFaqSection";
import ContactInfoSection from "../../components/Contact/ContactInfoSection";
import LiveChatWidget from "../../components/Contact/LiveChatWidget";
import DecorativeElements from "../../components/Contact/DecorativeElements";

const ContactUsPage = () => {
  const [activeTab, setActiveTab] = useState("form");

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#D0A2F7] via-[#8ECAE6] to-[#023E8A]">
      <DecorativeElements />
      <HeroSection />

      {/* Main Content */}
      <div className="max-w-6xl px-4 pb-20 mx-auto">
        <div className="p-6 bg-white border border-white shadow-2xl bg-opacity-10 backdrop-blur-lg rounded-3xl md:p-8 border-opacity-20">
          <ContactTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="grid gap-8 md:grid-cols-2">
            {activeTab === "form" && <ContactFormSection />}
            {activeTab === "info" && <InfoFaqSection />}
            <ContactInfoSection />
          </div>
        </div>
      </div>

      <LiveChatWidget />
    </div>
  );
};

export default ContactUsPage;
