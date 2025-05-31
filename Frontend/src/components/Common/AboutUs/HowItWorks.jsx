const HowItWorks = ({ howItWorks }) => {
  return (
    <section className="select-none px-4 py-24 bg-gradient-to-b from-[#06a9f5] from-0% via-[#038bca] to-[#D0A2F7]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            How It Works
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-white/80">
            Get started with EventLanka in four simple steps
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {howItWorks.map((step, index) => (
            <div key={index} className="relative">
              {index < howItWorks.length - 1 && (
                <div className="absolute z-0 hidden w-8 h-1 transform rounded-full md:block top-12 left-full bg-gradient-to-r from-white/60 to-white/30"></div>
              )}
              <div className="relative z-10 group">
                <div className="p-8 transition-all duration-300 border shadow-xl bg-white/95 backdrop-blur-sm border-white/30 rounded-2xl hover:bg-white hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center justify-center p-4 mb-6 text-white transition-shadow duration-300 shadow-lg rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 group-hover:shadow-xl">
                      {step.icon}
                    </div>
                    <div className="mb-2 text-sm font-semibold tracking-wider text-blue-600 uppercase">
                      Step {index + 1}
                    </div>
                    <h3 className="mb-4 text-xl font-bold transition-colors text-slate-800 group-hover:text-blue-600">
                      {step.title}
                    </h3>
                    <p className="leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 text-white border rounded-full bg-white/20 backdrop-blur-sm border-white/30">
            <span className="text-sm font-medium">Ready to get started?</span>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default HowItWorks;
