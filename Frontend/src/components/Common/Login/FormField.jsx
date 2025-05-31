// 7. Form Field Component (components/FormField.jsx)
import React from "react";

const FormField = ({
  id,
  name,
  type,
  label,
  placeholder,
  icon: Icon,
  value,
  onChange,
  error,
  required = false,
  hideLabel = false,
  size = "normal",
}) => {
  const inputClass =
    size === "small"
      ? "w-full p-2 pl-10 bg-white border border-gray-200 rounded-md focus:border-blue-600 focus:outline-none transition-colors duration-200"
      : "w-full p-3 pl-10 bg-white border border-gray-200 rounded-md focus:border-blue-600 focus:outline-none transition-colors duration-200";

  return (
    <div className={size === "small" ? "" : "mb-4"}>
      {!hideLabel && (
        <label
          className="block mb-2 text-sm font-bold text-gray-700"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon size={18} className="text-gray-400" />
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          className={inputClass}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;
