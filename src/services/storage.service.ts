/**
 * AsyncStorage Service
 * Wrapper for secure data persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage'

// Storage keys
const KEYS = {
  AUTH_TOKEN: '@deliverygo:auth_token',
  USER_DATA: '@deliverygo:user_data',
  TENANT_CONFIG: '@deliverygo:tenant_config',
  THEME_PREFERENCE: '@deliverygo:theme_preference'
}

// Auth token storage
export const storeToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token)
  } catch (error) {
    console.error('[Storage] Error storing token:', error)
    throw error
  }
}

export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(KEYS.AUTH_TOKEN)
  } catch (error) {
    console.error('[Storage] Error getting token:', error)
    return null
  }
}

export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.AUTH_TOKEN)
  } catch (error) {
    console.error('[Storage] Error removing token:', error)
  }
}

// User data storage
export const storeUserData = async (user: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(user)
    await AsyncStorage.setItem(KEYS.USER_DATA, jsonValue)
  } catch (error) {
    console.error('[Storage] Error storing user data:', error)
    throw error
  }
}

export const getStoredUserData = async (): Promise<any | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.USER_DATA)
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (error) {
    console.error('[Storage] Error getting user data:', error)
    return null
  }
}

export const removeUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.USER_DATA)
  } catch (error) {
    console.error('[Storage] Error removing user data:', error)
  }
}

// Tenant config storage
export const storeTenantConfig = async (config: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(config)
    await AsyncStorage.setItem(KEYS.TENANT_CONFIG, jsonValue)
  } catch (error) {
    console.error('[Storage] Error storing tenant config:', error)
    throw error
  }
}

export const getStoredTenantConfig = async (): Promise<any | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.TENANT_CONFIG)
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (error) {
    console.error('[Storage] Error getting tenant config:', error)
    return null
  }
}

// Clear all auth data (logout)
export const clearAuth = async (): Promise<void> => {
  try {
    await Promise.all([removeToken(), removeUserData()])
    console.log('[Storage] Auth data cleared')
  } catch (error) {
    console.error('[Storage] Error clearing auth data:', error)
  }
}

// Clear all app data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear()
    console.log('[Storage] All data cleared')
  } catch (error) {
    console.error('[Storage] Error clearing all data:', error)
  }
}

// Generic get/set for any data
export const setItem = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = typeof value === 'string' ? value : JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (error) {
    console.error(`[Storage] Error setting ${key}:`, error)
    throw error
  }
}

export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value === null) return null

    try {
      return JSON.parse(value) as T
    } catch {
      return value as T
    }
  } catch (error) {
    console.error(`[Storage] Error getting ${key}:`, error)
    return null
  }
}

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error(`[Storage] Error removing ${key}:`, error)
  }
}
