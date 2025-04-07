import React, { useEffect } from "react";

// This component synchronizes gradient animations specifically for the Event Browsing page
const EventBrowsingGradientSync = () => {
  useEffect(() => {
    // Function to synchronize animation timings
    const synchronizeGradients = () => {
      // Select all gradient elements by their IDs
      const header = document.getElementById("event-browsing-header");
      const sidebar = document.getElementById("event-browsing-sidebar");
      const pagination = document.getElementById("event-pagination");
      const viewToggle = document.getElementById("event-view-toggle");
      const noEvents = document.querySelector(".overflow-hidden.rounded-xl");
      const cardHover = document.getElementsByClassName("event-card-hover");

      // Get all gradient backgrounds
      const gradientElements = [
        header?.querySelector(".animate-gradient-event"),
        sidebar?.querySelector(".animate-gradient-event"),
        pagination?.querySelector(".animate-gradient-event"),
        viewToggle?.querySelector(".animate-gradient-event"),
        noEvents?.querySelector(".animate-gradient-event"),
        // Convert HTMLCollection to array and map to get gradient elements
        ...Array.from(cardHover || []).map((card) =>
          card.querySelector(".animate-gradient-event")
        ),
      ].filter(Boolean);

      // Reset animations to start at the same time
      gradientElements.forEach((element) => {
        // Force reflow to restart the animation
        element.style.animation = "none";
        // Use setTimeout to ensure the style change has been applied
        setTimeout(() => {
          element.style.animation = "gradient-event 20s ease infinite";
        }, 10);
      });
    };

    // Run synchronization after a short delay to ensure all components have mounted
    setTimeout(synchronizeGradients, 100);

    // Optional: synchronize again if window is resized or when visibility changes
    // This helps keep them in sync when coming back to the tab
    window.addEventListener("resize", synchronizeGradients);
    document.addEventListener("visibilitychange", synchronizeGradients);

    // Additional synchronization trigger when any element with the gradient might be dynamically added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          setTimeout(synchronizeGradients, 50);
        }
      });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", synchronizeGradients);
      document.removeEventListener("visibilitychange", synchronizeGradients);
      observer.disconnect();
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default EventBrowsingGradientSync;
