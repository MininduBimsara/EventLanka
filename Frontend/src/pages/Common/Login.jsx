import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import axios from "axios";

const LoginRegistrationUI = () => {
  const [activeForm, setActiveForm] = useState("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleLoginSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("/api/login", {
      email: formData.email,
      password: formData.password,
    });

    console.log("Login successful", response.data);
    // Handle successful login (e.g., redirect to dashboard, store token, etc.)

    // Reset form data
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  } catch (error) {
    console.error(
      "Login failed",
      error.response ? error.response.data : error.message
    );
    // Handle login failure (e.g., show error message to user)
  }
};

const handleRegistrationSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("/api/register", {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    console.log("Registration successful", response.data);
    setSuccessMessage("Registration successful!");

    // Reset form data
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    // Automatically switch to login form after successful registration
    setTimeout(() => {
      setSuccessMessage("");
      setActiveForm("login");
    }, 2000);
  } catch (error) {
    console.error(
      "Registration failed",
      error.response ? error.response.data : error.message
    );
    // Handle registration failure (e.g., show error message to user)
  }
};

  const switchForm = (form) => {
    setSuccessMessage("");
    setActiveForm(form);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Event-themed background with gradient overlay */}
      <div
        className="absolute inset-0 z-0 bg-center bg-cover"
        style={{
          backgroundImage: `url('/api/placeholder/1920/1080')`,
          filter: "blur(8px)",
        }}
      ></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-purple-900/70 to-blue-900/70"></div>

      {/* Content */}
      <div className="z-20 w-full max-w-md p-8 mx-4 transition-all duration-300 transform rounded-lg shadow-xl bg-white/90 backdrop-blur-sm">
        {/* Form Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            {activeForm === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="mt-2 text-gray-600">
            {activeForm === "login"
              ? "Sign in to access your event dashboard"
              : "Register to manage and attend events"}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-3 mb-6 text-center text-green-700 bg-green-100 rounded-md">
            {successMessage}
          </div>
        )}

        {/* Login Form */}
        <div
          className={`transition-opacity duration-300 ${
            activeForm === "login" ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="login-email"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-md focus:border-purple-500 focus:outline-none"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

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
                  onClick={() =>
                    alert("Password reset functionality would go here")
                  }
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-md focus:border-purple-500 focus:outline-none"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center w-full px-4 py-3 font-bold text-white transition-all duration-300 rounded-md shadow-md bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Sign In <ArrowRight size={18} className="ml-2" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                className="font-medium text-purple-600 hover:text-purple-800"
                onClick={() => switchForm("register")}
              >
                Register
              </button>
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div
          className={`transition-opacity duration-300 ${
            activeForm === "register" ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <form onSubmit={handleRegistrationSubmit}>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="register-username"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  id="register-username"
                  name="username"
                  type="text"
                  className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-md focus:border-purple-500 focus:outline-none"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="register-email"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-md focus:border-purple-500 focus:outline-none"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="register-password"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-md focus:border-purple-500 focus:outline-none"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="register-confirm-password"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-md focus:border-purple-500 focus:outline-none"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center w-full px-4 py-3 font-bold text-white transition-all duration-300 rounded-md shadow-md bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Create Account <ArrowRight size={18} className="ml-2" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                className="font-medium text-purple-600 hover:text-purple-800"
                onClick={() => switchForm("login")}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegistrationUI;
