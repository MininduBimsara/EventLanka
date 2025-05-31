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
    <form onSubmit={onSubmit}>
      <FormField
        id="login-email"
        name="email"
        type="email"
        label="Email"
        placeholder="Your email address"
        icon={Mail}
        value={formData.email}
        onChange={handleInputChange}
        error={formErrors.email}
        required
      />

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label
            className="block text-sm font-bold text-gray-700"
            htmlFor="login-password"
          >
            Password
          </label>
          <button
            type="button"
            className="text-sm text-purple-600 hover:text-purple-800"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
        <FormField
          id="login-password"
          name="password"
          type="password"
          placeholder="Your password"
          icon={Lock}
          value={formData.password}
          onChange={handleInputChange}
          error={formErrors.password}
          hideLabel
          required
        />
      </div>

      <button
        type="submit"
        className="flex items-center justify-center w-full px-4 py-3 font-bold text-white transition-all duration-300 rounded-md shadow-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        Sign In <ArrowRight size={18} className="ml-2" />
      </button>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            className="font-medium text-purple-600 hover:text-purple-800"
            onClick={onSwitchForm}
          >
            Register
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
