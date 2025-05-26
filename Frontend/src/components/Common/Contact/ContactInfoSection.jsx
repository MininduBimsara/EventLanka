// File: components/contact/ContactInfoSection.jsx
import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";

const ContactInfoSection = () => {
  return (
    <div>
      <div className="p-6 mb-8 bg-white border border-white select-none bg-opacity-10 rounded-2xl backdrop-blur-md border-opacity-20">
        <h2 className="mb-6 text-3xl font-bold text-[#2a2e60]">Get In Touch</h2>

        <div className="space-y-4">
          <div className="flex items-center text-[#2a2e60] transition-colors duration-300 group hover:text-yellow-300">
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

          <div className="flex items-center text-[#2a2e60] transition-colors duration-300 group hover:text-yellow-300">
            <div className="flex items-center justify-center w-12 h-12 mr-4 transition-all duration-300 bg-white rounded-full bg-opacity-10 group-hover:bg-white group-hover:bg-opacity-20">
              <Mail size={22} />
            </div>
            <div>
              <div className="text-sm opacity-70">Email</div>
              <a
                href="mailto:hello@ticketmagic.com"
                className="text-lg font-medium"
              >
                info@EventLanka.com
              </a>
            </div>
          </div>

          <div className="flex items-center text-[#2a2e60] transition-colors duration-300 group hover:text-yellow-300">
            <div className="flex items-center justify-center w-12 h-12 mr-4 transition-all duration-300 bg-white rounded-full bg-opacity-10 group-hover:bg-white group-hover:bg-opacity-20">
              <MapPin size={22} />
            </div>
            <div>
              <div className="text-sm opacity-70">Office Address</div>
              <address className="text-lg not-italic font-medium">
                123 Chatham Street, Colombo 1, Sri Lanka
              </address>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8">
          <h3 className="mb-4 text-lg text-[#2a2e60]">Connect With Us</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="flex items-center justify-center w-12 h-12 text-[#2a2e60] transition-all duration-300 transform bg-white rounded-full bg-opacity-10 hover:scale-110 hover:bg-gradient-to-br from-purple-600 to-pink-500 hover:rotate-6"
            >
              <Instagram />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-12 h-12 text-[#2a2e60] transition-all duration-300 transform bg-white rounded-full bg-opacity-10 hover:scale-110 hover:bg-blue-500 hover:rotate-6"
            >
              <Twitter />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-12 h-12 text-[#2a2e60] transition-all duration-300 transform bg-white rounded-full bg-opacity-10 hover:scale-110 hover:bg-blue-600 hover:rotate-6"
            >
              <Facebook />
            </a>
            {/* <a
              href="#"
              className="flex items-center justify-center w-12 h-12 text-[#2a2e60] transition-all duration-300 transform bg-white rounded-full bg-opacity-10 hover:scale-110 hover:bg-black hover:rotate-6"
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
            </a> */}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="overflow-hidden border-4 border-white shadow-lg rounded-2xl border-opacity-20">
        <div className="relative pt-0 pb-0 bg-gray-200">
          {/* <div className="flex items-center justify-center py-4 bg-purple-900 bg-opacity-20">
            <div className="flex items-center p-4 bg-white rounded-lg shadow-lg bg-opacity-90">
              <MapPin className="mr-2 text-purple-600" />
              <span className="font-medium">Our Office Location</span>
            </div>
          </div> */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.6309612219507!2d79.8439707!3d6.9346346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259242dcf61e5%3A0xdbeb4ebb15d9a12!2s83%201%2F1%20Chatham%20St%2C%20Colombo%2000100!5e0!3m2!1sen!2slk!4v1748281689329!5m2!1sen!2slk"
            width="100%"
            height="350"
            style={{ border: 0, display: "block" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Map controls"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;
