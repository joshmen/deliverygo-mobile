/**
 * Authentication Store (Zustand with Persist Middleware)
 * Manages authentication state globally with secure persistence
 */

import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'
import * as SecureStore from 'expo-secure-store'
import * as authService from '../services/auth.service'
import { LoginRequest, LoginResponse } from '../services/auth.service'

// Secure storage adapter for Zustand persist middleware
const secureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name)
    } catch (error) {
      console.error('[SecureStorage] Error getting item:', error)
      return null
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value)
    } catch (error) {
      console.error('[SecureStorage] Error setting item:', error)
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name)
    } catch (error) {
      console.error('[SecureStorage] Error removing item:', error)
    }
  },
}

export interface User {
  id: string
  email: string
  fullName: string
  role: 'StoreOwner' | 'Driver' | 'Customer'
  tenantId: string
}

interface AuthState {
  // State
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isHydrated: boolean
  error: string | null

  // Actions
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  setHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,
      error: null,

      // Login action
      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true, error: null })

          const response: LoginResponse = await authService.login(credentials)

          set({
            token: response.token,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Login failed'

          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          })

          throw error
        }
      },

      // Logout action
      logout: async () => {
        try {
          set({ isLoading: true })

          await authService.logout()

          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          console.error('[AuthStore] Logout error:', error)
          // Still clear local state even if API call fails
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Set hydrated (called after store rehydration)
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'deliverygo-auth-storage',
      storage: createJSONStorage(() => secureStorage),
      // Only persist these fields (not isLoading, error, isHydrated)
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Called when storage is rehydrated
        state?.setHydrated()
      },
    }
  )
)

// Selectors (for convenience)
export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated)
export const useUserRole = () => useAuthStore((state) => state.user?.role)
export const useIsHydrated = () => useAuthStore((state) => state.isHydrated)

export default useAuthStore
