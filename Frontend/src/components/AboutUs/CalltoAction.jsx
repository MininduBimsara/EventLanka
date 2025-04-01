export const CalltoAction = () => {
  return (
    <section className="px-4 py-24 text-white bg-gradient-to-br from-[#6622CC] via-[#A755C2] to-[#D2A1B8]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="mb-6 text-4xl font-bold md:text-5xl">
          Ready to Experience the Magic?
        </h2>
        <p className="mb-8 text-xl opacity-90">
          Join thousands of event-goers discovering their next favorite
          experience every day.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button className="px-8 py-3 text-lg font-bold text-[#6622CC] transition-all duration-300 transform bg-white rounded-full hover:shadow-lg hover:scale-105">
            Find Events
          </button>
          <button className="px-8 py-3 text-lg font-bold text-white transition-all duration-300 transform bg-transparent border-2 border-white rounded-full hover:shadow-lg hover:scale-105">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};
