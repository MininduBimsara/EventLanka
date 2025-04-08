import React, { useState, useEffect } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import axios from "axios";
import Navbar from "../../components/Common/Navbar";

const LoginRegistrationUI = () => {
  const [activeForm, setActiveForm] = useState("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);

  // Load the Google Sign-In API script
  useEffect(() => {
    // Check if the script is already loaded
    if (
      document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      )
    ) {
      setIsGoogleScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleScriptLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      // Clean up if component unmounts
      const scriptTag = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (scriptTag) {
        document.body.removeChild(scriptTag);
      }
    };
  }, []);

  // Initialize Google client
  useEffect(() => {
    if (isGoogleScriptLoaded && window.google) {
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with your Google Client ID
        callback: handleGoogleResponse,
        auto_select: false,
      });
    }
  }, [isGoogleScriptLoaded]);

  const handleGoogleSignIn = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.prompt();
    } else {
      console.error("Google Sign-In API not loaded");
      setErrorMessage(
        "Google Sign-In service is not available. Please try again later."
      );
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      // Send the ID token to your backend
      const backendResponse = await axios.post("/api/auth/google", {
        token: response.credential,
      });

      console.log("Google authentication successful", backendResponse.data);

      // Show success message
      setSuccessMessage("Authentication successful!");
      setErrorMessage("");

      // Handle successful login (e.g., redirect to dashboard, store token, etc.)
      // You would typically store the JWT token in localStorage or cookies here
      localStorage.setItem("authToken", backendResponse.data.token);

      // Redirect user to dashboard or home page after successful login
      // window.location.href = "/dashboard";
    } catch (error) {
      console.error(
        "Google authentication failed",
        error.response ? error.response.data : error.message
      );
      setErrorMessage("Google authentication failed. Please try again.");
      setSuccessMessage("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post("/api/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Login successful", response.data);
      setSuccessMessage("Login successful!");

      // Store authentication token
      localStorage.setItem("authToken", response.data.token);

      // Reset form data
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to dashboard or desired page
      // window.location.href = "/dashboard";
    } catch (error) {
      console.error(
        "Login failed",
        error.response ? error.response.data : error.message
      );
      setErrorMessage(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/api/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
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
      setErrorMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const switchForm = (form) => {
    setSuccessMessage("");
    setErrorMessage("");
    setActiveForm(form);
  };

  return (
    <>
      <Navbar />
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
          <div className="mb-6 text-center">
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
            <div className="p-3 mb-4 text-center text-green-700 bg-green-100 rounded-md">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 mb-4 text-center text-red-700 bg-red-100 rounded-md">
              {errorMessage}
            </div>
          )}

          {/* Login Form */}
          <div
            className={`transition-opacity duration-300 ${
              activeForm === "login" ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center w-full px-4 py-3 mb-4 font-medium text-gray-700 transition-all duration-300 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Sign in with Google
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

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
            {/* Google Sign-Up Button */}
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center w-full px-4 py-3 mb-4 font-medium text-gray-700 transition-all duration-300 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

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
    </>
  );
};

export default LoginRegistrationUI;
