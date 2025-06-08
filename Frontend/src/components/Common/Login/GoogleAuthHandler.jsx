// 4. Google Auth Handler Component (components/GoogleAuthHandler.jsx) - Updated with responsive design
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { googleAuth } from "../../../Redux/Thunks/googleAuththunks";

const GoogleAuthHandler = ({ activeForm, onSuccess, onError }) => {
  const [isGoogleInitialized, setIsGoogleInitialized] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
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

  const initializeGoogleSignIn = () => {
    if (window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id:
            "220678971388-jevcp58ug9v8tsuro8jd00qd45sbvad5.apps.googleusercontent.com",
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: "popup",
          context: "signin",
        });

        const buttonIds = [
          "google-signin-button-login",
          "google-signin-button-register",
        ];

        // Responsive button configurations
        const getButtonConfig = (isRegister) => ({
          theme: "outline",
          size: "large",
          text: isRegister ? "signup_with" : "signin_with",
          width: window.innerWidth < 640 ? 250 : 300, // Responsive width
          type: "standard",
        });

        buttonIds.forEach((id, index) => {
          const element = document.getElementById(id);
          if (element) {
            window.google.accounts.id.renderButton(
              element,
              getButtonConfig(index === 1)
            );
          }
        });

        setIsGoogleInitialized(true);
      } catch (error) {
        console.error("Error initializing Google Sign-In:", error);
      }
    }
  };

  const handleGoogleCredentialResponse = (response) => {
    if (response && response.credential) {
      dispatch(googleAuth(response.credential))
        .unwrap()
        .then(() => onSuccess())
        .catch((error) => {
          onError(
            error.message ||
              "Failed to authenticate with Google. Please try again."
          );
        });
    }
  };

  useEffect(() => {
    if (isGoogleInitialized && window.google) {
      setTimeout(() => {
        initializeGoogleSignIn();
      }, 100);
    }
  }, [activeForm]);

  useEffect(() => {
    if (isGoogleInitialized) {
      const timeoutId = setTimeout(() => {
        if (window.google && isGoogleInitialized) {
          window.google.accounts.id.prompt();
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [isGoogleInitialized]);

  return (
    <div className="w-full">
      <div
        id={`google-signin-button-${activeForm}`}
        className="flex justify-center w-full my-4"
      ></div>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
    </div>
  );
};

export default GoogleAuthHandler;
