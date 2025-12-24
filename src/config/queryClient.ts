/**
 * React Query Configuration for React Native
 * Includes online manager setup for network state handling
 */

import { QueryClient } from '@tanstack/react-query'
import { onlineManager } from '@tanstack/react-query'
import * as Network from 'expo-network'
import { Platform } from 'react-native'

/**
 * Setup online manager to detect network connectivity
 * This ensures React Query pauses queries when offline
 */
export const setupOnlineManager = () => {
  // Only setup on native platforms (not web)
  if (Platform.OS !== 'web') {
    onlineManager.setEventListener((setOnline) => {
      const subscription = Network.addNetworkStateListener((state) => {
        setOnline(!!state.isConnected)
      })
      return () => {
        subscription.remove()
      }
    })
  }
}

/**
 * Create and configure QueryClient with sensible defaults
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Retry failed requests up to 3 times
        retry: 3,
        // Time before data is considered stale (5 minutes)
        staleTime: 1000 * 60 * 5,
        // Time to keep unused data in cache (30 minutes)
        gcTime: 1000 * 60 * 30,
        // Refetch on window focus (useful for app coming to foreground)
        refetchOnWindowFocus: true,
        // Refetch when reconnecting to network
        refetchOnReconnect: true,
        // Don't refetch on mount if data is fresh
        refetchOnMount: true,
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
        // Show error notifications
        onError: (error) => {
          console.error('[Mutation Error]:', error)
        },
      },
    },
  })
}

// Singleton instance
let queryClient: QueryClient | null = null

/**
 * Get or create QueryClient singleton
 */
export const getQueryClient = (): QueryClient => {
  if (!queryClient) {
    queryClient = createQueryClient()
  }
  return queryClient
}

export default getQueryClient
