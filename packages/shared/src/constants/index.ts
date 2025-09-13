// Application constants
export const APP_NAME = 'NearbyShop';
export const APP_VERSION = '1.0.0';

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  SHOPS: '/api/shops',
  PRODUCTS: '/api/products',
  USERS: '/api/users',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;