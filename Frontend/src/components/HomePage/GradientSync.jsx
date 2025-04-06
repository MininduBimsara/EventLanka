import React, { useEffect } from "react";

// This component can be imported and used once in your main App/Layout
// to synchronize gradient animations across components
const GradientSync = () => {
  useEffect(() => {
    // Function to synchronize animation timings
    const synchronizeGradients = () => {
      // Select all gradient elements by their IDs
      const footer = document.querySelector("footer");
      const hero = document.getElementById("gradient-sync-hero");
      const featured = document.getElementById("gradient-sync-featured");

      // Get all gradient backgrounds
      const gradientElements = [
        footer?.querySelector(".animate-gradient-x"),
        hero?.querySelector(".animate-gradient-x"),
        featured?.querySelector(".animate-gradient-x"),
      ].filter(Boolean);

      // Reset animations to start at the same time
      gradientElements.forEach((element) => {
        // Force reflow to restart the animation
        element.style.animation = "none";
        // Use setTimeout to ensure the style change has been applied
        setTimeout(() => {
          element.style.animation = "gradient-x 15s ease infinite";
        }, 10);
      });
    };

    // Run synchronization after a short delay to ensure all components have mounted
    setTimeout(synchronizeGradients, 100);

    // Optional: synchronize again if window is resized or when visibility changes
    // This helps keep them in sync when coming back to the tab
    window.addEventListener("resize", synchronizeGradients);
    document.addEventListener("visibilitychange", synchronizeGradients);

    return () => {
      window.removeEventListener("resize", synchronizeGradients);
      document.addEventListener("visibilitychange", synchronizeGradients);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default GradientSync;
