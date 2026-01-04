import { create } from 'zustand';
import { authAPI } from '@/lib/api/auth';
import * as SecureStore from 'expo-secure-store';
import type { Customer, Guest } from '@/types/user';

interface AuthState {
  customer: Customer | null;
  guest: Guest | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  
  // Actions
  login: (email: string, password: string, tenantSlug?: string) => Promise<void>;
  loginWithOTP: (
    phone: string,
    otp: string,
    firstName?: string,
    lastName?: string,
    tenantSlug?: string
  ) => Promise<void>;
  loginWithFacebook: (accessToken: string, tenantSlug?: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
    tenantSlug?: string
  ) => Promise<void>;
  createGuestSession: (tenantSlug?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  customer: null,
  guest: null,
  isLoading: true,
  isAuthenticated: false,
  isGuest: false,

  login: async (email, password, tenantSlug) => {
    try {
      const response = await authAPI.login(email, password, tenantSlug);
      if (response.success) {
        await SecureStore.setItemAsync('customer-auth-token', response.data.token);
        if (tenantSlug) {
          await SecureStore.setItemAsync('tenant-slug', tenantSlug);
        }
        set({
          customer: response.data.customer,
          isAuthenticated: true,
          isGuest: false,
          guest: null,
        });
      }
    } catch (error) {
      throw error;
    }
  },

  loginWithOTP: async (phone, otp, firstName, lastName, tenantSlug) => {
    try {
      const response = await authAPI.verifyOTP(phone, otp, firstName, lastName, tenantSlug);
      if (response.success) {
        await SecureStore.setItemAsync('customer-auth-token', response.data.token);
        if (tenantSlug) {
          await SecureStore.setItemAsync('tenant-slug', tenantSlug);
        }
        set({
          customer: response.data.customer,
          isAuthenticated: true,
          isGuest: false,
          guest: null,
        });
      }
    } catch (error) {
      throw error;
    }
  },

  loginWithFacebook: async (accessToken, tenantSlug) => {
    try {
      const response = await authAPI.loginWithFacebook(accessToken, tenantSlug);
      if (response.success) {
        await SecureStore.setItemAsync('customer-auth-token', response.data.token);
        if (tenantSlug) {
          await SecureStore.setItemAsync('tenant-slug', tenantSlug);
        }
        set({
          customer: response.data.customer,
          isAuthenticated: true,
          isGuest: false,
          guest: null,
        });
      }
    } catch (error) {
      throw error;
    }
  },

  register: async (email, password, firstName, lastName, phone, tenantSlug) => {
    try {
      const response = await authAPI.register(
        email,
        password,
        firstName,
        lastName,
        phone,
        tenantSlug
      );
      if (response.success) {
        await SecureStore.setItemAsync('customer-auth-token', response.data.token);
        if (tenantSlug) {
          await SecureStore.setItemAsync('tenant-slug', tenantSlug);
        }
        set({
          customer: response.data.customer,
          isAuthenticated: true,
          isGuest: false,
          guest: null,
        });
      }
    } catch (error) {
      throw error;
    }
  },

  createGuestSession: async (tenantSlug) => {
    try {
      const response = await authAPI.createGuestSession(tenantSlug);
      if (response.success) {
        await SecureStore.setItemAsync('guest-token', response.data.token);
        if (tenantSlug) {
          await SecureStore.setItemAsync('tenant-slug', tenantSlug);
        }
        set({
          guest: response.data,
          isGuest: true,
          isAuthenticated: false,
          customer: null,
        });
      }
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      await SecureStore.deleteItemAsync('customer-auth-token');
      await SecureStore.deleteItemAsync('guest-token');
      set({
        customer: null,
        guest: null,
        isAuthenticated: false,
        isGuest: false,
      });
    }
  },

  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('customer-auth-token');
      if (token) {
        const response = await authAPI.getMe();
        if (response.success) {
          set({
            customer: response.data.customer,
            isAuthenticated: true,
            isGuest: false,
            isLoading: false,
          });
          return;
        }
      }

      const guestToken = await SecureStore.getItemAsync('guest-token');
      if (guestToken) {
        set({ isGuest: true, isLoading: false });
        return;
      }

      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
