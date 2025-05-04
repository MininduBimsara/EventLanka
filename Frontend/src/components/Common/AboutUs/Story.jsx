import React from "react";

export const Story = () => {
  const storyElements = [
    {
      id: 1,
      title: "The Spark",
      content:
        "It all started with a missed concert. Our founders, tired of complicated booking processes and sold-out shows, decided there had to be a better way to connect people with the events they love. In 2018, from a tiny apartment and a big dream, Festiva was born.",
      imageAlt: "The beginning",
      rotate: "rotate-3",
      containerColor: "bg-pink-400",
    },
    {
      id: 2,
      title: "Growing Together",
      content:
        "What began as a simple ticket marketplace quickly evolved into a community. We partnered with venues, artists, and event creators who shared our vision. Together, we've built more than just a platform—we've created a movement that celebrates the magic of live experiences.",
      imageAlt: "Company growth",
      rotate: "-rotate-3",
      containerColor: "bg-blue-800",
    },
    {
      id: 3,
      title: "Today and Tomorrow",
      content:
        "Now, with millions of users across the country, we're just getting started. Our vision extends beyond tickets—we're building a platform where memories are made, communities are formed, and culture thrives. As we grow, our commitment remains the same: to make every event an unforgettable experience.",
      imageAlt: "Our vision",
      rotate: "rotate-3",
      containerColor: "bg-pink-400",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      {/* Decorative Elements similar to FeaturedEvents */}
      <div className="absolute left-0 hidden w-32 h-32 transform -translate-y-12 bg-pink-100 rounded-full opacity-50 lg:block"></div>
      <div className="absolute right-0 hidden w-24 h-24 transform translate-y-12 bg-blue-100 rounded-full opacity-50 lg:block"></div>

      <div className="container px-4 mx-auto">
        {/* Section Header styled like FeaturedEvents */}
        <div className="relative mb-16 text-center">
          <h2 className="text-sm font-bold tracking-widest text-pink-500 uppercase">
            Our Journey
          </h2>
          <h3 className="mt-2 text-4xl font-bold text-blue-900">Our Story</h3>
          <div className="flex items-center justify-center mt-4">
            <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
            <div className="w-3 h-3 mx-2 bg-blue-900 rounded-full"></div>
            <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
          </div>
        </div>

        {/* Story Elements */}
        <div className="space-y-24">
          {storyElements.map((element, index) => (
            <div
              key={element.id}
              className={`grid items-center gap-12 md:grid-cols-2 ${
                index % 2 !== 0 ? "md:grid-flow-col-dense" : ""
              }`}
            >
              <div className={index % 2 !== 0 ? "md:col-start-2" : ""}>
                <div className="relative overflow-hidden transition-all duration-300 transform bg-white rounded-lg shadow-lg group hover:-translate-y-2 hover:shadow-xl">
                  {/* Top diagonal cut design similar to FeaturedEvents */}
                  <div className="absolute top-0 right-0 w-20 h-20 transform rotate-45 translate-x-8 -translate-y-8 bg-pink-400"></div>

                  {/* Image container */}
                  <div className="relative">
                    <div
                      className={`absolute inset-0 transform ${element.containerColor} rounded-lg ${element.rotate}`}
                    ></div>
                    <img
                      src="/api/placeholder/600/400"
                      alt={element.imageAlt}
                      className={`relative transition-all duration-500 transform rounded-lg ${
                        element.rotate === "rotate-3" ? "-rotate-3" : "rotate-3"
                      } hover:rotate-0`}
                    />
                  </div>
                </div>
              </div>
              <div className={index % 2 !== 0 ? "md:col-start-1" : ""}>
                <div className="p-6 transition-all duration-300 bg-white rounded-lg shadow-lg hover:shadow-xl">
                  {/* Emoji Icon Container similar to FeaturedEvents */}
                  <div className="relative mb-6 overflow-hidden">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full">
                      <span className="text-3xl">✨</span>
                      {/* Decorative element similar to logo */}
                      <div className="absolute w-10 h-4 transform border-t border-yellow-300 rounded-full rotate-12"></div>
                    </div>
                  </div>

                  <h3 className="mb-4 text-3xl font-bold text-blue-900">
                    {element.title}
                  </h3>
                  <p className="text-lg leading-relaxed text-gray-700">
                    {element.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button styled like FeaturedEvents */}
        <div className="mt-16 text-center">
          <button className="px-10 py-3 text-white transition-colors transition-transform duration-300 transform bg-blue-800 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105">
            Join Our Journey
          </button>
        </div>
      </div>
    </section>
  );
};

export default Story;
