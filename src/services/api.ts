/**
 * API client service with Axios
 * Handles HTTP requests with authentication and error handling
 */

import axios, { AxiosInstance, AxiosError } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_BASE_URL, APP_CONFIG, STORAGE_KEYS, ENDPOINTS } from '../config/constants'
import type { LoginRequest, LoginResponse, TenantConfig, User } from '../types'

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: APP_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Error reading auth token:', error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 Unauthorized - Clear auth and redirect to login
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.AUTH_TOKEN,
          STORAGE_KEYS.USER_DATA
        ])
        // Navigation will be handled by AuthContext
      } catch (storageError) {
        console.error('Error clearing auth data:', storageError)
      }
    }
    return Promise.reject(error)
  }
)

// API Service functions

/**
 * Login user
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  // Backend expects PascalCase property names
  const requestBody = {
    Email: credentials.email,
    Password: credentials.password,
    TenantCode: credentials.tenantCode
  }
  const response = await apiClient.post<LoginResponse>(ENDPOINTS.auth.login, requestBody)

  // Store token and user data
  await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.accessToken)
  await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user))

  return response.data
}

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  // Clear local storage first
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.AUTH_TOKEN,
    STORAGE_KEYS.USER_DATA
  ])

  // Optionally call logout endpoint (don't wait for it, fire and forget)
  // Backend can invalidate token if needed
  apiClient.post(ENDPOINTS.auth.logout).catch(() => {
    // Ignore errors - local logout is what matters
  })
}

/**
 * Get stored auth token
 */
export const getStoredToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
}

/**
 * Get stored user data
 */
export const getStoredUser = async (): Promise<User | null> => {
  const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA)
  return userData ? JSON.parse(userData) : null
}

/**
 * Fetch tenant configuration
 */
export const fetchTenantConfig = async (tenantCode: string): Promise<TenantConfig> => {
  const response = await apiClient.get<TenantConfig>(
    ENDPOINTS.tenantConfig.getByCode(tenantCode)
  )

  // Cache tenant config
  await AsyncStorage.setItem(STORAGE_KEYS.TENANT_CONFIG, JSON.stringify(response.data))

  return response.data
}

/**
 * Get cached tenant configuration
 */
export const getCachedTenantConfig = async (): Promise<TenantConfig | null> => {
  const configData = await AsyncStorage.getItem(STORAGE_KEYS.TENANT_CONFIG)
  return configData ? JSON.parse(configData) : null
}

export default apiClient
