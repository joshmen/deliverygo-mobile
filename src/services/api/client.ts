/**
 * API Client Configuration
 * Axios instance with JWT interceptors
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_BASE_URL, APP_CONFIG, STORAGE_KEYS } from '../../config/constants'
import type { ApiError } from '../../types'

/**
 * Create Axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: APP_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

/**
 * Request Interceptor
 * Automatically adds JWT token to all requests
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get JWT token from AsyncStorage
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

      // Add Authorization header if token exists
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Log request in development
      if (__DEV__) {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
      }

      return config
    } catch (error) {
      console.error('[API] Error in request interceptor:', error)
      return config
    }
  },
  (error: AxiosError) => {
    console.error('[API] Request error:', error)
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Handles errors and token expiration
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (__DEV__) {
      console.log(`[API] Response: ${response.config.url}`, response.status)
    }
    return response
  },
  async (error: AxiosError<ApiError>) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      console.log('[API] 401 Unauthorized - Clearing auth data')

      try {
        // Clear auth data
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.AUTH_TOKEN,
          STORAGE_KEYS.USER_DATA
        ])

        // Trigger app to navigate to login
        // This will be handled by AuthContext listening to storage changes
      } catch (storageError) {
        console.error('[API] Error clearing auth data:', storageError)
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('[API] Network error:', error.message)
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR'
      } as ApiError)
    }

    // Handle other errors
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      code: error.response?.data?.code || `HTTP_${error.response?.status}`,
      details: error.response?.data?.details
    }

    console.error('[API] Error:', apiError)
    return Promise.reject(apiError)
  }
)

/**
 * Helper function to get current JWT token
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  } catch (error) {
    console.error('[API] Error getting auth token:', error)
    return null
  }
}

/**
 * Helper function to set JWT token
 */
export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
  } catch (error) {
    console.error('[API] Error setting auth token:', error)
    throw error
  }
}

/**
 * Helper function to clear JWT token
 */
export const clearAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  } catch (error) {
    console.error('[API] Error clearing auth token:', error)
    throw error
  }
}

/**
 * Helper function to extract error message from API error
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Server responded with error
    if (error.response) {
      const data = error.response.data as any
      return data?.message || data?.detail || data?.title || 'An error occurred'
    }

    // Request was made but no response
    if (error.request) {
      return 'No response from server. Please check your connection.'
    }
  }

  // Something else happened
  return 'An unexpected error occurred'
}

export default apiClient
