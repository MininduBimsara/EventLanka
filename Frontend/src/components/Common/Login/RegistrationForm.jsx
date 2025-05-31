// 6. Registration Form Component (components/RegistrationForm.jsx)
import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Image as ImageIcon } from "lucide-react";
import {
  validateField,
  getPasswordStrength,
} from "../../../Utils/Common/loginFormValidation";
import FormField from "./FormField";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

const RegistrationForm = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  imagePreview,
  setImagePreview,
  onSubmit,
  onSwitchForm,
}) => {
  const [passwordStrength, setPasswordStrength] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Password strength validation
    if (name === "password") {
      const strength = getPasswordStrength(value);
      setPasswordStrength(strength);

      const passwordValidation = validateField("password", value);
      if (!passwordValidation.isValid) {
        setFormErrors((prev) => ({
          ...prev,
          password: passwordValidation.message,
        }));
      } else {
        setFormErrors((prev) => ({ ...prev, password: "" }));
      }

      // Re-validate confirm password
      if (updatedFormData.confirmPassword) {
        const confirmValidation = validateField(
          "confirmPassword",
          updatedFormData.confirmPassword,
          { password: value }
        );
        if (!confirmValidation.isValid) {
          setFormErrors((prev) => ({
            ...prev,
            confirmPassword: confirmValidation.message,
          }));
        } else {
          setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }
      }
    }

    // Confirm password validation
    if (name === "confirmPassword") {
      const validation = validateField("confirmPassword", value, {
        password: updatedFormData.password,
      });
      if (!validation.isValid) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: validation.message,
        }));
      } else {
        setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }

    // Email validation
    if (name === "email") {
      const validation = validateField("email", value);
      if (!validation.isValid) {
        setFormErrors((prev) => ({ ...prev, email: validation.message }));
      } else {
        setFormErrors((prev) => ({ ...prev, email: "" }));
      }
    }

    // Username validation
    if (name === "username") {
      const validation = validateField("username", value);
      if (!validation.isValid) {
        setFormErrors((prev) => ({ ...prev, username: validation.message }));
      } else {
        setFormErrors((prev) => ({ ...prev, username: "" }));
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const validation = validateField("profileImage", file);

      if (!validation.isValid) {
        setFormErrors((prev) => ({
          ...prev,
          profileImage: validation.message,
        }));
        return;
      }

      setFormErrors((prev) => ({ ...prev, profileImage: "" }));
      setFormData((prev) => ({ ...prev, profileImage: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-20">
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-4">
            <FormField
              id="register-username"
              name="username"
              type="text"
              label="Username"
              placeholder="Choose a username"
              icon={User}
              value={formData.username}
              onChange={handleInputChange}
              error={formErrors.username}
              size="small"
              required
            />

            <FormField
              id="register-email"
              name="email"
              type="email"
              label="Email"
              placeholder="Your email address"
              icon={Mail}
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              size="small"
              required
            />

            <div>
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="register-role"
              >
                I want to
              </label>
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

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <FormField
                id="register-password"
                name="password"
                type="password"
                label="Password"
                placeholder="Create a password"
                icon={Lock}
                value={formData.password}
                onChange={handleInputChange}
                error={formErrors.password}
                size="small"
                required
              />
              <PasswordStrengthIndicator strength={passwordStrength} />
            </div>

            <FormField
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={formErrors.confirmPassword}
              size="small"
              required
            />

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
                  {formData.profileImage ? "Change Image" : "Upload Image"}
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
              {formErrors.profileImage && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.profileImage}
                </p>
              )}
            </div>
          </div>
        </div>

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
            type="button"
            className="font-medium text-purple-600 hover:text-purple-800"
            onClick={onSwitchForm}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
