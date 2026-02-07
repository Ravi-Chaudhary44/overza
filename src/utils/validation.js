import { VALIDATION_PATTERNS } from './constants';

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @param {string} confirmPassword - Confirm password (optional)
 * @returns {Object} Validation result
 */
export const validatePassword = (password, confirmPassword = null) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' };
  }
  
  if (confirmPassword !== null && password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} Validation result
 */
export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, message: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters' };
  }
  
  if (username.length > 20) {
    return { isValid: false, message: 'Username cannot exceed 20 characters' };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: true, message: '' }; // Phone is optional
  }
  
  if (!VALIDATION_PATTERNS.PHONE.test(phone)) {
    return { isValid: false, message: 'Please enter a valid 10-digit phone number' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate team name
 * @param {string} teamName - Team name to validate
 * @returns {Object} Validation result
 */
export const validateTeamName = (teamName) => {
  if (!teamName) {
    return { isValid: false, message: 'Team name is required' };
  }
  
  if (teamName.length < 2) {
    return { isValid: false, message: 'Team name must be at least 2 characters' };
  }
  
  if (teamName.length > 50) {
    return { isValid: false, message: 'Team name cannot exceed 50 characters' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate match data
 * @param {Object} matchData - Match data to validate
 * @returns {Object} Validation result
 */
export const validateMatchData = (matchData) => {
  const errors = {};
  
  // Validate team names
  const teamAValidation = validateTeamName(matchData.teamA?.name);
  if (!teamAValidation.isValid) {
    errors.teamA = teamAValidation.message;
  }
  
  const teamBValidation = validateTeamName(matchData.teamB?.name);
  if (!teamBValidation.isValid) {
    errors.teamB = teamBValidation.message;
  }
  
  // Check if team names are different
  if (matchData.teamA?.name && matchData.teamB?.name && 
      matchData.teamA.name === matchData.teamB.name) {
    errors.teams = 'Team names must be different';
  }
  
  // Validate toss
  if (!matchData.toss?.winner) {
    errors.toss = 'Toss winner is required';
  }
  
  if (!matchData.toss?.decision) {
    errors.tossDecision = 'Toss decision is required';
  }
  
  // Validate overs
  if (matchData.totalOvers) {
    const overs = parseInt(matchData.totalOvers);
    if (isNaN(overs) || overs < 1 || overs > 50) {
      errors.totalOvers = 'Overs must be between 1 and 50';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate score update
 * @param {Object} scoreData - Score data to validate
 * @returns {Object} Validation result
 */
export const validateScoreUpdate = (scoreData) => {
  const errors = {};
  
  if (!scoreData.matchId) {
    errors.matchId = 'Match ID is required';
  }
  
  if (scoreData.runs !== undefined) {
    const runs = parseInt(scoreData.runs);
    if (isNaN(runs) || runs < 0 || runs > 6) {
      errors.runs = 'Runs must be between 0 and 6';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate player data
 * @param {Object} playerData - Player data to validate
 * @returns {Object} Validation result
 */
export const validatePlayerData = (playerData) => {
  const errors = {};
  
  if (!playerData.name) {
    errors.name = 'Player name is required';
  } else if (playerData.name.length < 2) {
    errors.name = 'Player name must be at least 2 characters';
  }
  
  if (playerData.role && !['batsman', 'bowler', 'all-rounder', 'wicket-keeper'].includes(playerData.role)) {
    errors.role = 'Invalid player role';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitize input text
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export const sanitizeInput = (text) => {
  if (!text) return '';
  
  
  let sanitized = text.replace(/<[^>]*>/g, '');
  
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  sanitized = sanitized.replace(/[<>"'&]/g, '');
  

  sanitized = sanitized.trim();
  
  return sanitized;
};

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @param {Array} rules - Validation rules
 * @returns {Object} Validation result
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  
  rules.forEach(rule => {
    const { field, validator, message } = rule;
    const value = formData[field];
    
    if (!validator(value)) {
      errors[field] = message;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Common validation rules
 */
export const validationRules = {
  required: (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== undefined && value !== null && value !== '';
  },
  
  minLength: (min) => (value) => {
    if (!value) return false;
    return value.length >= min;
  },
  
  maxLength: (max) => (value) => {
    if (!value) return true;
    return value.length <= max;
  },
  
  email: (value) => {
    if (!value) return true;
    return VALIDATION_PATTERNS.EMAIL.test(value);
  },
  
  phone: (value) => {
    if (!value) return true;
    return VALIDATION_PATTERNS.PHONE.test(value);
  },
  
  number: (value) => {
    if (!value) return true;
    return !isNaN(parseFloat(value)) && isFinite(value);
  },
  
  positiveNumber: (value) => {
    if (!value) return true;
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  },
  
  between: (min, max) => (value) => {
    if (!value) return true;
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  }
};