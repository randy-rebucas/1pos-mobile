# Public API Endpoints

Complete reference for public endpoints that don't require authentication. These endpoints are designed for mobile apps and public-facing applications.

---

## 📦 Products

### Get Products
**GET** `/api/public/products`

Get list of public products.

**Query Parameters:**
- `tenantSlug` (optional): Filter by tenant slug
- `search` (optional): Search by name, description, or SKU
- `category` (optional): Filter by category name
- `categoryId` (optional): Filter by category ID
- `productType` (optional): Filter by type (`regular`, `service`, `bundle`)
- `isActive` (optional, default: `true`): Filter by active status

**Example Request:**
```
GET /api/public/products?tenantSlug=default&search=shirt&productType=regular
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 25.00,
      "stock": 50,
      "sku": "SKU123",
      "category": "Category Name",
      "categoryId": "category_id",
      "image": "https://example.com/image.jpg",
      "productType": "regular",
      "hasVariations": false,
      "variations": null,
      "serviceType": null,
      "serviceDuration": null,
      "modifiers": null,
      "allergens": null,
      "nutritionInfo": null,
      "allowOutOfStockSales": false
    }
  ],
  "count": 1
}
```

**Notes:**
- No authentication required
- Stock is only shown if `trackInventory` is enabled
- Internal fields like `branchStock` are excluded
- Pinned products appear first

---

## 🛎️ Services

### Get Services
**GET** `/api/public/services`

Get list of public services (products with `productType='service'`).

**Query Parameters:**
- `tenantSlug` (optional): Filter by tenant slug
- `search` (optional): Search by name, description, or SKU
- `category` (optional): Filter by category name
- `categoryId` (optional): Filter by category ID

**Example Request:**
```
GET /api/public/services?tenantSlug=default&categoryId=service_category_id
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "service_id",
      "name": "Haircut",
      "description": "Professional haircut service",
      "price": 30.00,
      "sku": "SRV001",
      "category": "Hair Services",
      "categoryId": "category_id",
      "image": "https://example.com/service.jpg",
      "serviceType": "wash",
      "serviceDuration": 30,
      "estimatedDuration": 30,
      "staffRequired": 1,
      "equipmentRequired": ["scissors", "comb"],
      "weightBased": false,
      "pickupDelivery": false,
      "modifiers": null,
      "allergens": null,
      "nutritionInfo": null
    }
  ],
  "count": 1
}
```

**Notes:**
- No authentication required
- Services don't have stock (excluded from response)
- Includes service-specific fields like `serviceDuration`, `serviceType`, etc.

---

## 🏪 Stores

### Get Stores List
**GET** `/api/public/stores`

Get list of public stores/tenants.

**Query Parameters:**
- `search` (optional): Search by name, slug, or company name
- `isActive` (optional, default: `true`): Filter by active status

