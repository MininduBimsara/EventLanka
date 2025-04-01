const Stats = ({ counters }) => {
  return (
    <section id="stats-section" className="px-4 py-16 text-white bg-[#B07C9E]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
          <div className="p-8 transition-all duration-300 bg-[#B07C9E] bg-opacity-50 rounded-xl hover:transform hover:scale-105">
            <div className="mb-2 text-4xl font-bold md:text-5xl">
              {counters.events.toLocaleString()}+
            </div>
            <div className="text-xl text-[#D2A1B8]">Events Monthly</div>
          </div>
          <div className="p-8 transition-all duration-300 bg-[#B07C9E] bg-opacity-50 rounded-xl hover:transform hover:scale-105">
            <div className="mb-2 text-4xl font-bold md:text-5xl">
              {counters.users.toLocaleString()}+
            </div>
            <div className="text-xl text-[#D2A1B8]">Happy Attendees</div>
          </div>
          <div className="p-8 transition-all duration-300 bg-[#B07C9E] bg-opacity-50 rounded-xl hover:transform hover:scale-105">
            <div className="mb-2 text-4xl font-bold md:text-5xl">
              {counters.tickets.toLocaleString()}+
            </div>
            <div className="text-xl text-[#D2A1B8]">Tickets Sold</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
