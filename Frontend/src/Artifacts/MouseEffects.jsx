import React, { useState, useEffect, useRef, useCallback } from "react";

const MinimalisticMouseEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const trailRef = useRef([]);
  const animationFrameRef = useRef();
  const lastPositionRef = useRef({ x: 0, y: 0 });

  const updateTrail = useCallback(() => {
    setTrail([...trailRef.current]);

    // Fade out particles gradually
    trailRef.current = trailRef.current
      .map((particle) => ({
        ...particle,
        opacity: particle.opacity - 0.05,
        scale: particle.scale * 0.99,
      }))
      .filter((particle) => particle.opacity > 0.1);

    if (trailRef.current.length > 0) {
      animationFrameRef.current = requestAnimationFrame(updateTrail);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(newPosition);
      setIsActive(true);

      // Calculate velocity for subtle trail effect
      const velocity = Math.sqrt(
        Math.pow(newPosition.x - lastPositionRef.current.x, 2) +
          Math.pow(newPosition.y - lastPositionRef.current.y, 2)
      );

      // Add subtle trail dots only on movement
      if (velocity > 3 && trailRef.current.length < 8) {
        const particle = {
          id: Date.now() + Math.random(),
          x: lastPositionRef.current.x,
          y: lastPositionRef.current.y,
          opacity: 0.4,
          scale: 0.6,
        };
        trailRef.current.push(particle);
      }

      lastPositionRef.current = newPosition;

      // Start animation loop if not already running
      if (!animationFrameRef.current && trailRef.current.length > 0) {
        updateTrail();
      }
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    const handleMouseEnter = () => {
      setIsActive(true);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateTrail]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Subtle main cursor */}
      <div
        className={`absolute transition-opacity duration-200 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: mousePosition.x - 6,
          top: mousePosition.y - 6,
          transform: "translate3d(0, 0, 0)",
        }}
      >
        {/* Simple glowing dot */}
        <div className="w-3 h-3 rounded-full bg-purple-500/40 blur-sm"></div>
        <div className="absolute w-1 h-1 bg-purple-400 rounded-full inset-1"></div>
      </div>

      {/* Minimal trail dots */}
      {trail.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full bg-purple-400/60"
          style={{
            left: particle.x,
            top: particle.y,
            transform: `scale(${particle.scale})`,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default MinimalisticMouseEffect;
