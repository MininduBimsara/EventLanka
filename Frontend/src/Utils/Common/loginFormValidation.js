// utils/formValidation.js

// Input sanitization utility
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;

  return input
    .replace(/[<>]/g, "") // Remove < and > characters
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers like onclick=
    .replace(/script/gi, "") // Remove script tags
    .replace(/eval\(/gi, "") // Remove eval functions
    .trim();
};

// Validation functions
const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = sanitizeInput(email);

    if (!sanitized) return { isValid: false, message: "Email is required" };
    if (sanitized.length > 254)
      return { isValid: false, message: "Email is too long" };
    if (!emailRegex.test(sanitized))
      return { isValid: false, message: "Please enter a valid email address" };

    return { isValid: true, sanitized };
  },

  username: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    const sanitized = sanitizeInput(username);

    if (!sanitized) return { isValid: false, message: "Username is required" };
    if (sanitized.length < 3)
      return {
        isValid: false,
        message: "Username must be at least 3 characters",
      };
    if (sanitized.length > 30)
      return {
        isValid: false,
        message: "Username must be less than 30 characters",
      };
    if (!usernameRegex.test(sanitized))
      return {
        isValid: false,
        message:
          "Username can only contain letters, numbers, dots, hyphens, and underscores",
      };

    return { isValid: true, sanitized };
  },

  password: (password) => {
    if (!password) return { isValid: false, message: "Password is required" };
    if (password.length < 8)
      return {
        isValid: false,
        message: "Password must be at least 8 characters",
      };
    if (password.length > 128)
      return { isValid: false, message: "Password is too long" };
    if (!/(?=.*[a-z])/.test(password))
      return {
        isValid: false,
        message: "Password must contain at least one lowercase letter",
      };
    if (!/(?=.*[A-Z])/.test(password))
      return {
        isValid: false,
        message: "Password must contain at least one uppercase letter",
      };
    if (!/(?=.*\d)/.test(password))
      return {
        isValid: false,
        message: "Password must contain at least one number",
      };
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      return {
        isValid: false,
        message: "Password must contain at least one special character",
      };
    }

    return { isValid: true };
  },

  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword)
      return { isValid: false, message: "Please confirm your password" };
    if (password !== confirmPassword)
      return { isValid: false, message: "Passwords do not match" };

    return { isValid: true };
  },

  role: (role) => {
    const allowedRoles = ["user", "organizer", "admin"];
    const sanitized = sanitizeInput(role);

    if (!allowedRoles.includes(sanitized))
      return { isValid: false, message: "Invalid role selected" };

    return { isValid: true, sanitized };
  },

  profileImage: (file) => {
    if (!file) return { isValid: true }; // Optional field

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        message: "Only JPEG, PNG, GIF, and WebP images are allowed",
      };
    }

    if (file.size > maxSize) {
      return { isValid: false, message: "Image must be smaller than 5MB" };
    }

    return { isValid: true };
  },
};

// Validate individual field
const validateField = (name, value, allData = {}) => {
  let validation;

  switch (name) {
    case "email":
      validation = validators.email(value);
      break;
    case "username":
      validation = validators.username(value);
      break;
    case "password":
      validation = validators.password(value);
      break;
    case "confirmPassword":
      // Fixed: Pass password first, then confirmPassword
      validation = validators.confirmPassword(allData.password || "", value);
      break;
    case "role":
      validation = validators.role(value);
      break;
    case "profileImage":
      validation = validators.profileImage(value);
      break;
    default:
      validation = { isValid: true };
  }

  return validation;
};

// Validate entire form
const validateForm = (data, isLogin = false) => {
  const errors = {};
  const fieldsToValidate = isLogin
    ? ["email", "password"]
    : ["username", "email", "password", "confirmPassword", "role"];

  fieldsToValidate.forEach((field) => {
    const validation = validateField(field, data[field], data);
    if (!validation.isValid) {
      errors[field] = validation.message;
    }
  });

  // Validate profile image for registration
  if (!isLogin && data.profileImage) {
    const validation = validateField("profileImage", data.profileImage);
    if (!validation.isValid) {
      errors.profileImage = validation.message;
    }
  }

  return errors;
};

// Password strength checker utility
const getPasswordStrength = (password) => {
  const requirements = [
    { test: password.length >= 8, label: "At least 8 characters" },
    { test: /(?=.*[a-z])/.test(password), label: "One lowercase letter" },
    { test: /(?=.*[A-Z])/.test(password), label: "One uppercase letter" },
    { test: /(?=.*\d)/.test(password), label: "One number" },
    {
      test: /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password),
      label: "One special character",
    },
  ];

  const metRequirements = requirements.filter((req) => req.test);
  const strength = metRequirements.length;

  return {
    requirements,
    strength,
    percentage: (strength / requirements.length) * 100,
    label:
      strength === 0
        ? "Very Weak"
        : strength === 1
        ? "Weak"
        : strength === 2
        ? "Fair"
        : strength === 3
        ? "Good"
        : strength === 4
        ? "Strong"
        : "Very Strong",
  };
};

// Export all validation utilities
export {
  sanitizeInput,
  validators,
  validateField,
  validateForm,
  getPasswordStrength,
};