**Example Request:**
```
GET /api/public/stores?search=coffee&isActive=true
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "tenant_id",
      "name": "Store Name",
      "slug": "store-slug",
      "subdomain": "store",
      "domain": "store.example.com",
      "companyName": "Company Name",
      "logo": "https://example.com/logo.png",
      "primaryColor": "#FF5733",
      "address": {
        "street": "123 Main St",
        "city": "City",
        "state": "State",
        "zipCode": "12345",
        "country": "Country"
      },
      "phone": "+1234567890",
      "email": "store@example.com",
      "website": "https://store.example.com",
      "businessType": "Retail",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

**Notes:**
- No authentication required
- Only returns public store information
- Sensitive data is excluded

---

### Get Store by Slug
**GET** `/api/public/stores/[slug]`

Get detailed public information about a specific store.

**Example Request:**
```
GET /api/public/stores/default
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "_id": "tenant_id",
    "name": "Store Name",
    "slug": "default",
    "subdomain": "store",
    "domain": "store.example.com",
    "companyName": "Company Name",
    "logo": "https://example.com/logo.png",
    "primaryColor": "#FF5733",
    "secondaryColor": "#33FF57",
    "accentColor": "#3357FF",
    "address": {
      "street": "123 Main St",
      "city": "City",
      "state": "State",
      "zipCode": "12345",
      "country": "Country"
    },
    "phone": "+1234567890",
    "email": "store@example.com",
    "website": "https://store.example.com",
    "businessType": "Retail",
    "currency": "USD",
    "currencySymbol": "$",
    "taxEnabled": true,
    "taxRate": 10,
    "taxLabel": "VAT",
    "enableInventory": true,
    "enableCategories": true,
    "enableDiscounts": true,
    "enableBookingScheduling": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "error": "Store not found"
}
```

**Notes:**
- No authentication required
- Returns detailed store information including feature flags
- Only active stores are returned

---

## 📂 Categories

### Get Categories
**GET** `/api/public/categories`

Get list of public categories.

**Query Parameters:**
- `tenantSlug` (optional): Filter by tenant slug
- `search` (optional): Search by category name

**Example Request:**
```
GET /api/public/categories?tenantSlug=default
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "category_id",
      "name": "Category Name",
      "description": "Category description",
      "image": "https://example.com/category.jpg",
      "order": 1
    }
  ],
  "count": 1
}
```

**Notes:**
- No authentication required
- Categories are sorted by `order` field, then alphabetically
- Only public fields are returned

---

## 🎟️ Discounts

### Get Active Discounts
**GET** `/api/public/discounts`

Get list of public active discounts.

**Query Parameters:**
- `tenantSlug` (optional): Filter by tenant slug

**Example Request:**
```
GET /api/public/discounts?tenantSlug=default
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "discount_id",
      "code": "SAVE10",
      "name": "10% Off",
      "description": "Get 10% off your purchase",
      "type": "percentage",
      "value": 10,
      "maxDiscountAmount": 50.00,
      "minPurchaseAmount": 100.00,
      "validFrom": "2024-01-01T00:00:00Z",
      "validUntil": "2024-12-31T23:59:59Z"
    }
  ],
  "count": 1
}
```

**Notes:**
- No authentication required
- Only returns active discounts that are currently valid
- Checks validity dates and usage limits
- Fixed amount discounts don't expose the exact value (security)
- Discounts are filtered to only show those within validity period

---

## 📦 Bundles

### Get Product Bundles
**GET** `/api/public/bundles`

Get list of public product bundles.

**Query Parameters:**
- `tenantSlug` (optional): Filter by tenant slug
- `search` (optional): Search by name, description, or SKU
- `categoryId` (optional): Filter by category ID

**Example Request:**
```
GET /api/public/bundles?tenantSlug=default&search=combo
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "bundle_id",
      "name": "Combo Pack",
      "description": "Special combo offer",
      "price": 50.00,
      "sku": "BUNDLE001",
      "categoryId": "category_id",
      "image": "https://example.com/bundle.jpg",
      "items": [
        {
          "product": {
            "_id": "product_id",
            "name": "Product 1",
            "price": 20.00,
            "image": "https://example.com/product1.jpg"
          },
          "quantity": 2
        },
        {
          "product": {
            "_id": "product_id_2",
            "name": "Product 2",
            "price": 15.00,
            "image": "https://example.com/product2.jpg"
          },
          "quantity": 1
        }
      ]
    }
  ],
  "count": 1
}
```

**Notes:**
- No authentication required
- Only active bundles are returned
- Bundle items include product details
- Products are populated with basic info

---

## 🔍 Product Details

### Get Product by ID
**GET** `/api/public/products/[id]`

Get detailed information about a specific product.

**Query Parameters:**
- `tenantSlug` (optional): Filter by tenant slug

**Example Request:**
```
GET /api/public/products/product_id?tenantSlug=default
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "name": "Product Name",
    "description": "Detailed product description",
    "price": 25.00,
    "stock": 50,
    "sku": "SKU123",
    "category": {
      "_id": "category_id",
      "name": "Category Name",
      "description": "Category description",
      "image": "https://example.com/category.jpg"
    },
    "categoryId": "category_id",
    "image": "https://example.com/image.jpg",
    "productType": "regular",
    "hasVariations": true,
    "variations": [
      {
        "size": "Large",
        "color": "Blue",
        "type": null,
        "price": 27.00,
        "stock": 20
      }
    ],
    "serviceType": null,
    "serviceDuration": null,
    "modifiers": null,
    "allergens": null,
    "allowOutOfStockSales": false,
    "pinned": false
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "error": "Product not found"
}
```

---

## 🔍 Service Details

### Get Service by ID
**GET** `/api/public/services/[id]`

Get detailed information about a specific service.

**Query Parameters:**
- `tenantSlug` (optional): Filter by tenant slug

**Example Request:**
```
GET /api/public/services/service_id?tenantSlug=default
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "_id": "service_id",
    "name": "Haircut",
    "description": "Professional haircut service",
    "price": 30.00,
    "sku": "SRV001",
    "category": {
      "_id": "category_id",
      "name": "Hair Services"
    },
    "categoryId": "category_id",
    "image": "https://example.com/service.jpg",
    "serviceType": "wash",
    "serviceDuration": 30,
    "estimatedDuration": 30,
    "staffRequired": 1,
    "equipmentRequired": ["scissors", "comb"],
    "weightBased": false,
    "pickupDelivery": false,
    "modifiers": null,
    "allergens": null,
    "pinned": false
  }
}
```

---

## 🏪 Store-Specific Endpoints

### Get Store Products
**GET** `/api/public/stores/[slug]/products`

Get all products for a specific store.

**Query Parameters:**
- `search` (optional): Search by name, description, or SKU
- `category` (optional): Filter by category name
- `categoryId` (optional): Filter by category ID
- `productType` (optional): Filter by type (`regular`, `service`, `bundle`)

**Example Request:**
```
GET /api/public/stores/default/products?search=shirt&productType=regular
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [...],
  "count": 10,
  "store": {
    "_id": "tenant_id",
    "name": "Store Name",
    "slug": "default"
  }
}
```

---

### Get Store Services
**GET** `/api/public/stores/[slug]/services`

Get all services for a specific store.

**Query Parameters:**
- `search` (optional): Search by name, description, or SKU
- `category` (optional): Filter by category name
- `categoryId` (optional): Filter by category ID

**Example Request:**
```
GET /api/public/stores/default/services?categoryId=service_category_id
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [...],
  "count": 5,
  "store": {
    "_id": "tenant_id",
    "name": "Store Name",
    "slug": "default"
  }
}
```

---

### Get Store Categories
**GET** `/api/public/stores/[slug]/categories`

Get all categories for a specific store.

**Query Parameters:**
- `search` (optional): Search by category name

**Example Request:**
```
GET /api/public/stores/default/categories
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [...],
  "count": 8,
  "store": {
    "_id": "tenant_id",
    "name": "Store Name",
    "slug": "default"
  }
}
```

---

## 🌐 Cross-Store Endpoints

### Get All Products (All Stores)
**GET** `/api/public/all-products`

Get products from all stores (or filter by specific store).

**Query Parameters:**
- `search` (optional): Search by name, description, or SKU
- `category` (optional): Filter by category name
- `categoryId` (optional): Filter by category ID
- `productType` (optional): Filter by type
- `storeSlug` (optional): Filter by specific store slug

**Example Request:**
```
GET /api/public/all-products?search=laptop&storeSlug=electronics-store
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 999.00,
      "stock": 15,
      "sku": "LAP001",
      "category": {
        "_id": "category_id",
        "name": "Electronics"
      },
      "image": "https://example.com/laptop.jpg",
      "productType": "regular",
      "store": {
        "_id": "tenant_id",
        "name": "Electronics Store",
        "slug": "electronics-store",
        "companyName": "Electronics Co.",
        "logo": "https://example.com/logo.png"
      }
    }
  ],
  "count": 1
}
```

**Notes:**
- Products include store information
- Useful for marketplace/search scenarios
- Can filter by specific store if needed

---

### Get All Services (All Stores)
**GET** `/api/public/all-services`

Get services from all stores (or filter by specific store).

**Query Parameters:**
- `search` (optional): Search by name, description, or SKU
- `category` (optional): Filter by category name
- `categoryId` (optional): Filter by category ID
- `storeSlug` (optional): Filter by specific store slug

**Example Request:**
```
GET /api/public/all-services?search=haircut&storeSlug=salon
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "service_id",
      "name": "Haircut",
      "description": "Professional haircut",
      "price": 30.00,
      "sku": "SRV001",
      "category": {
        "_id": "category_id",
        "name": "Hair Services"
      },
      "image": "https://example.com/haircut.jpg",
      "serviceDuration": 30,
      "store": {
        "_id": "tenant_id",
        "name": "Beauty Salon",
        "slug": "salon",
        "companyName": "Beauty Co.",
        "logo": "https://example.com/logo.png"
      }
    }
  ],
  "count": 1
}
```

**Notes:**
- Services include store information
- Useful for service discovery across multiple stores
- Can filter by specific store if needed

---

## 🔍 Universal Search

### Search Everything
**GET** `/api/public/search`

Universal search across products, services, stores, and categories.

**Query Parameters:**
- `q` (required): Search query
- `type` (optional): Filter by type (`products`, `services`, `stores`, `categories`, `all`)
- `tenantSlug` (optional): Filter by tenant slug

**Example Request:**
```
GET /api/public/search?q=coffee&type=all&tenantSlug=default
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "product_id",
        "name": "Coffee Beans",
        "description": "Premium coffee beans",
        "price": 15.00,
        "image": "https://example.com/coffee.jpg",
        "productType": "regular",
        "category": {
          "_id": "category_id",
          "name": "Beverages"
        }
      }
    ],
    "services": [
      {
        "_id": "service_id",
        "name": "Coffee Tasting",
        "description": "Professional coffee tasting session",
        "price": 25.00,
        "image": "https://example.com/tasting.jpg",
        "serviceDuration": 60,
        "category": {
          "_id": "category_id",
          "name": "Experiences"
        }
      }
    ],
    "stores": [
      {
        "_id": "tenant_id",
        "name": "Coffee Shop",
        "slug": "coffee-shop",
        "companyName": "Coffee Co.",
        "logo": "https://example.com/logo.png"
      }
    ],
    "categories": [
      {
        "_id": "category_id",
        "name": "Coffee",
        "description": "Coffee products and services",
        "image": "https://example.com/category.jpg"
      }
    ]
  },
  "query": "coffee",
  "totalCount": 4
}
```

**Notes:**
- Searches across all entity types
- Returns up to 20 products/services, 10 stores/categories
- Can filter by type or tenant
- Useful for global search functionality

---

## 🔒 Security & Privacy

### Data Exposure
- **Public endpoints** don't require authentication
- **Sensitive data** is excluded (e.g., internal stock levels, pricing strategies)
- **Stock information** is only shown if inventory tracking is enabled
- **Fixed discount amounts** are not exposed (only percentage discounts show value)

### Rate Limiting
- Public endpoints may have rate limiting (check response headers)
- Recommended: Implement client-side caching
- Use appropriate cache headers when available

### Best Practices

1. **Caching**
   - Cache product/service lists on mobile app
   - Refresh periodically (e.g., every 5-10 minutes)
   - Cache store information longer (changes infrequently)

2. **Error Handling**
   - All endpoints return `{ success: boolean, error?: string }` format
   - Handle 404 for not found resources
   - Handle 500 for server errors

3. **Tenant Filtering**
   - Use `tenantSlug` when you know the specific store
   - Omit `tenantSlug` to search across all stores (if needed)

---

## 📊 Response Format

All endpoints follow this response format:

**Success:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 🚨 Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | Success | Request completed successfully |
| 404 | Not Found | Resource not found (e.g., store not found) |
| 500 | Server Error | Internal server error |

---

## 📝 Example Mobile Implementation

### React Native / Expo Example

```typescript
// api/public.ts
const API_BASE_URL = 'https://your-api-domain.com';

