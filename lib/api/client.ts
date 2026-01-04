import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('customer-auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add tenant slug if available
  const tenantSlug = await SecureStore.getItemAsync('tenant-slug');
  if (tenantSlug) {
    config.params = { ...config.params, tenant: tenantSlug };
  }
  
  return config;
});

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      await SecureStore.deleteItemAsync('customer-auth-token');
      // Navigate to login will be handled by the app
    }
    return Promise.reject(error);
  }
);

export default apiClient;
