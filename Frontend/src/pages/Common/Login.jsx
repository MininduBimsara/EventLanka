// 1. Main Login Container (Login.jsx) - Updated with responsive design
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Common/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../Redux/Thunks/authThunks";
import { useNavigate } from "react-router-dom";
import { googleAuth } from "../../Redux/Thunks/googleAuththunks";
import { validateForm } from "../../Utils/Common/loginFormValidation";
import LeftSideArtwork from "../../components/Common/Login/LeftSideArtwork";
import LoginForm from "../../components/Common/Login/LoginForm";
import RegistrationForm from "../../components/Common/Login/RegistrationForm";
import GoogleAuthHandler from "../../components/Common/Login/GoogleAuthHandler";
import MessageDisplay from "../../components/Common/Login/MessageDisplay";

const LoginRegistrationUI = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const [activeForm, setActiveForm] = useState("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    profileImage: null,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
      profileImage: null,
    });
    setImagePreview(null);
    setFormErrors({});
  };

  const switchForm = (form) => {
    setSuccessMessage("");
    setErrorMessage("");
    setFormErrors({});
    setActiveForm(form);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const errors = validateForm(formData, true);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    dispatch(loginUser({ email: formData.email, password: formData.password }))
      .unwrap()
      .then(() => {
        setSuccessMessage("Login successful!");
        resetForm();
        navigate("/");
      })
      .catch((error) => {
        setErrorMessage(
          error.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
      });
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const errors = validateForm(formData, false);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

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
      .then(() => {
        setSuccessMessage("Registration successful!");
        resetForm();
        setTimeout(() => {
          setSuccessMessage("");
          setActiveForm("login");
        }, 2000);
      })
      .catch((err) => {
        setErrorMessage(err);
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar with fixed positioning to prevent overlap */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main content area with proper spacing from navbar */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[calc(100vh-80px)]">
        <div className="w-full mx-auto max-w-7xl">
          {/* Responsive card container */}
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden min-h-[70vh] max-h-[90vh] flex flex-col lg:flex-row">
            {/* Left side artwork - responsive sizing */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[50%]">
              <LeftSideArtwork activeForm={activeForm} />
            </div>

            {/* Right side form - responsive sizing */}
            <div className="flex-1 lg:w-[55%] xl:w-[50%] flex items-center justify-center p-6 sm:p-8 lg:p-12">
              <div className="w-full max-w-lg">
                {/* Header section */}
                <div className="mb-6 text-center lg:mb-8">
                  <h1 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
                    {activeForm === "login" ? "Login" : "Create Account"}
                  </h1>
                  <p className="text-sm text-gray-600 sm:text-base">
                    {activeForm === "login"
                      ? "Welcome back! Please sign in to your account"
                      : "Fill up the form to create your account"}
                  </p>
                </div>

                {/* Messages */}
                <MessageDisplay
                  successMessage={successMessage}
                  errorMessage={errorMessage}
                />

                {/* Google Auth */}
                <GoogleAuthHandler
                  activeForm={activeForm}
                  onSuccess={() => {
                    setSuccessMessage("Google authentication successful!");
                    navigate("/");
                  }}
                  onError={(error) => setErrorMessage(error)}
                />

                {/* Forms */}
                <div className="overflow-y-auto max-h-[60vh] lg:max-h-none">
                  {activeForm === "login" ? (
                    <LoginForm
                      formData={formData}
                      setFormData={setFormData}
                      formErrors={formErrors}
                      setFormErrors={setFormErrors}
                      onSubmit={handleLoginSubmit}
                      onSwitchForm={() => switchForm("register")}
                      navigate={navigate}
                    />
                  ) : (
                    <RegistrationForm
                      formData={formData}
                      setFormData={setFormData}
                      formErrors={formErrors}
                      setFormErrors={setFormErrors}
                      imagePreview={imagePreview}
                      setImagePreview={setImagePreview}
                      onSubmit={handleRegistrationSubmit}
                      onSwitchForm={() => switchForm("login")}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegistrationUI;
