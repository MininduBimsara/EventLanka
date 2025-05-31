import React from "react";
import aboutImg from "../../../assets/1.jpg";

const About = () => {
  return (
    <section className="relative px-4 py-24 overflow-hidden bg-white select-none ">
      {/* Keep the bubble effect but refine it to match new style */}
      <div className="absolute hidden w-64 h-64 bg-pink-400 rounded-full md:block top-40 -left-20 opacity-10 blur-3xl"></div>
      <div className="absolute hidden bg-blue-500 rounded-full w-80 h-80 md:block bottom-20 -right-20 opacity-10 blur-3xl"></div>

      <div className="max-w-6xl mx-auto">
        {/* Section Header - Match Featured Events style */}
        <div className="relative mb-16 text-center">
          <h2 className="text-sm font-bold tracking-widest text-pink-500 uppercase">
            Our Story
          </h2>
          <h3 className="mt-2 text-4xl font-bold text-blue-900">
            Where Memories Begin
          </h3>
          <div className="flex items-center justify-center mt-4">
            <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
            <div className="w-3 h-3 mx-2 bg-blue-900 rounded-full"></div>
            <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
          </div>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              Welcome to{" "}
              <span className="font-bold text-blue-900">EventLanka!</span> – where
              every ticket opens the door to unforgettable experiences. We're
              not just an event platform; we're your personal guide to a world
              of entertainment, culture, and celebration.
            </p>
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              Born from a passion for bringing people together, we've created a
              vibrant marketplace where event lovers and organizers connect.
              From intimate gallery openings to stadium-filling concerts, our
              mission is to make every event accessible, every ticket secure,
              and every experience extraordinary.
            </p>

            {/* Quote box styled like Featured Events cards */}
            <div className="relative overflow-hidden transition-all duration-300 transform bg-white rounded-lg shadow-lg group hover:-translate-y-2 hover:shadow-xl">
              {/* Top diagonal cut design */}
              <div className="absolute top-0 right-0 w-20 h-20 transform rotate-45 translate-x-8 -translate-y-8 bg-pink-400"></div>

              {/* Quote Content */}
              <div className="p-6">
                <p className="text-lg font-semibold text-blue-900">
                  "We believe that the right event can change your day, your
                  year, or sometimes even your life. That's why we're here – to
                  make those moments happen."
                </p>
              </div>

              {/* Card Footer */}
              <div className="h-2 bg-gradient-to-r from-blue-800 to-pink-400"></div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative">
              {/* Image with angular frame - similar to Featured Events */}
              <div className="relative overflow-hidden transition-all duration-300 transform bg-white rounded-lg shadow-lg group hover:-translate-y-2 hover:shadow-xl">
                {/* Top diagonal cut design */}
                <div className="absolute top-0 right-0 w-20 h-20 transform rotate-45 translate-x-8 -translate-y-8 bg-pink-400"></div>

                {/* Category tag */}
                <div className="absolute top-0 right-0 z-10 px-2 py-1 text-xs font-medium text-white bg-blue-800 rounded-bl-lg">
                  Memories
                </div>

                <img
                  src={aboutImg}
                  alt="People enjoying an event"
                  className="w-full h-auto transition-transform duration-500 transform group-hover:scale-105"
                />

                {/* Card Footer */}
                <div className="h-2 bg-gradient-to-r from-blue-800 to-pink-400"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
