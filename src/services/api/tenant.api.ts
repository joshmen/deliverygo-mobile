/**
 * Tenant Configuration API
 * Functions for fetching tenant configuration and branding
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import apiClient from './client'
import { ENDPOINTS, STORAGE_KEYS } from '../../config/constants'
import type { TenantConfig } from '../../types'

/**
 * Fetch tenant configuration by tenant code
 * @param tenantCode - Unique tenant identifier
 * @returns Tenant configuration with branding and settings
 */
export const fetchTenantConfig = async (tenantCode: string): Promise<TenantConfig> => {
  try {
    const response = await apiClient.get<TenantConfig>(
      ENDPOINTS.tenantConfig.getByCode(tenantCode)
    )

    // Cache tenant config for offline access
    await AsyncStorage.setItem(
      STORAGE_KEYS.TENANT_CONFIG,
      JSON.stringify(response.data)
    )

    return response.data
  } catch (error) {
    console.error('[TenantAPI] Fetch config error:', error)
    throw error
  }
}

/**
 * Get cached tenant configuration from AsyncStorage
 * @returns Cached tenant configuration or null if not found
 */
export const getCachedTenantConfig = async (): Promise<TenantConfig | null> => {
  try {
    const configData = await AsyncStorage.getItem(STORAGE_KEYS.TENANT_CONFIG)
    return configData ? JSON.parse(configData) : null
  } catch (error) {
    console.error('[TenantAPI] Error getting cached config:', error)
    return null
  }
}

/**
 * Clear cached tenant configuration
 */
export const clearCachedTenantConfig = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TENANT_CONFIG)
  } catch (error) {
    console.error('[TenantAPI] Error clearing cached config:', error)
    throw error
  }
}

/**
 * Validate tenant configuration
 * @param tenantCode - Tenant code to validate
 * @returns True if tenant exists and is active
 */
export const validateTenantCode = async (tenantCode: string): Promise<boolean> => {
  try {
    const config = await fetchTenantConfig(tenantCode)
    return config.isActive
  } catch (error) {
    console.error('[TenantAPI] Validate tenant code error:', error)
    return false
  }
}
