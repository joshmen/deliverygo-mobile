/**
 * Application constants and configuration
 *
 * Environment variables:
 * - EXPO_PUBLIC_BACKEND_IP: API server IP (default: localhost)
 * - EXPO_PUBLIC_TENANT_CODE: Tenant code (default: demo-restaurant)
 * - EXPO_PUBLIC_GOOGLE_MAPS_KEY: Google Maps API key
 */

// Environment variables helper - Expo uses EXPO_PUBLIC_ prefix
const getEnvVar = (key: string, defaultValue: string): string => {
  // In Expo, environment variables with EXPO_PUBLIC_ prefix are available
  const expoKey = `EXPO_PUBLIC_${key}`;
  return process.env[expoKey] || process.env[key] || defaultValue;
};

// Tenant Configuration
export const TENANT_CODE = getEnvVar("TENANT_CODE", "demo-restaurant");

// API URLs - Use environment variable or fallback to localhost
// For device/emulator testing, set EXPO_PUBLIC_BACKEND_IP to your computer's IP
const getApiUrl = (port: number) => {
  const host = getEnvVar("BACKEND_IP", "localhost");
  // Using HTTP for development to avoid SSL certificate issues on mobile devices
  return `http://${host}:${port}`;
};

// Service ports (matching Aspire AppHost configuration)
const AUTH_PORT = 8001;
const TENANT_CONFIG_PORT = 8002;
const ORDER_PORT = 8003;

// API URLs - Using Aspire AppHost ports (8001-8003)
export const API_BASE_URL = getApiUrl(AUTH_PORT);
export const API_AUTH_URL = getApiUrl(AUTH_PORT);
export const API_TENANT_CONFIG_URL = getApiUrl(TENANT_CONFIG_PORT);
export const API_ORDER_URL = getApiUrl(ORDER_PORT);

// API Endpoints
export const ENDPOINTS = {
  auth: {
    login: `${API_AUTH_URL}/api/auth/login`,
    logout: `${API_AUTH_URL}/api/auth/logout`,
    refresh: `${API_AUTH_URL}/api/auth/refresh`,
    verify: `${API_AUTH_URL}/api/auth/verify`,
    registerTenantOwner: `${API_AUTH_URL}/api/auth/register-tenant-owner`,
    registerDriver: `${API_AUTH_URL}/api/auth/register-driver`,
    registerCustomer: `${API_AUTH_URL}/api/auth/register-customer`,
  },
  tenantConfig: {
    getByCode: (tenantCode: string) =>
      `${API_TENANT_CONFIG_URL}/api/tenant-config/${tenantCode}`,
  },
  orders: {
    // List and query
    list: `${API_ORDER_URL}/api/orders`,
    getTodayOrders: `${API_ORDER_URL}/api/orders/today`,

    // Single order operations
    getById: (orderId: string) => `${API_ORDER_URL}/api/orders/${orderId}`,
    create: `${API_ORDER_URL}/api/orders`,
    updateStatus: (orderId: string) =>
      `${API_ORDER_URL}/api/orders/${orderId}/status`,
    updateOrderStatus: (orderId: string) =>
      `${API_ORDER_URL}/api/driver/orders/${orderId}/status`,
    assignDriver: (orderId: string) =>
      `${API_ORDER_URL}/api/orders/${orderId}/assign-driver`,

    // Driver-specific
    driverOrders: (driverId: string) =>
      `${API_ORDER_URL}/api/orders/driver/${driverId}`,
    getAssignedOrders: `${API_ORDER_URL}/api/driver/orders/assigned`,

    // Statistics
    statistics: `${API_ORDER_URL}/api/orders/statistics`,
  },
  customer: {
    getStores: `${API_ORDER_URL}/api/customer/stores`,
    getProducts: (storeId: string) =>
      `${API_ORDER_URL}/api/customer/products/${storeId}`,
    checkout: `${API_ORDER_URL}/api/customer/cart/checkout`,
    getOrders: `${API_ORDER_URL}/api/customer/orders`,
    getOrderDetail: (orderId: string) =>
      `${API_ORDER_URL}/api/customer/orders/${orderId}`,
  },
};

// AsyncStorage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "@deliverygo:auth_token",
  USER_DATA: "@deliverygo:user_data",
  TENANT_CONFIG: "@deliverygo:tenant_config",
  CART: "@deliverygo:cart",
};

// App Configuration
export const APP_CONFIG = {
  API_TIMEOUT: 10000, // 10 seconds
  REFRESH_INTERVAL: 30000, // 30 seconds for order list
  DEFAULT_PRIMARY_COLOR: "#FF6B6B",
  DEFAULT_SECONDARY_COLOR: "#4ECDC4",
};

// Google Maps API Key
// Get your key from: https://console.cloud.google.com/
// Enable "Places API" in your Google Cloud project
// Set EXPO_PUBLIC_GOOGLE_MAPS_KEY in your .env file
export const GOOGLE_MAPS_API_KEY = getEnvVar("GOOGLE_MAPS_KEY", "");
