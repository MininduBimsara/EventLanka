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
      <div className="p-6 mb-8 bg-white border border-white bg-opacity-10 rounded-2xl backdrop-blur-md border-opacity-20">
        <h2 className="mb-6 text-3xl font-bold text-white">Get In Touch</h2>

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
  );
};

export default ContactInfoSection;
