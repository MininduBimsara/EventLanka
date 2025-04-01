// Hero Section Component
const HeroSection = () => {
  return (
    <div className="relative h-screen bg-gradient-to-br from-[#5E17EB] to-[#8A2BE2]">
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#5E17EB] to-transparent"></div>
      <div className="container relative z-20 flex items-center h-full px-4 mx-auto">
        <div className="w-full space-y-6 md:w-1/2">
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Experience the Best Events Near You!
          </h1>
          <button className="px-8 py-3 font-bold text-white transition-all duration-300 transform rounded-full bg-[#a755c2] hover:bg-[#b07c9e] hover:scale-105">
            Browse Events
          </button>
        </div>
        <div className="hidden md:block md:w-1/2 h-3/4 bg-[#d2a1b8]">
          {/* This would be your hero image */}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
