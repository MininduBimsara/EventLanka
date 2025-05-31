import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Features = ({ features }) => {
  const navigate = useNavigate();
  return (
    <section className="select-none px-4 py-20 bg-gradient-to-b from-[#D2A1B8] to-[#935de4]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-slate-800 md:text-5xl">
            Why Choose EventLanka
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-slate-600">
            Discover the advantages that make us Sri Lanka's premier event
            management platform
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 transition-all duration-300 bg-white border group border-slate-200 rounded-2xl hover:shadow-xl hover:border-slate-300 hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 text-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="mb-3 text-xl font-semibold transition-colors text-slate-800 group-hover:text-blue-600">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/25"
            onClick={() => navigate("/eventbrowsing")}
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <p className="mt-4 text-sm text-slate-900">
            Join thousands of satisfied customers
          </p>
        </div>
      </div>
    </section>
  );
};
