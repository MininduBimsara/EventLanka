const Stats = ({ counters }) => {
  return (
    <section
      id="stats-section"
      className="select-none px-4 py-20 text-white bg-gradient-to-b from-[#6c36bd] from-0% to-[#06a9f5]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Trusted by Thousands
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-white/80">
            Join a growing community of event organizers and attendees across
            Sri Lanka
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
          <div className="p-8 transition-all duration-300 border group bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl hover:bg-white/15 hover:transform hover:scale-105 hover:shadow-2xl">
            <div className="mb-3 text-4xl font-bold text-white md:text-5xl">
              {counters.events.toLocaleString()}+
            </div>
            <div className="mb-2 text-lg font-medium text-white/90">
              Events Monthly
            </div>
            <div className="text-sm text-white/70">
              Successful events hosted every month
            </div>
          </div>

          <div className="p-8 transition-all duration-300 border group bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl hover:bg-white/15 hover:transform hover:scale-105 hover:shadow-2xl">
            <div className="mb-3 text-4xl font-bold text-white md:text-5xl">
              {counters.users.toLocaleString()}+
            </div>
            <div className="mb-2 text-lg font-medium text-white/90">
              Happy Attendees
            </div>
            <div className="text-sm text-white/70">
              Satisfied customers across the island
            </div>
          </div>

          <div className="p-8 transition-all duration-300 border group bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl hover:bg-white/15 hover:transform hover:scale-105 hover:shadow-2xl">
            <div className="mb-3 text-4xl font-bold text-white md:text-5xl">
              {counters.tickets.toLocaleString()}+
            </div>
            <div className="mb-2 text-lg font-medium text-white/90">
              Tickets Sold
            </div>
            <div className="text-sm text-white/70">
              Seamless transactions processed
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-white/70">
            Statistics updated in real-time • Growing every day
          </p>
        </div>
      </div>
    </section>
  );
};

export default Stats;
