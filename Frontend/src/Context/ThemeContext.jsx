// ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

export const ThemeContext = createContext({
  darkMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  // Check for saved theme preference
  const [darkMode, setDarkMode] = useState(() => {
    // First check localStorage
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      return savedTheme === "true";
    }

    // If no localStorage preference, check system preference
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  // Update localStorage and apply class when theme changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);

    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.body.style.backgroundColor = "#111827"; // dark gray background
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.body.style.backgroundColor = "#ffffff"; // white background
    }
  }, [darkMode]);

  // Also listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      // Only update if there's no localStorage setting
      if (localStorage.getItem("darkMode") === null) {
        setDarkMode(e.matches);
      }
    };

    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // For older browsers
      mediaQuery.addListener(handleChange);
    }

    // Clean up
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        // For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
