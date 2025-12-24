/**
 * Tenant Configuration Store (Zustand)
 * Manages tenant branding and configuration
 */

import { create } from 'zustand'
import * as tenantService from '../services/tenant.service'
import { TenantConfig } from '../services/tenant.service'
import { TENANT_CODE } from '../config/constants'

interface TenantState {
  // State
  tenantCode: string
  config: TenantConfig | null
  isLoaded: boolean
  isLoading: boolean
  error: string | null

  // Actions
  loadTenantConfig: (code?: string) => Promise<void>
  refreshConfig: () => Promise<void>
  clearError: () => void

  // Derived state (computed)
  getPrimaryColor: () => string
  getSecondaryColor: () => string
  getAppName: () => string
  getLogoUrl: () => string | null
}

export const useTenantStore = create<TenantState>((set, get) => ({
  // Initial state
  tenantCode: TENANT_CODE,
  config: null,
  isLoaded: false,
  isLoading: false,
  error: null,

  // Load tenant config
  loadTenantConfig: async (code?: string) => {
    const tenantCode = code || get().tenantCode

    try {
      set({ isLoading: true, error: null })

      const config = await tenantService.getTenantConfig(tenantCode)

      set({
        config,
        tenantCode,
        isLoaded: true,
        isLoading: false,
        error: null
      })

      console.log('[TenantStore] Config loaded:', config.name)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load tenant config'

      set({
        config: null,
        isLoaded: false,
        isLoading: false,
        error: errorMessage
      })

      console.error('[TenantStore] Error loading config:', error)
      throw error
    }
  },

  // Refresh config (force fetch from API)
  refreshConfig: async () => {
    const { tenantCode } = get()

    try {
      set({ isLoading: true, error: null })

      const config = await tenantService.refreshTenantConfig(tenantCode)

      set({
        config,
        isLoaded: true,
        isLoading: false,
        error: null
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh config'

      set({
        isLoading: false,
        error: errorMessage
      })

      throw error
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Get primary color (with fallback)
  getPrimaryColor: () => {
    const { config } = get()
    return config?.branding.primaryColor || tenantService.getDefaultTheme().primaryColor
  },

  // Get secondary color (with fallback)
  getSecondaryColor: () => {
    const { config } = get()
    return config?.branding.secondaryColor || tenantService.getDefaultTheme().secondaryColor
  },

  // Get app name (with fallback)
  getAppName: () => {
    const { config } = get()
    return config?.branding.appDisplayName || tenantService.getDefaultTheme().appName
  },

  // Get logo URL
  getLogoUrl: () => {
    const { config } = get()
    return config?.branding.logoUrl || null
  }
}))

// Selectors (for convenience)
export const useTenantConfig = () => useTenantStore((state) => state.config)
export const useIsConfigLoaded = () => useTenantStore((state) => state.isLoaded)
export const usePrimaryColor = () => useTenantStore((state) => state.getPrimaryColor())
export const useSecondaryColor = () => useTenantStore((state) => state.getSecondaryColor())
export const useAppName = () => useTenantStore((state) => state.getAppName())

export default useTenantStore
