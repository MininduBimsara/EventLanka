import { ArrowRight } from "lucide-react";

export const Features = ({ features }) => {
  return (
    <section className="select-none px-4 py-24 bg-gradient-to-b from-[#D2A1B8] to-[#935de4]">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-16 text-4xl font-bold leading-normal pb-2 text-center text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-[#6622CC] to-[#A755C2]">
          Why Choose Festiva
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl"
            >
              <div className="p-8">
                <div className="inline-flex items-center justify-center p-3 mb-4 text-white rounded-full bg-gradient-to-br from-[#6622CC] to-[#A755C2]">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-2xl font-bold text-[#B07C9E]">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
              <div className="h-2 bg-gradient-to-r from-[#6622CC] to-[#A755C2]"></div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3 text-lg font-bold text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-[#6622CC] to-[#A755C2] hover:shadow-lg hover:scale-105 group">
            Get Started
            <ArrowRight className="inline-block ml-2 transition-transform duration-300 transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
