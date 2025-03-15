
// Hero Section Component
const HeroSection = () => {
  return (
    <div className="relative h-screen bg-gray-800">
      <div 
        className="absolute inset-0 z-10 bg-gradient-to-r from-gray-900 to-transparent"
      ></div>
      <div className="container relative z-20 flex items-center h-full px-4 mx-auto">
        <div className="w-full space-y-6 md:w-1/2">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Experience the Best Events Near You!
          </h1>
          <button className="px-8 py-3 font-bold text-black transition-colors duration-300 transform rounded-full bg-amber-500 hover:bg-amber-600 hover:scale-105">
            Browse Events
          </button>
        </div>
        <div className="hidden bg-gray-300 md:block md:w-1/2 h-3/4">
          {/* This would be your hero image */}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;