/**
 * Application constants for TinyLearn Frontend
 */

// App Info
export const APP_NAME = 'TinyLearn';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/login',
    PROFILE: '/users/profile',
    LOGOUT: '/users/logout'
  },
  USERS: {
    BASE: '/users',
    CREATE: '/users/create',
    STATUS: (id) => `/users/${id}/status`,
    STUDENTS: (parentId) => `/users/${parentId}/students`
  },
  LESSONS: {
    BASE: '/lessons',
    BY_ID: (id) => `/lessons/${id}`
  },
  ASSIGNMENTS: {
    BASE: '/assignments',
    BY_ID: (id) => `/assignments/${id}`
  },
  SUBMISSIONS: {
    BASE: '/submissions',
    GRADE: (id) => `/submissions/${id}/grade`
  },
  MESSAGES: {
    BASE: '/messages',
    READ: (id) => `/messages/${id}/read`
  },
  PROGRESS: {
    BASE: '/progress',
    STUDENT: (id) => `/progress/student/${id}`
  }
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  PARENT: 'parent',
  STUDENT: 'student'
};

// Account Status
export const ACCOUNT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
};

// Assignment Status
export const ASSIGNMENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

// Submission Status
export const SUBMISSION_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  RETURNED: 'returned'
};

// Message Status
export const MESSAGE_STATUS = {
  UNREAD: 'unread',
  READ: 'read',
  ARCHIVED: 'archived'
};

// Grade Levels
export const GRADE_LEVELS = [
  'Pre-K',
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade'
];

// Age Groups
export const AGE_GROUPS = [
  '2-3 years',
  '3-4 years',
  '4-5 years',
  '5-6 years',
  '6-7 years',
  '7-8 years',
  '8-9 years',
  '9-10 years',
  '10-11 years'
];

// Lesson Categories
export const LESSON_CATEGORIES = [
  'math',
  'reading',
  'writing',
  'science',
  'art',
  'music',
  'social-studies',
  'physical-education',
  'life-skills'
];

// Difficulty Levels
export const DIFFICULTY_LEVELS = [
  'beginner',
  'intermediate',
  'advanced'
];

// Relationship Types
export const RELATIONSHIP_TYPES = [
  'mother',
  'father',
  'guardian',
  'grandmother',
  'grandfather',
  'other'
];

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'tinylearn_token',
  USER: 'tinylearn_user',
  THEME: 'tinylearn_theme',
  PREFERENCES: 'tinylearn_preferences'
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#6366f1',
  SECONDARY: '#f59e0b',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6'
};

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// File Upload Limits
export const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
};

// Dashboard Refresh Intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  DASHBOARD: 5 * 60 * 1000, // 5 minutes
  MESSAGES: 30 * 1000, // 30 seconds
  ASSIGNMENTS: 2 * 60 * 1000, // 2 minutes
  PROGRESS: 5 * 60 * 1000 // 5 minutes
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  LESSONS: '/lessons',
  STUDENT: '/student',
  TEACHER: '/teacher',
  PARENT: '/parent',
  ADMIN: '/admin'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  VALIDATION: 'Please check your input and try again.',
  LOGIN_REQUIRED: 'Please log in to continue.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  LOGOUT: 'Logged out successfully',
  SAVE: 'Changes saved successfully',
  DELETE: 'Item deleted successfully',
  CREATE: 'Item created successfully',
  UPDATE: 'Item updated successfully'
};
