// 8. Password Strength Indicator Component (components/PasswordStrengthIndicator.jsx) - Simplified version
import React from "react";

const PasswordStrengthIndicator = ({ strength }) => {
  if (!strength) return null;

  const getStrengthColor = (level) => {
    switch (level) {
      case "Very Weak":
        return "bg-red-500";
      case "Weak":
        return "bg-orange-500";
      case "Fair":
        return "bg-yellow-500";
      case "Good":
        return "#1F40AF"; // Using your blue color
      case "Strong":
        return "bg-green-500";
      case "Very Strong":
        return "bg-green-600";
      default:
        return "bg-gray-300";
    }
  };

  const getTextColor = (level) => {
    switch (level) {
      case "Very Weak":
        return "text-red-600";
      case "Weak":
        return "text-orange-600";
      case "Fair":
        return "text-yellow-600";
      case "Good":
        return "text-blue-600";
      case "Strong":
        return "text-green-600";
      case "Very Strong":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600">Password strength:</span>
        <span className={`text-xs font-medium ${getTextColor(strength.label)}`}>
          {strength.label}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${
            strength.label !== "Good" ? getStrengthColor(strength.label) : ""
          }`}
          style={{
            width: `${strength.percentage}%`,
            backgroundColor: strength.label === "Good" ? "#1F40AF" : undefined,
          }}
        ></div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
