// How It Works Component
const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Browse Events",
      description: "Discover a variety of events in your city.",
      icon: <div className="w-20 h-20 mb-4 bg-gray-200 rounded"></div>,
    },
    {
      id: 2,
      title: "Select Tickets",
      description: "Choose your desired event and ticket type.",
      icon: <div className="w-20 h-20 mb-4 bg-gray-200 rounded"></div>,
    },
    {
      id: 3,
      title: "Enjoy the Event",
      description: "Have a fantastic time at the event you chose.",
      icon: <div className="w-20 h-20 mb-4 bg-gray-200 rounded"></div>,
    },
  ];

  return (
    <section className="py-20 bg-gray-800">
      <div className="container px-4 mx-auto">
        <h2 className="mb-16 text-3xl font-bold text-center">How It Works</h2>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center"
            >
              {step.icon}
              <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;