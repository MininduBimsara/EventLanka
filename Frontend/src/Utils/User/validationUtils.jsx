/**
 * Input sanitization utility functions
 */

/**
 * Sanitizes input by removing HTML tags and escaping dangerous characters
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";

  // Remove HTML tags and dangerous characters
  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>\"'&]/g, (char) => {
      // Escape dangerous characters
      const escapeMap = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "&": "&amp;",
      };
      return escapeMap[char];
    })
    .trim();
};

/**
 * Validation regex patterns
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[\+]?[\d\s\-\(\)]{10,15}$/,
  NAME: /^[a-zA-Z\s\-']{1,50}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  ADDRESS: /^[a-zA-Z0-9\s,.\-#]{1,100}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9\s]{1,50}$/,
};

/**
 * Individual validation functions
 */

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const validateEmail = (email) => {
  return VALIDATION_PATTERNS.EMAIL.test(email);
};

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const validatePhone = (phone) => {
  return VALIDATION_PATTERNS.PHONE.test(phone);
};

/**
 * Validates name format (allows letters, spaces, hyphens, apostrophes)
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid
 */
export const validateName = (name) => {
  return VALIDATION_PATTERNS.NAME.test(name);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - True if valid
 */
export const validatePassword = (password) => {
  return VALIDATION_PATTERNS.PASSWORD.test(password);
};

/**
 * Validates address format
 * @param {string} address - Address to validate
 * @returns {boolean} - True if valid
 */
export const validateAddress = (address) => {
  return VALIDATION_PATTERNS.ADDRESS.test(address);
};

/**
 * Validates city name (same as name validation)
 * @param {string} city - City name to validate
 * @returns {boolean} - True if valid
 */
export const validateCity = (city) => {
  return validateName(city);
};

/**
 * File validation functions
 */

/**
 * Allowed image file types
 */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

/**
 * Maximum file size (5MB in bytes)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validates image file
 * @param {File} file - File to validate
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, error: "No file selected" };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Please select a valid image file (JPEG, PNG, GIF, WebP)",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: "Image size must be less than 5MB",
    };
  }

  return { isValid: true, error: null };
};

/**
 * Field validation error messages
 */
export const VALIDATION_MESSAGES = {
  FIRST_NAME:
    "First name can only contain letters, spaces, hyphens, and apostrophes (max 50 characters)",
  LAST_NAME:
    "Last name can only contain letters, spaces, hyphens, and apostrophes (max 50 characters)",
  EMAIL: "Please enter a valid email address",
  PHONE: "Please enter a valid phone number (10-15 digits)",
  ADDRESS: "Address contains invalid characters (max 100 characters)",
  CITY: "City name can only contain letters, spaces, hyphens, and apostrophes (max 50 characters)",
  PASSWORD:
    "Password must be at least 8 characters with uppercase, lowercase, and number",
  PASSWORD_MATCH: "Passwords do not match",
  REQUIRED: "This field is required",
};

/**
 * Validates a specific field based on field name and value
 * @param {string} fieldName - Name of the field to validate
 * @param {string} value - Value to validate
 * @param {object} additionalData - Additional data for validation (e.g., password confirmation)
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validateField = (fieldName, value, additionalData = {}) => {
  if (!value || value.trim() === "") {
    return null; // Allow empty values for optional fields
  }

  switch (fieldName) {
    case "firstName":
      return validateName(value) ? null : VALIDATION_MESSAGES.FIRST_NAME;

    case "lastName":
      return validateName(value) ? null : VALIDATION_MESSAGES.LAST_NAME;

    case "email":
      return validateEmail(value) ? null : VALIDATION_MESSAGES.EMAIL;

    case "phone":
      return validatePhone(value) ? null : VALIDATION_MESSAGES.PHONE;

    case "address":
      return validateAddress(value) ? null : VALIDATION_MESSAGES.ADDRESS;

    case "city":
      return validateCity(value) ? null : VALIDATION_MESSAGES.CITY;

    case "newPassword":
      return validatePassword(value) ? null : VALIDATION_MESSAGES.PASSWORD;

    case "confirmPassword":
      if (additionalData.newPassword && value !== additionalData.newPassword) {
        return VALIDATION_MESSAGES.PASSWORD_MATCH;
      }
      return null;

    case "currentPassword":
      // For current password, we don't validate format, just that it's not empty when required
      return null;

    default:
      return null;
  }
};

/**
 * Validates multiple fields at once
 * @param {object} formData - Object containing field names and values
 * @param {array} requiredFields - Array of field names that are required
 * @returns {object} - Object containing field names as keys and error messages as values
 */
export const validateForm = (formData, requiredFields = []) => {
  const errors = {};

  // Check required fields
  requiredFields.forEach((fieldName) => {
    if (!formData[fieldName] || formData[fieldName].trim() === "") {
      errors[fieldName] = VALIDATION_MESSAGES.REQUIRED;
    }
  });

  // Validate all fields that have values
  Object.keys(formData).forEach((fieldName) => {
    if (formData[fieldName] && fieldName !== "profileImage") {
      const error = validateField(fieldName, formData[fieldName], formData);
      if (error) {
        errors[fieldName] = error;
      }
    }
  });

  return errors;
};

/**
 * Checks if form has any validation errors
 * @param {object} errors - Validation errors object
 * @returns {boolean} - True if form is valid (no errors)
 */
export const isFormValid = (errors) => {
  return Object.values(errors).every(
    (error) => error === null || error === undefined
  );
};

/**
 * Sanitizes an entire form object
 * @param {object} formData - Form data object to sanitize
 * @returns {object} - Sanitized form data
 */
export const sanitizeFormData = (formData) => {
  const sanitized = {};

  Object.keys(formData).forEach((key) => {
    if (typeof formData[key] === "string") {
      sanitized[key] = sanitizeInput(formData[key]);
    } else {
      sanitized[key] = formData[key]; // Keep non-string values as is (like File objects)
    }
  });

  return sanitized;
};

/**
 * Utility function to get field constraints for form inputs
 * @param {string} fieldName - Name of the field
 * @returns {object} - Object containing maxLength and other constraints
 */
export const getFieldConstraints = (fieldName) => {
  const constraints = {
    firstName: { maxLength: 50, type: "text" },
    lastName: { maxLength: 50, type: "text" },
    email: { maxLength: 100, type: "email" },
    phone: { maxLength: 15, type: "tel" },
    address: { maxLength: 100, type: "text" },
    city: { maxLength: 50, type: "text" },
    currentPassword: { maxLength: 128, type: "password" },
    newPassword: { maxLength: 128, type: "password" },
    confirmPassword: { maxLength: 128, type: "password" },
  };

  return constraints[fieldName] || { maxLength: 100, type: "text" };
};

/**
 * Password strength checker
 * @param {string} password - Password to check
 * @returns {object} - Object with strength level and feedback
 */
export const checkPasswordStrength = (password) => {
  if (!password) return { strength: "none", feedback: [] };

  const feedback = [];
  let score = 0;

  // Length check
  if (password.length >= 8) score += 1;
  else feedback.push("At least 8 characters");

  // Uppercase check
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("At least one uppercase letter");

  // Lowercase check
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("At least one lowercase letter");

  // Number check
  if (/\d/.test(password)) score += 1;
  else feedback.push("At least one number");

  // Special character check (bonus)
  if (/[@$!%*?&]/.test(password)) score += 1;

  const strengthLevels = {
    0: "very-weak",
    1: "weak",
    2: "fair",
    3: "good",
    4: "strong",
    5: "very-strong",
  };

  return {
    strength: strengthLevels[score],
    score,
    feedback,
    isValid: score >= 4, // At least good strength required
  };
};
