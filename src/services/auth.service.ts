/**
 * Authentication Service
 * Handles login, logout, and token management
 */

import apiClient, { handleApiError } from './api/client'
import { ENDPOINTS, TENANT_CODE } from '../config/constants'
import { storeToken, storeUserData, clearAuth } from './storage.service'

export interface LoginRequest {
  email: string
  password: string
  tenantCode?: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    fullName: string
    role: 'StoreOwner' | 'Driver' | 'Customer'
    tenantId: string
  }
}

export interface RegisterRequest {
  tenantName: string
  tenantCode: string
  ownerName: string
  ownerEmail: string
  password: string
  contactEmail: string
}

/**
 * Login user and store token
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    console.log('[Auth] Logging in...', credentials.email)

    const response = await apiClient.post<LoginResponse>(
      ENDPOINTS.auth.login,
      {
        ...credentials,
        tenantCode: credentials.tenantCode || TENANT_CODE
      }
    )

    const { token, user } = response.data

    // Store token and user data
    await storeToken(token)
    await storeUserData(user)

    console.log('[Auth] Login successful', user.role)

    return response.data
  } catch (error) {
    console.error('[Auth] Login failed:', error)
    throw new Error(handleApiError(error))
  }
}

/**
 * Logout user and clear stored data
 */
export const logout = async (): Promise<void> => {
  try {
    console.log('[Auth] Logging out...')
    await clearAuth()
    console.log('[Auth] Logout successful')
  } catch (error) {
    console.error('[Auth] Logout error:', error)
    throw error
  }
}

/**
 * Register new tenant owner (for demo purposes)
 */
export const registerTenantOwner = async (
  data: RegisterRequest
): Promise<LoginResponse> => {
  try {
    console.log('[Auth] Registering tenant owner...')

    const response = await apiClient.post<LoginResponse>(
      ENDPOINTS.auth.registerTenantOwner,
      data
    )

    const { token, user } = response.data

    // Store token and user data
    await storeToken(token)
    await storeUserData(user)

    console.log('[Auth] Registration successful')

    return response.data
  } catch (error) {
    console.error('[Auth] Registration failed:', error)
    throw new Error(handleApiError(error))
  }
}

/**
 * Verify if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { getStoredToken } = await import('./storage.service')
  const token = await getStoredToken()
  return token !== null
}

export default {
  login,
  logout,
  registerTenantOwner,
  isAuthenticated
}
