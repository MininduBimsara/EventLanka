import React, { useState, useEffect } from "react";

const MouseEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Main cursor effect */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: `translate(${mousePosition.x - 20}px, ${
            mousePosition.y - 20
          }px)`,
        }}
      >
        {/* Outer glow */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-md animate-pulse"></div>

        {/* Inner dot */}
        <div
          className="absolute w-2 h-2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg top-1/2 left-1/2"
          style={{
            boxShadow: "0 0 10px rgba(139, 92, 246, 0.6)",
          }}
        ></div>
      </div>

      {/* Trailing effect */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-40 transition-all duration-700 ease-out ${
          isVisible ? "opacity-60" : "opacity-0"
        }`}
        style={{
          transform: `translate(${mousePosition.x - 30}px, ${
            mousePosition.y - 30
          }px)`,
        }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg"></div>
      </div>

      {/* Secondary trailing effect */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-30 transition-all duration-1000 ease-out ${
          isVisible ? "opacity-40" : "opacity-0"
        }`}
        style={{
          transform: `translate(${mousePosition.x - 40}px, ${
            mousePosition.y - 40
          }px)`,
        }}
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500/15 to-cyan-500/15 blur-xl"></div>
      </div>
    </>
  );
};

export default MouseEffect;
