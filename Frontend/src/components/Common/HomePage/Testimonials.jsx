import React from "react";

const RedesignedTestimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Corporate Event Organizer",
      comment:
        "EVENTLANKA transformed our annual conference into an unforgettable experience. Their attention to detail and professionalism exceeded our expectations.",
      rating: 5,
    },
    {
      id: 2,
      name: "John Williams",
      role: "Wedding Client",
      comment:
        "From planning to execution, working with EVENTLANKA was seamless. They turned our special day into everything we dreamed of and more.",
      rating: 5,
    },
    {
      id: 3,
      name: "Maya Patel",
      role: "Charity Fundraiser",
      comment:
        "Our fundraising gala raised 40% more than last year thanks to EVENTLANKA's expertise. Their team was responsive and creative throughout.",
      rating: 5,
    },
    {
      id: 4,
      name: "David Chen",
      role: "Product Launch Manager",
      comment:
        "The product launch was flawless. EVENTLANKA handled everything from venue selection to technical production with absolute precision.",
      rating: 5,
    },
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-pink-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto">
        {/* Section heading with decorative element similar to hero */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-3">
            {/* Decorative Pink Rectangle similar to hero */}
            <div className="relative flex items-center justify-center w-16 h-8 bg-pink-400 rounded-lg">
              {/* Golden swoosh decoration */}
              <div className="absolute w-12 h-4 transform border-t border-yellow-300 rounded-full rotate-12"></div>
            </div>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-center text-blue-900">
            Client Testimonials
          </h2>
          <p className="max-w-2xl text-center text-gray-600">
            Don't just take our word for it. Here's what our clients have to say
            about their experience working with us.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col h-full p-6 transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
            >
              {/* Rating stars */}
              <div className="mb-4">{renderStars(testimonial.rating)}</div>

              {/* Testimonial content */}
              <p className="flex-grow mb-4 italic text-gray-600">
                "{testimonial.comment}"
              </p>

              {/* Profile info */}
              <div className="flex items-center mt-auto">
                <div className="flex items-center justify-center w-10 h-10 mr-3 text-white bg-blue-800 rounded-full">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="flex flex-col items-center max-w-xl p-8 mx-auto mt-12 text-center text-white bg-blue-800 rounded-lg">
          <h3 className="mb-4 text-2xl font-semibold">
            Ready to create your memorable event?
          </h3>
          <p className="mb-6">
            Let us help you bring your vision to life with our expert event
            planning services.
          </p>
          <button className="px-6 py-2 font-medium text-blue-900 transition-colors bg-pink-400 rounded-md hover:bg-pink-500">
            Contact Us Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default RedesignedTestimonials;
