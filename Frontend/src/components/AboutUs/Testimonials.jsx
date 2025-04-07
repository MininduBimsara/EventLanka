export const Testimonials = ({ testimonials, activeTestimonial }) => {
  return (
    <section className="px-4 py-24 text-white bg-gradient-to-b from-[#935de4] via-[#B07C9E] to-[#935de4]">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-16 text-4xl font-bold text-center md:text-5xl">
          What Our Users Say
        </h2>

        <div className="relative h-64">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`absolute w-full transition-all duration-500 ${
                index === activeTestimonial
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-full"
              }`}
            >
              <div className="p-8 text-center bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl">
                <p className="mb-6 text-xl italic">"{testimonial.quote}"</p>
                <div className="text-lg font-bold">{testimonial.name}</div>
                <div className="text-[#D2A1B8]">{testimonial.event}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full mx-1 ${
                index === activeTestimonial
                  ? "bg-white"
                  : "bg-white bg-opacity-30"
              }`}
              onClick={() => setActiveTestimonial(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
