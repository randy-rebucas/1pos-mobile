import apiClient from './client';

export const publicAPI = {
  // Get Products
  getProducts: async (params?: {
    tenantSlug?: string;
    search?: string;
    category?: string;
    categoryId?: string;
    productType?: 'regular' | 'service' | 'bundle';
    isActive?: boolean;
  }) => {
    const response = await apiClient.get('/public/products', { params });
    return response.data;
  },

  // Get Services
  getServices: async (params?: {
    tenantSlug?: string;
    search?: string;
    category?: string;
    categoryId?: string;
  }) => {
    const response = await apiClient.get('/public/services', { params });
    return response.data;
  },

  // Get Store by Slug
  getStore: async (slug: string) => {
    const response = await apiClient.get(`/public/stores/${slug}`);
    return response.data;
  },

  // Get Stores List
  getStores: async (params?: {
    search?: string;
    isActive?: boolean;
  }) => {
    const response = await apiClient.get('/public/stores', { params });
    return response.data;
  },

  // Get Categories
  getCategories: async (params?: {
    tenantSlug?: string;
    search?: string;
  }) => {
    const response = await apiClient.get('/public/categories', { params });
    return response.data;
  },

  // Get Active Discounts
  getDiscounts: async (tenantSlug?: string) => {
    const response = await apiClient.get('/public/discounts', {
      params: { tenantSlug },
    });
    return response.data;
  },

  // Get Product Bundles
  getBundles: async (params?: {
    tenantSlug?: string;
    search?: string;
    categoryId?: string;
  }) => {
    const response = await apiClient.get('/public/bundles', { params });
    return response.data;
  },

  // Get Product by ID
  getProduct: async (productId: string, tenantSlug?: string) => {
    const response = await apiClient.get(`/public/products/${productId}`, {
      params: { tenantSlug },
    });
    return response.data;
  },

  // Get Service by ID
  getService: async (serviceId: string, tenantSlug?: string) => {
    const response = await apiClient.get(`/public/services/${serviceId}`, {
      params: { tenantSlug },
    });
    return response.data;
  },

  // Get Store Products
  getStoreProducts: async (storeSlug: string, params?: {
    search?: string;
    category?: string;
    categoryId?: string;
    productType?: string;
  }) => {
    const response = await apiClient.get(`/public/stores/${storeSlug}/products`, { params });
    return response.data;
  },

  // Get Store Services
  getStoreServices: async (storeSlug: string, params?: {
    search?: string;
    category?: string;
    categoryId?: string;
  }) => {
    const response = await apiClient.get(`/public/stores/${storeSlug}/services`, { params });
    return response.data;
  },

  // Get Store Categories
  getStoreCategories: async (storeSlug: string, search?: string) => {
    const response = await apiClient.get(`/public/stores/${storeSlug}/categories`, {
      params: { search },
    });
    return response.data;
  },

  // Universal Search
  search: async (query: string, params?: {
    type?: 'products' | 'services' | 'stores' | 'categories' | 'all';
    tenantSlug?: string;
  }) => {
    const response = await apiClient.get('/public/search', {
      params: { q: query, ...params },
    });
    return response.data;
  },
};
