export const APP_NAME = 'Overza';
export const APP_DESCRIPTION =
  'Overza delivers real-time cricket scoring with instant live updates.';

export const APP_VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'Overza_token',
  USER_DATA: 'Overza_user',
  THEME_MODE: 'Overza_theme',
  RECENT_MATCHES: 'Overza_recent_matches',
  PREFERENCES: 'Overza_preferences'
};

// Match Constants
export const MATCH_TYPES = {
  LIMITED: 'limited',
  TEST: 'test',
  FRIENDLY: 'friendly',
  T20: 't20',
  ODI: 'odi'
};

export const MATCH_TYPE_LABELS = {
  [MATCH_TYPES.LIMITED]: 'Limited Overs',
  [MATCH_TYPES.TEST]: 'Test Match',
  [MATCH_TYPES.FRIENDLY]: 'Friendly Match',
  [MATCH_TYPES.T20]: 'T20 Match',
  [MATCH_TYPES.ODI]: 'ODI Match'
};

// Match Status
export const MATCH_STATUS = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned'
};

export const MATCH_STATUS_LABELS = {
  [MATCH_STATUS.UPCOMING]: 'Upcoming',
  [MATCH_STATUS.LIVE]: 'Live',
  [MATCH_STATUS.COMPLETED]: 'Completed',
  [MATCH_STATUS.ABANDONED]: 'Abandoned'
};

export const MATCH_STATUS_COLORS = {
  [MATCH_STATUS.UPCOMING]: 'yellow',
  [MATCH_STATUS.LIVE]: 'red',
  [MATCH_STATUS.COMPLETED]: 'green',
  [MATCH_STATUS.ABANDONED]: 'gray'
};

// Scoring Constants
export const SCORING_BUTTONS = [
  { value: 0, label: '0', color: 'gray', description: 'Dot ball' },
  { value: 1, label: '1', color: 'blue', description: 'Single' },
  { value: 2, label: '2', color: 'blue', description: 'Double' },
  { value: 3, label: '3', color: 'blue', description: 'Triple' },
  { value: 4, label: '4', color: 'green', description: 'Boundary' },
  { value: 6, label: '6', color: 'green', description: 'Six' },
  { value: -1, label: 'W', color: 'red', description: 'Wicket' },
  { value: -2, label: 'WD', color: 'yellow', description: 'Wide' },
  { value: -3, label: 'NB', color: 'yellow', description: 'No Ball' },
  { value: -4, label: 'B', color: 'purple', description: 'Bye' },
  { value: -5, label: 'LB', color: 'purple', description: 'Leg Bye' }
];

export const WICKET_TYPES = [
  'bowled',
  'caught',
  'lbw',
  'run out',
  'stumped',
  'hit wicket',
  'retired hurt'
];

export const EXTRAS_TYPES = {
  WIDE: 'wide',
  NO_BALL: 'no_ball',
  BYE: 'bye',
  LEG_BYE: 'leg_bye',
  PENALTY: 'penalty'
};

// Player Roles
export const PLAYER_ROLES = {
  BATSMAN: 'batsman',
  BOWLER: 'bowler',
  ALL_ROUNDER: 'all-rounder',
  WICKET_KEEPER: 'wicket-keeper'
};

// Socket Events
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Match Events
  JOIN_MATCH: 'join_match',
  LEAVE_MATCH: 'leave_match',
  MATCH_STATE: 'match_state',
  
  // Score Events
  SCORE_UPDATE: 'score_update',
  SCORE_UPDATED: 'score_updated',
  BALL_UPDATE: 'ball_update',
  NEW_BALL: 'new_ball',
  WICKET_UPDATE: 'wicket_update',
  WICKET_FALLEN: 'wicket_fallen',
  OVER_COMPLETE: 'over_complete',
  OVER_COMPLETED: 'over_completed',
  INNINGS_CHANGE: 'innings_change',
  INNINGS_CHANGED: 'innings_changed',
  
  // Commentary Events
  ADD_COMMENTARY: 'add_commentary',
  NEW_COMMENTARY: 'new_commentary',
  
  // Status Events
  MATCH_STATUS_UPDATE: 'match_status_update',
  MATCH_STATUS_CHANGED: 'match_status_changed',
  
  // Error Events
  ERROR: 'error',
  CONNECTION_ERROR: 'connection_error'
};

// Routes
export const ROUTES = {
  HOME: '/',
  LIVE_MATCH: '/live/:matchId',
  SCORER_PANEL: '/scorer',
  LOGIN: '/login',
  REGISTER: '/register',
  MATCH_HISTORY: '/history',
  PROFILE: '/profile',
  NOT_FOUND: '*'
};

// Colors
export const COLORS = {
  CRICKET_GREEN: '#22c55e',
  CRICKET_DARK_GREEN: '#16a34a',
  CRICKET_BLUE: '#1e40af',
  CRICKET_DARK_BLUE: '#1e3a8a',
  CRICKET_RED: '#dc2626',
  CRICKET_GOLD: '#f59e0b',
  CRICKET_GRAY: '#6b7280',
  CRICKET_LIGHT_GRAY: '#9ca3af',
  CRICKET_DARK_GRAY: '#374151'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You need to log in to access this feature.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  MATCH_CREATED: 'Match created successfully!',
  SCORE_UPDATED: 'Score updated successfully!',
  MATCH_ENDED: 'Match ended successfully!',
  LOGIN_SUCCESS: 'Logged in successfully!',
  REGISTER_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!'
};

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{6,}$/
};

// Default Values
export const DEFAULTS = {
  TOTAL_OVERS: 5,
  MATCH_TYPE: MATCH_TYPES.LIMITED,
  PAGE_LIMIT: 10,
  MAX_PLAYERS_PER_TEAM: 11
};

export default {
  APP_NAME,
  APP_DESCRIPTION,
  API_BASE_URL,
  SOCKET_URL,
  STORAGE_KEYS,
  MATCH_TYPES,
  MATCH_STATUS,
  SCORING_BUTTONS,
  SOCKET_EVENTS,
  ROUTES,
  COLORS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_PATTERNS,
  DEFAULTS
};