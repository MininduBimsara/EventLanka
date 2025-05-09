import React, { useState, useEffect } from "react";
import { Mail, Lock, User, ArrowRight, Image as ImageIcon } from "lucide-react";
import Navbar from "../../components/Common/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../Redux/Slicers/AuthSlice";
import { useNavigate } from "react-router-dom";
import { googleAuth } from "../../Redux/Slicers/GoogleAuthSlice";


const LoginRegistrationUI = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
    profileImage: null,
  });
  
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isGoogleInitialized, setIsGoogleInitialized] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  // Load the Google Identity Services API script
  useEffect(() => {
    // Don't load if already loaded
    if (
      document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      )
    ) {
      setIsGoogleInitialized(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => initializeGoogleSignIn();

    document.body.appendChild(script);

    return () => {
      const scriptElement = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (scriptElement) document.body.removeChild(scriptElement);
    };
  }, []);

  // Initialize Google Sign-In
const initializeGoogleSignIn = () => {
  if (window.google) {
    try {
      window.google.accounts.id.initialize({
        client_id:
          "220678971388-jevcp58ug9v8tsuro8jd00qd45sbvad5.apps.googleusercontent.com",
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        // Add these new options to fix CORS issues
        ux_mode: "popup",
        context: "signin",
        // Add an advanced option to allow the credential cookie
        // use_fedcm_for_prompt: false,
      });

      // Render the Google Sign-In buttons
      if (document.getElementById("google-signin-button-login")) {
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button-login"),
          {
            theme: "outline",
            size: "large",
            text: "signin_with",
            width: 270,
            type: "standard",
          }
        );
      }

      if (document.getElementById("google-signin-button-register")) {
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button-register"),
          {
            theme: "outline",
            size: "large",
            text: "signup_with",
            width: 270,
            type: "standard",
          }
        );
      }

      setIsGoogleInitialized(true);
    } catch (error) {
      console.error("Error initializing Google Sign-In:", error);
    }
  }
};

  // Handle the credential response from Google
  const handleGoogleCredentialResponse = (response) => {
    if (response && response.credential) {
      // Dispatch the action to authenticate with the backend
      dispatch(googleAuth(response.credential))
        .unwrap()
        .then((userData) => {
          // console.log("Google authentication successful:", userData);
          setSuccessMessage("Google authentication successful!");
          navigate("/"); // Redirect to home page
        })
        .catch((error) => {
          console.error("Google authentication failed:", error);
          setErrorMessage(
            error.message ||
              "Failed to authenticate with Google. Please try again."
          );
        });
    }
  };

  // For the One-Tap sign-in prompt
  const showGoogleOneTap = () => {
    if (window.google && isGoogleInitialized) {
      window.google.accounts.id.prompt();
    }
  };

  // Show the One Tap prompt after a delay
  useEffect(() => {
    if (isGoogleInitialized) {
      // Optional: Delay the prompt to ensure a good user experience
      const timeoutId = setTimeout(() => {
        showGoogleOneTap();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [isGoogleInitialized]);

  // Re-initialize Google buttons when the form changes
  useEffect(() => {
    if (isGoogleInitialized && window.google) {
      // Give DOM time to update before re-rendering buttons
      setTimeout(() => {
        initializeGoogleSignIn();
      }, 100);
    }
  }, [activeForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));

      // Create preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Dispatch the loginUser thunk
    dispatch(loginUser({ email: formData.email, password: formData.password }))
      .unwrap()
      .then((data) => {
        // console.log("Login successful", data);
        setSuccessMessage("Login successful!");

        // Reset form data
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "user",
          profileImage: null,
        });
        setImagePreview(null);
        navigate("/");
      })
      .catch((error) => {
        console.error(
          "Login failed",
          error.response ? error.response.data : error.message
        );
        setErrorMessage(
          error.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
      });
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
      // Create FormData object to handle file upload
      const registrationData = new FormData();
      registrationData.append("username", formData.username);
      registrationData.append("email", formData.email);
      registrationData.append("password", formData.password);
      registrationData.append("role", formData.role);

      if (formData.profileImage) {
        registrationData.append("profileImage", formData.profileImage);
      }

      dispatch(registerUser(registrationData))
        .unwrap()
        .then((data) => {
          // console.log("Registration successful", data);
          setSuccessMessage("Registration successful!");
          // Reset form data and switch to login form after a delay
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "user",
            profileImage: null,
          });
          setImagePreview(null);
          setTimeout(() => {
            setSuccessMessage("");
            setActiveForm("login");
          }, 2000);
        })
        .catch((err) => {
          setErrorMessage(err);
        });
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 w-full">
        {/* Left side - Creative Artwork */}
        <div className="relative hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-600 to-pink-500">
          <div className="absolute inset-0 opacity-10 bg-pattern"></div>
          <div className="flex flex-col items-center justify-center w-full p-12 text-white">
            {/* Event/Festival Illustration */}
            <div className="w-3/4 mb-12">
              <img
                src="/api/placeholder/600/400"
                alt="Events illustration"
                className="w-full drop-shadow-xl"
              />
            </div>

            {/* Branding and tagline */}
            <div className="text-center">
              <h2 className="mb-6 text-3xl font-bold">
                {activeForm === "login"
                  ? "Welcome Back to EventHorizon"
                  : "Join the EventHorizon Community"}
              </h2>
              <p className="text-xl">
                "Discover, Connect, and Experience Amazing Events Together"
              </p>
            </div>

            {/* Features list */}
            <div className="mt-10">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-white/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  Discover trending events near you
                </li>
                <li className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-white/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  Easy ticket booking & management
                </li>
                <li className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-white/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  Host your own events & conferences
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right side - Login/Registration Form */}
        <div className="flex items-center justify-center w-full p-6 md:w-1/2">
          <div className="w-full max-w-md">
            {/* Form Header */}
            <div className="mb-6 text-center">
              <h2 className="mt-20 text-3xl font-bold text-gray-800">
                {activeForm === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="mt-2 text-gray-600">
                {activeForm === "login"
                  ? "Sign in to access your event dashboard"
                  : "Register to discover and manage amazing events"}
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
                activeForm === "login" ? "block" : "hidden"
              }`}
            >
              {/* Google Sign-In Button */}
              <div
                id="google-signin-button-login"
                className="flex justify-center my-4"
              ></div>

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
                  className="flex items-center justify-center w-full px-4 py-3 font-bold text-white transition-all duration-300 rounded-md shadow-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
              className={`transition-opacity mt-20 duration-300 ${
                activeForm === "register" ? "block" : "hidden"
              }`}
            >
              {/* Google Sign-Up Button */}
              <div
                id="google-signin-button-register"
                className="flex justify-center my-4"
              ></div>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <form onSubmit={handleRegistrationSubmit}>
                {/* Two-column layout */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Username */}
                    <div>
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
                          className="w-full p-2 pl-10 bg-white border border-gray-200 rounded-md focus:border-purple-500 focus:outline-none"
                          placeholder="Choose a username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
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
                          className="w-full p-2 pl-10 bg-white border border-gray-200 rounded-md focus:border-purple-500 focus:outline-none"
                          placeholder="Your email address"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* I want to / Role */}
                    <div>
                      <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                        htmlFor="register-role"
                      >
                        I want to
                      </label>
                      <div className="relative">
                        <select
                          id="register-role"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full p-2 bg-white border border-gray-200 rounded-md focus:border-purple-500 focus:outline-none"
                          required
                        >
                          <option value="user">Attend Events</option>
                          <option value="organizer">Organize Events</option>
                          <option value="admin">Manage the Platform</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Password */}
                    <div>
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
                          className="w-full p-2 pl-10 bg-white border border-gray-200 rounded-md focus:border-purple-500 focus:outline-none"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
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
                          className="w-full p-2 pl-10 bg-white border border-gray-200 rounded-md focus:border-purple-500 focus:outline-none"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Profile Image Upload */}
                    <div>
                      <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                        htmlFor="register-profile-image"
                      >
                        Profile Image
                      </label>
                      <div className="flex items-center space-x-2">
                        {imagePreview && (
                          <div className="relative w-10 h-10 overflow-hidden rounded-full">
                            <img
                              src={imagePreview}
                              alt="Profile preview"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <label
                          htmlFor="register-profile-image"
                          className="flex items-center justify-center flex-1 px-3 py-2 text-sm text-gray-700 transition-all duration-300 bg-white border border-gray-200 rounded-md cursor-pointer focus:border-purple-500 hover:bg-gray-50"
                        >
                          <ImageIcon size={16} className="mr-2 text-gray-400" />
                          {formData.profileImage
                            ? "Change Image"
                            : "Upload Image"}
                        </label>
                        <input
                          id="register-profile-image"
                          name="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Create Account Button - Full width */}
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-4 py-3 mt-6 font-bold text-white transition-all duration-300 rounded-md shadow-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
      </div>
    </div>
  );
};

export default LoginRegistrationUI;
