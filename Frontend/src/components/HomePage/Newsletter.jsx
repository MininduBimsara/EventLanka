// Newsletter Component
const Newsletter = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-[#5E17EB] from-0% to-[#8244fe] to-100% mt-[-2px]">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl p-8 mx-auto text-center bg-[#a755c2] rounded-lg">
          <h3 className="mb-4 text-2xl font-bold text-white">
            Join us to experience the thrill of live events and entertainment!
          </h3>
          <div className="flex flex-col max-w-md gap-4 mx-auto mt-8 md:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-[#b07c9e] rounded-lg text-white placeholder-[#d2a1b8] focus:outline-none focus:ring-2 focus:ring-[#d2a1b8]"
            />
            <button className="px-6 py-3 font-bold text-white transition-colors rounded-lg bg-[#6622cc] hover:bg-[#b59194]">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
