// profileValidation.js
import DOMPurify from "dompurify";

/**
 * Sanitizes input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
};

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 */
export const isValidURL = (url) => {
  if (!url) return true; // Empty URL is allowed
  try {
    const urlObj = new URL(url);
    return ["http:", "https:"].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

/**
 * Validates social media username
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid username
 */
export const isValidSocialUsername = (username) => {
  if (!username) return true; // Empty username is allowed
  const usernameRegex = /^[a-zA-Z0-9._-]{1,30}$/;
  return usernameRegex.test(username);
};

/**
 * Validates category name
 * @param {string} category - Category to validate
 * @returns {boolean} - True if valid category
 */
export const isValidCategory = (category) => {
  if (!category) return false;
  const categoryRegex = /^[a-zA-Z0-9\s&-]{1,50}$/;
  return categoryRegex.test(category);
};

/**
 * Validates organizer profile data
 * @param {Object} profile - Profile data to validate
 * @returns {Object} - Validation result with errors
 */
export const validateOrganizerProfile = (profile) => {
  const errors = {};

  // Sanitize all string inputs
  const sanitizedProfile = {
    name: sanitizeInput(profile.name),
    phone: sanitizeInput(profile.phone),
    bio: sanitizeInput(profile.bio),
    website: sanitizeInput(profile.website),
    social: {
      instagram: sanitizeInput(profile.social?.instagram || ""),
      facebook: sanitizeInput(profile.social?.facebook || ""),
      linkedin: sanitizeInput(profile.social?.linkedin || ""),
    },
    categories: profile.categories?.map((cat) => sanitizeInput(cat)) || [],
    isPublic: Boolean(profile.isPublic),
  };

  // Validate name
  if (!sanitizedProfile.name || sanitizedProfile.name.length < 2) {
    errors.name = "Name must be at least 2 characters long";
  } else if (sanitizedProfile.name.length > 100) {
    errors.name = "Name must not exceed 100 characters";
  }

  // Validate phone
  if (sanitizedProfile.phone && !isValidPhone(sanitizedProfile.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  // Validate bio
  if (sanitizedProfile.bio && sanitizedProfile.bio.length > 1000) {
    errors.bio = "Bio must not exceed 1000 characters";
  }

  // Validate website
  if (sanitizedProfile.website && !isValidURL(sanitizedProfile.website)) {
    errors.website = "Please enter a valid website URL (http:// or https://)";
  }

  // Validate social media usernames
  if (
    sanitizedProfile.social.instagram &&
    !isValidSocialUsername(sanitizedProfile.social.instagram)
  ) {
    errors.instagram = "Invalid Instagram username format";
  }

  if (
    sanitizedProfile.social.facebook &&
    !isValidSocialUsername(sanitizedProfile.social.facebook)
  ) {
    errors.facebook = "Invalid Facebook username format";
  }

  if (
    sanitizedProfile.social.linkedin &&
    !isValidSocialUsername(sanitizedProfile.social.linkedin)
  ) {
    errors.linkedin = "Invalid LinkedIn username format";
  }

  // Validate categories
  if (sanitizedProfile.categories.length > 10) {
    errors.categories = "Maximum 10 categories allowed";
  }

  sanitizedProfile.categories.forEach((category, index) => {
    if (!isValidCategory(category)) {
      errors[`category_${index}`] = `Invalid category: ${category}`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedProfile,
  };
};

/**
 * Validates a new category before adding
 * @param {string} category - Category to validate
 * @param {Array} existingCategories - Existing categories array
 * @returns {Object} - Validation result
 */
export const validateNewCategory = (category, existingCategories = []) => {
  const sanitizedCategory = sanitizeInput(category);
  const errors = {};

  if (!sanitizedCategory) {
    errors.category = "Category cannot be empty";
  } else if (!isValidCategory(sanitizedCategory)) {
    errors.category =
      "Category can only contain letters, numbers, spaces, & and - (max 50 characters)";
  } else if (existingCategories.includes(sanitizedCategory)) {
    errors.category = "Category already exists";
  } else if (existingCategories.length >= 10) {
    errors.category = "Maximum 10 categories allowed";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedCategory,
  };
};

/**
 * Validates file upload for profile image
 * @param {File} file - File to validate
 * @returns {Object} - Validation result
 */
export const validateProfileImage = (file) => {
  const errors = {};
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!file) {
    errors.file = "No file selected";
  } else {
    if (!allowedTypes.includes(file.type)) {
      errors.file = "Only JPEG, PNG, and WebP images are allowed";
    }

    if (file.size > maxSize) {
      errors.file = "File size must be less than 5MB";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Real-time validation helpers
export const validateFieldRealTime = (fieldName, value, existingData = {}) => {
  const sanitizedValue = sanitizeInput(value);

  switch (fieldName) {
    case "name":
      if (!sanitizedValue || sanitizedValue.length < 2) {
        return "Name must be at least 2 characters long";
      }
      if (sanitizedValue.length > 100) {
        return "Name must not exceed 100 characters";
      }
      break;

    case "phone":
      if (sanitizedValue && !isValidPhone(sanitizedValue)) {
        return "Please enter a valid phone number";
      }
      break;

    case "bio":
      if (sanitizedValue && sanitizedValue.length > 1000) {
        return "Bio must not exceed 1000 characters";
      }
      break;

    case "website":
      if (sanitizedValue && !isValidURL(sanitizedValue)) {
        return "Please enter a valid website URL";
      }
      break;

    case "instagram":
    case "facebook":
    case "linkedin":
      if (sanitizedValue && !isValidSocialUsername(sanitizedValue)) {
        return "Invalid username format (letters, numbers, ., _, - only)";
      }
      break;

    default:
      break;
  }

  return null; // No error
};
