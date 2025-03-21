const About = () => {
  return (
    <section className="px-4 py-24 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-12 text-4xl font-bold text-center text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          Where Memories Begin
        </h2>

        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              Welcome to{" "}
              <span className="font-bold text-indigo-600">Festiva!</span> –
              where every ticket opens the door to unforgettable experiences.
              We're not just an event platform; we're your personal guide to a
              world of entertainment, culture, and celebration.
            </p>
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              Born from a passion for bringing people together, we've created a
              vibrant marketplace where event lovers and organizers connect.
              From intimate gallery openings to stadium-filling concerts, our
              mission is to make every event accessible, every ticket secure,
              and every experience extraordinary.
            </p>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-0.5 rounded-lg hover:p-1 transition-all duration-300">
              <div className="p-6 bg-white rounded-lg">
                <p className="text-lg font-semibold text-indigo-700">
                  "We believe that the right event can change your day, your
                  year, or sometimes even your life. That's why we're here – to
                  make those moments happen."
                </p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="absolute inset-0 transform rounded-lg bg-gradient-to-r from-yellow-400 to-pink-500 rotate-3"></div>
              <div className="relative p-1 transition-all duration-500 transform bg-white rounded-lg -rotate-3 hover:rotate-0">
                <img
                  src="/api/placeholder/600/400"
                  alt="People enjoying an event"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
