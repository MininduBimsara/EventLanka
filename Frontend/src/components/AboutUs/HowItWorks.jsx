const HowItWorks = ({howItWorks}) => {
  return (
    <section className="px-4 py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-16 text-4xl font-bold text-center text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          How It Works
        </h2>

        <div className="grid gap-6 md:grid-cols-4">
          {howItWorks.map((step, index) => (
            <div key={index} className="relative">
              {index < howItWorks.length - 1 && (
                <div className="absolute z-0 hidden w-full h-1 transform -translate-x-1/2 md:block top-12 left-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              )}
              <div className="relative z-10 p-8 transition-all duration-300 bg-white border-2 border-transparent shadow-lg rounded-xl hover:transform hover:scale-105 hover:border-indigo-200">
                <div className="inline-flex items-center justify-center p-3 mb-4 text-white rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                  {step.icon}
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;