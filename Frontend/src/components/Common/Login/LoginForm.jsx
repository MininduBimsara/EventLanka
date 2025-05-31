// 5. Login Form Component (components/LoginForm.jsx)
import React from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { validateField } from "../../../Utils/Common/loginFormValidation";
import FormField from "./FormField";

const LoginForm = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  onSubmit,
  onSwitchForm,
  navigate,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "email") {
      const validation = validateField("email", value);
      if (!validation.isValid) {
        setFormErrors((prev) => ({ ...prev, email: validation.message }));
      } else {
        setFormErrors((prev) => ({ ...prev, email: "" }));
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField
        id="login-email"
        name="email"
        type="email"
        label="Email"
        placeholder="name@company.com"
        icon={Mail}
        value={formData.email}
        onChange={handleInputChange}
        error={formErrors.email}
        required
      />

      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            className="block text-sm font-bold text-gray-700"
            htmlFor="login-password"
          >
            Password
          </label>
          <button
            type="button"
            className="text-sm transition-all duration-200 hover:underline"
            style={{ color: "#1F40AF" }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
        <FormField
          id="login-password"
          name="password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          value={formData.password}
          onChange={handleInputChange}
          error={formErrors.password}
          hideLabel
          required
        />
      </div>

      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          className="w-4 h-4 transition-colors duration-200 border-gray-300 rounded focus:ring-2"
          style={{
            accentColor: "#1F40AF",
            "--tw-ring-color": "#1F40AF",
          }}
        />
        <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
          Remember me
        </label>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-3 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
        style={{ backgroundColor: "#1F40AF" }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#1E3A8A")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#1F40AF")}
      >
        LOGIN
      </button>

      <div className="text-center">
        <span className="text-gray-600">Do not have an account yet? </span>
        <button
          type="button"
          className="font-semibold transition-all duration-200 hover:underline"
          style={{ color: "#1F40AF" }}
          onClick={onSwitchForm}
        >
          SIGN UP
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
