import { MATCH_STATUS, MATCH_TYPE_LABELS, MATCH_STATUS_LABELS } from './constants';

/**
 * Format overs from balls to string
 * @param {number} balls - Total balls bowled
 * @returns {string} Formatted overs (e.g., "4.2")
 */
export const formatOvers = (balls) => {
  if (!balls && balls !== 0) return '0.0';
  const overs = Math.floor(balls / 6);
  const ballsInOver = balls % 6;
  return ballsInOver === 0 ? overs.toString() : `${overs}.${ballsInOver}`;
};

/**
 * Calculate run rate
 * @param {number} runs - Total runs
 * @param {number} balls - Total balls
 * @returns {string} Run rate to 2 decimal places
 */
export const calculateRunRate = (runs, balls) => {
  if (balls === 0) return '0.00';
  return ((runs / balls) * 6).toFixed(2);
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date
 */
export const formatDate = (date, includeTime = true) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Get time difference from now
 * @param {string|Date} date - Date to compare
 * @returns {string} Time difference in human readable format
 */
export const getTimeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  return 'Just now';
};

/**
 * Generate match share URL
 * @param {string} matchId - Match ID
 * @returns {string} Complete match URL
 */
export const getMatchShareUrl = (matchId) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/live/${matchId}`;
};

/**
 * Generate QR code data URL (client-side)
 * @param {string} text - Text to encode
 * @returns {Promise<string>} Data URL of QR code
 */
export const generateQRCode = async (text) => {
 
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

/**
 * Share content using Web Share API
 * @param {Object} shareData - Share data object
 * @returns {Promise<boolean>} Success status
 */
export const shareContent = async (shareData) => {
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
      return false;
    }
  }
  return false;
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
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
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} Validation result
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Validation result
 */
export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

/**
 * Format match type for display
 * @param {string} matchType - Match type
 * @returns {string} Formatted match type
 */
export const formatMatchType = (matchType) => {
  return MATCH_TYPE_LABELS[matchType] || matchType;
};

/**
 * Format match status for display
 * @param {string} status - Match status
 * @returns {string} Formatted match status
 */
export const formatMatchStatus = (status) => {
  return MATCH_STATUS_LABELS[status] || status;
};

/**
 * Get match status color
 * @param {string} status - Match status
 * @returns {string} Color class
 */
export const getMatchStatusColor = (status) => {
  const colors = {
    [MATCH_STATUS.UPCOMING]: 'text-yellow-600 bg-yellow-100',
    [MATCH_STATUS.LIVE]: 'text-red-600 bg-red-100',
    [MATCH_STATUS.COMPLETED]: 'text-green-600 bg-green-100',
    [MATCH_STATUS.ABANDONED]: 'text-gray-600 bg-gray-100'
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};

/**
 * Calculate required run rate
 * @param {Object} match - Match object
 * @returns {Object|null} RRR data or null
 */
export const calculateRequiredRunRate = (match) => {
  if (!match || match.currentInnings !== 2 || !match.innings?.[0]) {
    return null;
  }
  
  const target = match.innings[0].runs + 1;
  const currentRuns = match.innings[1]?.runs || 0;
  const ballsBowled = match.innings[1]?.balls || 0;
  const totalBalls = match.totalOvers * 6;
  const ballsRemaining = totalBalls - ballsBowled;
  
  if (ballsRemaining <= 0 || currentRuns >= target) {
    return null;
  }
  
  const runsNeeded = target - currentRuns;
  const oversRemaining = ballsRemaining / 6;
  const requiredRate = (runsNeeded / oversRemaining).toFixed(2);
  
  return {
    runsNeeded,
    ballsRemaining,
    oversRemaining: oversRemaining.toFixed(1),
    requiredRate
  };
};

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

/**
 * Parse URL parameters
 * @param {string} url - URL to parse
 * @returns {Object} URL parameters
 */
export const parseUrlParams = (url) => {
  const params = {};
  const urlObj = new URL(url, window.location.origin);
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

/**
 * Check if device is mobile
 * @returns {boolean} Mobile status
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Check if device is iOS
 * @returns {boolean} iOS status
 */
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

/**
 * Check if device is Android
 * @returns {boolean} Android status
 */
export const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

/**
 * Get device information
 * @returns {Object} Device info
 */
export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  return {
    isMobile: isMobileDevice(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isDesktop: !isMobileDevice(),
    userAgent: ua
  };
};