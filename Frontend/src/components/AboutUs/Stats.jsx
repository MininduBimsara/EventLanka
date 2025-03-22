
const Stats = ({counters}) => {
  return (
    <section id="stats-section" className="px-4 py-16 text-white bg-indigo-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
          <div className="p-8 transition-all duration-300 bg-indigo-800 bg-opacity-50 rounded-xl hover:transform hover:scale-105">
            <div className="mb-2 text-4xl font-bold md:text-5xl">
              {counters.events.toLocaleString()}+
            </div>
            <div className="text-xl text-indigo-200">Events Monthly</div>
          </div>
          <div className="p-8 transition-all duration-300 bg-indigo-800 bg-opacity-50 rounded-xl hover:transform hover:scale-105">
            <div className="mb-2 text-4xl font-bold md:text-5xl">
              {counters.users.toLocaleString()}+
            </div>
            <div className="text-xl text-indigo-200">Happy Attendees</div>
          </div>
          <div className="p-8 transition-all duration-300 bg-indigo-800 bg-opacity-50 rounded-xl hover:transform hover:scale-105">
            <div className="mb-2 text-4xl font-bold md:text-5xl">
              {counters.tickets.toLocaleString()}+
            </div>
            <div className="text-xl text-indigo-200">Tickets Sold</div>
          </div>
        </div>
      </div>
    </section>
  );
}; 

export default Stats;