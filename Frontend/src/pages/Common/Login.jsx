// 1. Main Login Container (Login.jsx)
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Common/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../Redux/Slicers/AuthSlice";
import { useNavigate } from "react-router-dom";
import { googleAuth } from "../../Redux/Slicers/GoogleAuthSlice";
import { validateForm } from "../../Utils/Common/loginFormValidation";
import LeftSideArtwork from "./components/LeftSideArtwork";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import GoogleAuthHandler from "./components/GoogleAuthHandler";
import MessageDisplay from "./components/MessageDisplay";

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
      <Navbar />
      <div className="flex flex-1 w-full">
        <LeftSideArtwork activeForm={activeForm} />

        <div className="flex items-center justify-center w-full p-6 md:w-1/2">
          <div className="w-full max-w-md">
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

            <MessageDisplay
              successMessage={successMessage}
              errorMessage={errorMessage}
            />

            <GoogleAuthHandler
              activeForm={activeForm}
              onSuccess={() => {
                setSuccessMessage("Google authentication successful!");
                navigate("/");
              }}
              onError={(error) => setErrorMessage(error)}
            />

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
  );
};

export default LoginRegistrationUI;
