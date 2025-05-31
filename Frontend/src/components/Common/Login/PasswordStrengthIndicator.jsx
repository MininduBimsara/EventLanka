// 8. Password Strength Indicator Component (components/PasswordStrengthIndicator.jsx)
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
        return "bg-blue-500";
      case "Strong":
        return "bg-green-500";
      case "Very Strong":
        return "bg-green-600";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600">Password strength:</span>
        <span
          className={`text-xs font-medium ${
            strength.strength >= 4
              ? "text-green-600"
              : strength.strength >= 3
              ? "text-blue-600"
              : strength.strength >= 2
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {strength.label}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor(
            strength.label
          )}`}
          style={{ width: `${strength.percentage}%` }}
        ></div>
      </div>
      <div className="mt-1 text-xs text-gray-500">
        {strength.requirements.map((req, index) => (
          <div
            key={index}
            className={`flex items-center ${
              req.test ? "text-green-600" : "text-gray-400"
            }`}
          >
            <span className="mr-1">{req.test ? "✓" : "○"}</span>
            {req.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
