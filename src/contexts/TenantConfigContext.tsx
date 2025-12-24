/**
 * Tenant Configuration Context
 * Manages tenant branding and payment configuration
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { TenantConfig } from '../types'
import * as apiService from '../services/api'
import { TENANT_CODE, APP_CONFIG } from '../config/constants'

// Tenant config context type
interface TenantConfigContextType {
  // State
  config: TenantConfig | null
  isLoaded: boolean
  isLoading: boolean
  error: Error | null

  // Actions
  loadConfig: (tenantCode?: string) => Promise<void>

  // Helpers
  getPrimaryColor: () => string
  getSecondaryColor: () => string
  getAppName: () => string
  getLogoUrl: () => string | null
}

// Create context
const TenantConfigContext = createContext<TenantConfigContextType | undefined>(undefined)

// Provider props
interface TenantConfigProviderProps {
  children: ReactNode
}

/**
 * Tenant Config Provider Component
 */
export const TenantConfigProvider: React.FC<TenantConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<TenantConfig | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Load tenant configuration
  const loadConfig = async (tenantCode: string = TENANT_CODE) => {
    try {
      setIsLoading(true)
      setError(null)

      // Try to get cached config first
      const cachedConfig = await apiService.getCachedTenantConfig()
      if (cachedConfig) {
        setConfig(cachedConfig)
      }

      // Fetch fresh config from API
      const freshConfig = await apiService.fetchTenantConfig(tenantCode)
      setConfig(freshConfig)
      setIsLoaded(true)
    } catch (err) {
      const error = err as Error
      console.error('Error loading tenant config:', error)
      setError(error)

      // If we have cached config, use it despite the error
      const cachedConfig = await apiService.getCachedTenantConfig()
      if (cachedConfig) {
        setConfig(cachedConfig)
        setIsLoaded(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Get primary color (with fallback)
  const getPrimaryColor = (): string => {
    return config?.branding.primaryColor || APP_CONFIG.DEFAULT_PRIMARY_COLOR
  }

  // Get secondary color (with fallback)
  const getSecondaryColor = (): string => {
    return config?.branding.secondaryColor || APP_CONFIG.DEFAULT_SECONDARY_COLOR
  }

  // Get app name (with fallback)
  const getAppName = (): string => {
    return config?.branding.appDisplayName || 'DeliveryGo'
  }

  // Get logo URL
  const getLogoUrl = (): string | null => {
    return config?.branding.logoUrl || null
  }

  // Load config on mount
  useEffect(() => {
    loadConfig()
  }, [])

  const value: TenantConfigContextType = {
    config,
    isLoaded,
    isLoading,
    error,
    loadConfig,
    getPrimaryColor,
    getSecondaryColor,
    getAppName,
    getLogoUrl
  }

  return <TenantConfigContext.Provider value={value}>{children}</TenantConfigContext.Provider>
}

/**
 * useTenantConfig Hook
 * Access tenant config context in components
 */
export const useTenantConfig = (): TenantConfigContextType => {
  const context = useContext(TenantConfigContext)

  if (context === undefined) {
    throw new Error('useTenantConfig must be used within a TenantConfigProvider')
  }

  return context
}
