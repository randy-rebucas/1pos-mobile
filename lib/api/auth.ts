import apiClient from './client';
import * as SecureStore from 'expo-secure-store';

export const authAPI = {
  // Send OTP
  sendOTP: async (phone: string, tenantSlug?: string) => {
    const response = await apiClient.post('/auth/customer/send-otp', {
      phone,
      tenantSlug,
    });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (
    phone: string,
    otp: string,
    firstName?: string,
    lastName?: string,
    tenantSlug?: string
  ) => {
    const response = await apiClient.post('/auth/customer/verify-otp', {
      phone,
      otp,
      firstName,
      lastName,
      tenantSlug,
    });
    return response.data;
  },

  // Register with email/password
  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
    tenantSlug?: string
  ) => {
    const response = await apiClient.post('/auth/customer/register', {
      email,
      password,
      firstName,
      lastName,
      phone,
      tenantSlug,
    });
    return response.data;
  },

  // Login with email/password
  login: async (email: string, password: string, tenantSlug?: string) => {
    const response = await apiClient.post('/auth/customer/login', {
      email,
      password,
      tenantSlug,
    });
    return response.data;
  },

  // Facebook login
  loginWithFacebook: async (accessToken: string, tenantSlug?: string) => {
    const response = await apiClient.post('/auth/customer/facebook', {
      accessToken,
      tenantSlug,
    });
    return response.data;
  },

  // Get current customer
  getMe: async () => {
    const response = await apiClient.get('/auth/customer/me');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/auth/customer/logout');
    return response.data;
  },

  // Create guest session
  createGuestSession: async (tenantSlug?: string) => {
    const response = await apiClient.post('/auth/guest/create', {
      tenantSlug,
    });
    return response.data;
  },
};