export const publicAPI = {
  getProducts: async (tenantSlug?: string, filters?: {
    search?: string;
    category?: string;
    categoryId?: string;
    productType?: 'regular' | 'service' | 'bundle';
  }) => {
    const params = new URLSearchParams();
    if (tenantSlug) params.append('tenantSlug', tenantSlug);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.productType) params.append('productType', filters.productType);

    const response = await fetch(
      `${API_BASE_URL}/api/public/products?${params.toString()}`,
      { method: 'GET' }
    );
    return response.json();
  },

  getServices: async (tenantSlug?: string, filters?: {
    search?: string;
    categoryId?: string;
  }) => {
    const params = new URLSearchParams();
    if (tenantSlug) params.append('tenantSlug', tenantSlug);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);

    const response = await fetch(
      `${API_BASE_URL}/api/public/services?${params.toString()}`,
      { method: 'GET' }
    );
    return response.json();
  },

  getStores: async (search?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);

    const response = await fetch(
      `${API_BASE_URL}/api/public/stores?${params.toString()}`,
      { method: 'GET' }
    );
    return response.json();
  },

  getStore: async (slug: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/public/stores/${slug}`,
      { method: 'GET' }
    );
    return response.json();
  },

  getCategories: async (tenantSlug?: string, search?: string) => {
    const params = new URLSearchParams();
    if (tenantSlug) params.append('tenantSlug', tenantSlug);
    if (search) params.append('search', search);

    const response = await fetch(
      `${API_BASE_URL}/api/public/categories?${params.toString()}`,
      { method: 'GET' }
    );
    return response.json();
  },

  getDiscounts: async (tenantSlug?: string) => {
    const params = new URLSearchParams();
    if (tenantSlug) params.append('tenantSlug', tenantSlug);

    const response = await fetch(
      `${API_BASE_URL}/api/public/discounts?${params.toString()}`,
      { method: 'GET' }
    );
    return response.json();
  },

  getBundles: async (tenantSlug?: string, filters?: {
    search?: string;
    categoryId?: string;
  }) => {
    const params = new URLSearchParams();
    if (tenantSlug) params.append('tenantSlug', tenantSlug);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);

    const response = await fetch(
      `${API_BASE_URL}/api/public/bundles?${params.toString()}`,
      { method: 'GET' }
    );
    return response.json();
  },

  // Product/Service Details
  getProduct: async (productId: string, tenantSlug?: string) => {
    const params = new URLSearchParams();
    if (tenantSlug) params.append('tenantSlug', tenantSlug);

    const response = await fetch(
      `${API_BASE_URL}/api/public/products/${productId}?${params.toString()}`,
      { method: 'GET' }
    );
    return response.json();
  },

  getService: async (serviceId: string, tenantSlug?: string) => {
    const params = new URLSearchParams();
    if (tenantSlug) params.append('tenantSlug', tenantSlug);

    const response = await fetch(
      `${API_BASE_URL}/api/public/services/${serviceId}?${params.toString()}`,
      { method: 'GET' }
    );
    return response.json();
  },

  // Store-specific endpoints
  getStoreProducts: async (storeSlug: string, filters?: {
    search?: string;
    category?: string;
    categoryId?: string;
    productType?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.productType) params.append('productType', filters.productType);

    const response = await fetch(
      `${API_BASE_URL}/api/public/stores/${storeSlug}/products?${params.toString()}`,
      { method: 'GET' }
    );
    return response.json();
  },

  getStoreServices: async (storeSlug: string, filters?: {
    search?: string;
    category?: string;
    categoryId?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);

    const response = await fetch(
      `${API_BASE_URL}/api/public/stores/${storeSlug}/services?${params.toString()}`,
      { method: 'GET' }
    );
    return response.json();
  },

  getStoreCategories: async (storeSlug: string, search?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);

    const response = await fetch(
      `${API_BASE_URL}/api/public/stores/${storeSlug}/categories?${params.toString()}`,
      { method: 'GET' }
    );
    return response.json();
  },

  // Cross-store endpoints
  getAllProducts: async (filters?: {
    search?: string;
    category?: string;
    categoryId?: string;
    productType?: string;
    storeSlug?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.productType) params.append('productType', filters.productType);
    if (filters?.storeSlug) params.append('storeSlug', filters.storeSlug);

    const response = await fetch(
      `${API_BASE_URL}/api/public/all-products?${params.toString()}`,
      { method: 'GET' }
    );
    return response.json();
  },

  getAllServices: async (filters?: {
    search?: string;
    category?: string;
    categoryId?: string;
    storeSlug?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.storeSlug) params.append('storeSlug', filters.storeSlug);

    const response = await fetch(
      `${API_BASE_URL}/api/public/all-services?${params.toString()}`,
      { method: 'GET' }
    );
    return response.json();
  },

  // Universal search
  search: async (query: string, type?: 'products' | 'services' | 'stores' | 'categories' | 'all', tenantSlug?: string) => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (type) params.append('type', type);
    if (tenantSlug) params.append('tenantSlug', tenantSlug);

    const response = await fetch(
      `${API_BASE_URL}/api/public/search?${params.toString()}`,
      { method: 'GET' }
    );
    return response.json();
  },
};
```

---

**Last Updated**: 2024-01-17  
**Version**: 1.0  
**Status**: All endpoints are production-ready
