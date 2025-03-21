
const Hero = ()=>{
    return (
      <section className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={`dot-${i}-${Math.random()}`}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 5 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              <div
                className="w-2 h-2 bg-white rounded-full opacity-70"
                style={{
                  transform: `scale(${Math.random() * 2 + 0.5})`,
                }}
              ></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl px-4 mx-auto text-center">
          <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl drop-shadow-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-50">
              Celebrate Every Moment
            </span>
          </h1>
          <p className="mb-8 text-xl text-white md:text-2xl opacity-90">
            Your one-stop destination for discovering and booking the most
            exciting events in town
          </p>
          <button className="px-8 py-3 text-lg font-bold text-indigo-900 transition-all duration-300 transform bg-yellow-400 rounded-full animate-pulse hover:bg-yellow-300 hover:shadow-lg hover:scale-105">
            Explore Events
          </button>
        </div>
      </section>
    );
}

export default Hero;