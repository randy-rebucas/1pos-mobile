export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.1pos.com/api';

export const APP_CONFIG = {
  API_BASE_URL,
  TIMEOUT: 10000,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
};
