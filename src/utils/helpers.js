/**
 * Helper utilities for BusMate LK
 */

/**
 * Validates an email address format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if email format is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate a random avatar color based on user ID
 * @param {string} userId - User ID string
 * @returns {string} - Hex color code
 */
export const getAvatarColor = (userId) => {
  if (!userId) return "#007BFF"; // default primary color

  // Generate a color based on user ID hash
  const colorOptions = [
    "#4285F4",
    "#EA4335",
    "#FBBC05",
    "#34A853", // Google colors
    "#1877F2",
    "#FF6D00",
    "#7C4DFF",
    "#00BCD4", // Material colors
    "#009688",
    "#FF5722",
    "#9C27B0",
    "#673AB7", // More Material colors
  ];

  // Simple hash function
  const hash = userId.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  return colorOptions[hash % colorOptions.length];
};

/**
 * Format bus route duration
 * @param {number} minutes - Duration in minutes
 * @returns {string} - Formatted duration string
 */
export const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return "";

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 30) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + "...";
};

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Validates a password meets minimum requirements
 * @param {string} password - The password to validate
 * @returns {boolean} - True if password meets requirements
 */
export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validates a Sri Lankan phone number format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if phone format is valid
 */
export const validatePhone = (phone) => {
  // Sri Lankan mobile number format: 07XXXXXXXX or +947XXXXXXXX
  const phoneRegex = /^(?:\+94|0)7\d{8}$/;
  return phoneRegex.test(phone);
};

/**
 * Format a date object to localized string
 * @param {Date} date - Date object or timestamp
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);

  return dateObj.toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format a time value (either date object or string time)
 * @param {Date|string} time - Time to format
 * @returns {string} - Formatted time string (HH:MM AM/PM)
 */
export const formatTime = (time) => {
  if (!time) return "";

  // If it's already a string in HH:MM format
  if (typeof time === "string" && time.includes(":")) {
    return time;
  }

  // If it's a Date object or timestamp
  const dateObj = time instanceof Date ? time : new Date(time);

  return dateObj.toLocaleTimeString("en-LK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Calculate estimated arrival time based on start time and progress
 * @param {string} startTime - Base time (HH:MM format)
 * @param {number} minutesToAdd - Minutes to add
 * @returns {string} - New time in same format
 */
export const calculateEstimatedTime = (startTime, minutesToAdd) => {
  if (!startTime || typeof minutesToAdd !== "number") return "";

  const [hours, minutes] = startTime.split(":").map(Number);

  const baseDate = new Date();
  baseDate.setHours(hours, minutes, 0);

  const newDate = new Date(baseDate.getTime() + minutesToAdd * 60000);

  return `${newDate.getHours().toString().padStart(2, "0")}:${newDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Sort bus routes by route number (handles alphanumeric routes like "100A")
 * @param {Array} routes - Array of route objects
 * @returns {Array} - Sorted array
 */
export const sortRoutesByNumber = (routes) => {
  if (!Array.isArray(routes)) return [];

  return [...routes].sort((a, b) => {
    // Extract numeric and string parts
    const aMatch = a.routeNumber.match(/^(\d+)([A-Za-z]*)$/);
    const bMatch = b.routeNumber.match(/^(\d+)([A-Za-z]*)$/);

    if (!aMatch || !bMatch) return a.routeNumber.localeCompare(b.routeNumber);

    const [, aNum, aStr] = aMatch;
    const [, bNum, bStr] = bMatch;

    // Compare numeric parts first
    const numComparison = parseInt(aNum) - parseInt(bNum);
    if (numComparison !== 0) return numComparison;

    // If numeric parts are equal, compare string parts
    return aStr.localeCompare(bStr);
  });
};

/**
 * Calculate distance between two points in kilometers
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Haversine formula
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return parseFloat(distance.toFixed(2));
};

/**
 * Convert degrees to radians
 * @param {number} deg - Degrees
 * @returns {number} - Radians
 */
export const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};
