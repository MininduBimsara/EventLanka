import React from "react";
import { useNavigate } from "react-router-dom";

const Testimonials = ({
  testimonials,
  activeTestimonial,
  setActiveTestimonial,
}) => {
  const navigate = useNavigate();
  return (
    <section className="py-20 select-none bg-gray-50 ">
      {/* Decorative Elements similar to Story component */}
      <div className="absolute left-0 hidden w-32 h-32 transform -translate-y-12 bg-pink-100 rounded-full opacity-50 lg:block"></div>
      <div className="absolute right-0 hidden w-24 h-24 transform translate-y-12 bg-blue-100 rounded-full opacity-50 lg:block"></div>

      <div className="container px-4 mx-auto">
        {/* Section Header styled like Story component */}
        <div className="relative mb-16 text-center">
          <h2 className="text-sm font-bold tracking-widest text-pink-500 uppercase">
            Testimonials
          </h2>
          <h3 className="mt-2 text-4xl font-bold text-blue-900">
            What Our Users Say
          </h3>
          <div className="flex items-center justify-center mt-4">
            <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
            <div className="w-3 h-3 mx-2 bg-blue-900 rounded-full"></div>
            <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                index === activeTestimonial
                  ? "opacity-100 transform-none"
                  : "opacity-0 translate-x-full absolute top-0 left-0 w-full"
              }`}
            >
              <div className="p-6 transition-all duration-300 bg-white rounded-lg shadow-lg hover:shadow-xl">
                {/* Emoji Icon Container similar to Story component */}
                <div className="relative mb-6 overflow-hidden">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full">
                    <span className="text-3xl">💬</span>
                    {/* Decorative element similar to logo */}
                    <div className="absolute w-10 h-4 transform border-t border-yellow-300 rounded-full rotate-12"></div>
                  </div>
                </div>

                {/* Testimonial Content */}
                <p className="mb-6 text-xl italic text-center text-gray-700">
                  "{testimonial.quote}"
                </p>

                <div className="flex flex-col items-center justify-center">
                  <div className="relative overflow-hidden transition-all duration-300 transform bg-white rounded-full shadow-md group hover:-translate-y-1 hover:shadow-lg">
                    {/* User avatar */}
                    <img
                      src="/api/placeholder/80/80"
                      alt={testimonial.name}
                      className="object-cover w-20 h-20 rounded-full"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h4 className="text-lg font-bold text-blue-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-pink-500">{testimonial.event}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation dots - styled like Story's button */}
        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              aria-label={`View testimonial ${index + 1}`}
              className={`w-3 h-3 mx-2 rounded-full transition-all duration-300 ${
                index === activeTestimonial
                  ? "bg-blue-900"
                  : "bg-pink-400 opacity-50 hover:opacity-75"
              }`}
              onClick={() => setActiveTestimonial(index)}
            />
          ))}
        </div>

        {/* CTA Button styled like Story component */}
        <div className="mt-16 text-center">
          <button
            className="px-10 py-3 text-white transition-colors transition-transform duration-300 transform bg-blue-800 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105"
            onClick={() => navigate("/contact")}
          >
            Share Your Experience
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
