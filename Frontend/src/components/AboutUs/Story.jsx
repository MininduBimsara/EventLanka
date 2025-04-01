export const Story = () => {
  return (
    <section className="px-4 py-24 bg-gradient-to-b from-white to-[#D2A1B8]">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-16 text-4xl font-bold text-center text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-[#6622CC] to-[#A755C2]">
          Our Story
        </h2>

        <div className="space-y-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="relative">
                <div className="absolute inset-0 transform bg-[#A755C2] rounded-lg rotate-3"></div>
                <img
                  src="/api/placeholder/600/400"
                  alt="The beginning"
                  className="relative transition-all duration-500 transform rounded-lg -rotate-3 hover:rotate-0"
                />
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-3xl font-bold text-[#6622CC]">
                The Spark
              </h3>
              <p className="text-lg leading-relaxed text-gray-700">
                It all started with a missed concert. Our founders, tired of
                complicated booking processes and sold-out shows, decided there
                had to be a better way to connect people with the events they
                love. In 2018, from a tiny apartment and a big dream, Festiva
                was born.
              </p>
            </div>
          </div>

          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <h3 className="mb-4 text-3xl font-bold text-[#6622CC]">
                Growing Together
              </h3>
              <p className="text-lg leading-relaxed text-gray-700">
                What began as a simple ticket marketplace quickly evolved into a
                community. We partnered with venues, artists, and event creators
                who shared our vision. Together, we've built more than just a
                platform—we've created a movement that celebrates the magic of
                live experiences.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute inset-0 transform bg-[#6622CC] rounded-lg -rotate-3"></div>
                <img
                  src="/api/placeholder/600/400"
                  alt="Company growth"
                  className="relative transition-all duration-500 transform rounded-lg rotate-3 hover:rotate-0"
                />
              </div>
            </div>
          </div>

          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="relative">
                <div className="absolute inset-0 transform bg-[#B59194] rounded-lg rotate-3"></div>
                <img
                  src="/api/placeholder/600/400"
                  alt="Our vision"
                  className="relative transition-all duration-500 transform rounded-lg -rotate-3 hover:rotate-0"
                />
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-3xl font-bold text-[#6622CC]">
                Today and Tomorrow
              </h3>
              <p className="text-lg leading-relaxed text-gray-700">
                Now, with millions of users across the country, we're just
                getting started. Our vision extends beyond tickets—we're
                building a platform where memories are made, communities are
                formed, and culture thrives. As we grow, our commitment remains
                the same: to make every event an unforgettable experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
