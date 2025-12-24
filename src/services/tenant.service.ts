/**
 * Tenant Configuration Service
 * Fetches and caches tenant branding and settings
 */

import apiClient, { handleApiError } from './api/client'
import { ENDPOINTS } from '../config/constants'
import { storeTenantConfig, getStoredTenantConfig } from './storage.service'

export interface TenantConfig {
  tenantId: string
  code: string
  name: string
  contactEmail?: string
  branding: {
    logoUrl: string | null
    primaryColor: string
    secondaryColor: string
    appDisplayName: string
  }
  payment: {
    enabledPaymentMethods: Array<'CASH' | 'CARDONDELIVERY' | 'ONLINEPAYMENT' | 'DIGITALWALLET'>
  }
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

/**
 * Fetch tenant configuration from API
 */
export const fetchTenantConfig = async (tenantCode: string): Promise<TenantConfig> => {
  try {
    console.log('[Tenant] Fetching config for:', tenantCode)

    const response = await apiClient.get<TenantConfig>(
      ENDPOINTS.tenantConfig.getByCode(tenantCode)
    )

    const config = response.data

    // Store config locally
    await storeTenantConfig(config)

    console.log('[Tenant] Config loaded:', config.name)

    return config
  } catch (error) {
    console.error('[Tenant] Failed to fetch config:', error)
    throw new Error(handleApiError(error))
  }
}

/**
 * Get cached tenant config or fetch if not available
 */
export const getTenantConfig = async (tenantCode: string): Promise<TenantConfig> => {
  try {
    // Try to get cached config first
    const cached = await getStoredTenantConfig()

    if (cached && cached.code === tenantCode) {
      console.log('[Tenant] Using cached config')
      return cached
    }

    // Fetch from API if not cached or different tenant
    return await fetchTenantConfig(tenantCode)
  } catch (error) {
    console.error('[Tenant] Error getting config:', error)
    throw error
  }
}

/**
 * Refresh tenant config (force fetch from API)
 */
export const refreshTenantConfig = async (tenantCode: string): Promise<TenantConfig> => {
  console.log('[Tenant] Refreshing config...')
  return await fetchTenantConfig(tenantCode)
}

/**
 * Get default theme colors (fallback if tenant config fails)
 */
export const getDefaultTheme = () => {
  return {
    primaryColor: '#FF6B6B',
    secondaryColor: '#4ECDC4',
    appName: 'DeliveryGo'
  }
}

export default {
  fetchTenantConfig,
  getTenantConfig,
  refreshTenantConfig,
  getDefaultTheme
}
