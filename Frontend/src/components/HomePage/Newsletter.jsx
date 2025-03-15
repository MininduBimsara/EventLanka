
// Newsletter Component
const Newsletter = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl p-8 mx-auto text-center bg-gray-700 rounded-lg">
          <h3 className="mb-4 text-2xl font-bold">Join us to experience the thrill of live events and entertainment!</h3>
          <div className="flex flex-col max-w-md gap-4 mx-auto mt-8 md:flex-row">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-3 bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button className="px-6 py-3 font-bold text-black transition-colors rounded-lg bg-amber-500 hover:bg-amber-600">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
