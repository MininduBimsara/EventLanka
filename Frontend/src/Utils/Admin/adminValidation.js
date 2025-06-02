// Input validation and sanitization utilities
// This module provides comprehensive input validation, sanitization, and security utilities
// for form inputs, passwords, and user data processing.

const inputValidation = {
  // Sanitize input by removing/escaping potentially dangerous characters
  sanitizeInput: (input) => {
    if (typeof input !== "string") return input;

    return input
      .replace(/[<>]/g, "") // Remove < and > to prevent HTML injection
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, "") // Remove event handlers like onclick=
      .replace(/script/gi, "") // Remove script tags
      .trim();
  },

  // Phone number validation with international format support
  validatePhone: (phone) => {
    const sanitized = inputValidation.sanitizeInput(phone);
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/; // International phone format

    if (!sanitized) return { isValid: true, value: sanitized }; // Allow empty
    if (sanitized.length > 20)
      return { isValid: false, error: "Phone number too long" };
    if (!phoneRegex.test(sanitized.replace(/[\s\-\(\)]/g, ""))) {
      return { isValid: false, error: "Invalid phone number format" };
    }

    return { isValid: true, value: sanitized };
  },

  // Email validation with proper regex pattern
  validateEmail: (email) => {
    const sanitized = inputValidation.sanitizeInput(email);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!sanitized) return { isValid: false, error: "Email is required" };
    if (sanitized.length > 254)
      return { isValid: false, error: "Email address too long" };
    if (!emailRegex.test(sanitized)) {
      return { isValid: false, error: "Invalid email format" };
    }

    return { isValid: true, value: sanitized.toLowerCase() };
  },

  // Text field validation (position, department, names, etc.)
  validateTextField: (text, fieldName, maxLength = 50, required = false) => {
    const sanitized = inputValidation.sanitizeInput(text);

    if (!sanitized && required) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    if (!sanitized) return { isValid: true, value: sanitized }; // Allow empty for optional fields
    if (sanitized.length > maxLength) {
      return {
        isValid: false,
        error: `${fieldName} must be less than ${maxLength} characters`,
      };
    }

    // Only allow alphanumeric, spaces, and common punctuation
    const allowedChars = /^[a-zA-Z0-9\s\-\.\,\&]+$/;
    if (!allowedChars.test(sanitized)) {
      return {
        isValid: false,
        error: `${fieldName} contains invalid characters`,
      };
    }

    return { isValid: true, value: sanitized };
  },

  // Name validation (first name, last name)
  validateName: (name, fieldName, required = true) => {
    const sanitized = inputValidation.sanitizeInput(name);

    if (!sanitized && required) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    if (!sanitized) return { isValid: true, value: sanitized };
    if (sanitized.length > 50) {
      return {
        isValid: false,
        error: `${fieldName} must be less than 50 characters`,
      };
    }
    if (sanitized.length < 2) {
      return {
        isValid: false,
        error: `${fieldName} must be at least 2 characters`,
      };
    }

    // Only allow letters, spaces, hyphens, and apostrophes for names
    const nameChars = /^[a-zA-Z\s\-\']+$/;
    if (!nameChars.test(sanitized)) {
      return {
        isValid: false,
        error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`,
      };
    }

    return { isValid: true, value: sanitized };
  },

  // Password validation with comprehensive security requirements
  validatePassword: (password) => {
    if (!password) return { isValid: false, error: "Password is required" };
    if (password.length < 8)
      return {
        isValid: false,
        error: "Password must be at least 8 characters long",
      };
    if (password.length > 128)
      return { isValid: false, error: "Password is too long" };

    // Check for at least one uppercase, lowercase, number, and special character
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return {
        isValid: false,
        error:
          "Password must contain uppercase, lowercase, number, and special character",
      };
    }

    return { isValid: true, value: password };
  },

  // URL validation
  validateUrl: (url, required = false) => {
    const sanitized = inputValidation.sanitizeInput(url);

    if (!sanitized && required) {
      return { isValid: false, error: "URL is required" };
    }
    if (!sanitized) return { isValid: true, value: sanitized };

    try {
      new URL(sanitized);
      return { isValid: true, value: sanitized };
    } catch {
      return { isValid: false, error: "Invalid URL format" };
    }
  },

  // Number validation (age, price, quantity, etc.)
  validateNumber: (
    value,
    fieldName,
    min = null,
    max = null,
    required = false
  ) => {
    const sanitized = inputValidation.sanitizeInput(String(value));

    if (!sanitized && required) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    if (!sanitized) return { isValid: true, value: null };

    const num = parseFloat(sanitized);
    if (isNaN(num)) {
      return { isValid: false, error: `${fieldName} must be a valid number` };
    }

    if (min !== null && num < min) {
      return { isValid: false, error: `${fieldName} must be at least ${min}` };
    }
    if (max !== null && num > max) {
      return { isValid: false, error: `${fieldName} must be at most ${max}` };
    }

    return { isValid: true, value: num };
  },

  // Date validation
  validateDate: (dateString, fieldName, required = false) => {
    const sanitized = inputValidation.sanitizeInput(dateString);

    if (!sanitized && required) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    if (!sanitized) return { isValid: true, value: null };

    const date = new Date(sanitized);
    if (isNaN(date.getTime())) {
      return { isValid: false, error: `${fieldName} must be a valid date` };
    }

    return { isValid: true, value: date };
  },

  // Validate boolean permissions
  validatePermissions: (permissions) => {
    const validPermissionKeys = [
      "manageUsers",
      "manageEvents",
      "managePayments",
      "manageRefunds",
      "managePlatformSettings",
    ];

    const validatedPermissions = {};
    validPermissionKeys.forEach((key) => {
      validatedPermissions[key] = Boolean(permissions[key]);
    });

    return { isValid: true, value: validatedPermissions };
  },

  // Validate email notification settings
  validateEmailNotifications: (notifications) => {
    const validNotificationKeys = [
      "newUsers",
      "newEvents",
      "refundRequests",
      "systemAlerts",
    ];

    const validatedNotifications = {};
    validNotificationKeys.forEach((key) => {
      validatedNotifications[key] = Boolean(notifications[key]);
    });

    return { isValid: true, value: validatedNotifications };
  },

  // Generic array validation
  validateArray: (array, fieldName, minLength = 0, maxLength = null) => {
    if (!Array.isArray(array)) {
      return { isValid: false, error: `${fieldName} must be an array` };
    }

    if (array.length < minLength) {
      return {
        isValid: false,
        error: `${fieldName} must have at least ${minLength} items`,
      };
    }

    if (maxLength !== null && array.length > maxLength) {
      return {
        isValid: false,
        error: `${fieldName} can have at most ${maxLength} items`,
      };
    }

    return { isValid: true, value: array };
  },

  // File validation (for file uploads)
  validateFile: (file, allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
    // 5MB default
    if (!file) return { isValid: false, error: "File is required" };

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(
          ", "
        )}`,
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size too large. Maximum size: ${(
          maxSize /
          1024 /
          1024
        ).toFixed(1)}MB`,
      };
    }

    return { isValid: true, value: file };
  },

  // Validate credit card number (basic Luhn algorithm)
  validateCreditCard: (cardNumber) => {
    const sanitized = inputValidation
      .sanitizeInput(cardNumber)
      .replace(/\s/g, "");

    if (!sanitized)
      return { isValid: false, error: "Credit card number is required" };
    if (!/^\d{13,19}$/.test(sanitized)) {
      return { isValid: false, error: "Invalid credit card number format" };
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    if (sum % 10 !== 0) {
      return { isValid: false, error: "Invalid credit card number" };
    }

    return { isValid: true, value: sanitized };
  },

  // Validate multiple fields at once
  validateFields: (fields, validationRules) => {
    const errors = {};
    const validatedData = {};

    for (const [fieldName, value] of Object.entries(fields)) {
      const rules = validationRules[fieldName];
      if (!rules) continue;

      let result = { isValid: true, value };

      // Apply validation rules in order
      for (const rule of rules) {
        result = rule(value, fieldName);
        if (!result.isValid) break;
        value = result.value; // Use validated/sanitized value for next rule
      }

      if (!result.isValid) {
        errors[fieldName] = result.error;
      } else {
        validatedData[fieldName] = result.value;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      validatedData,
    };
  },
};

// Validation rule builders for common patterns
const ValidationRules = {
  required: (fieldName) => (value) => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true, value };
  },

  minLength: (min, fieldName) => (value) => {
    if (value && value.length < min) {
      return {
        isValid: false,
        error: `${fieldName} must be at least ${min} characters`,
      };
    }
    return { isValid: true, value };
  },

  maxLength: (max, fieldName) => (value) => {
    if (value && value.length > max) {
      return {
        isValid: false,
        error: `${fieldName} must be less than ${max} characters`,
      };
    }
    return { isValid: true, value };
  },

  pattern: (regex, message) => (value) => {
    if (value && !regex.test(value)) {
      return { isValid: false, error: message };
    }
    return { isValid: true, value };
  },
};

export { inputValidation, ValidationRules };
export default inputValidation;
