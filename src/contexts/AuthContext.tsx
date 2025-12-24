/**
 * Authentication Context
 * Manages user authentication state and JWT tokens
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User, LoginRequest } from '../types'
import * as apiService from '../services/api'

// Auth context type
interface AuthContextType {
  // State
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider props
interface AuthProviderProps {
  children: ReactNode
}

/**
 * Auth Provider Component
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from storage
  const initialize = async () => {
    try {
      setIsLoading(true)

      const storedToken = await apiService.getStoredToken()
      const storedUser = await apiService.getStoredUser()

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(storedUser)
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      // Clear invalid data
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Login function
  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true)

      const response = await apiService.login(credentials)

      setToken(response.accessToken)
      setUser(response.user)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Clear state first (synchronous, no loading state to avoid flashing)
      setToken(null)
      setUser(null)

      // Then call logout API (async, fire-and-forget)
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
      // State already cleared above
    }
  }

  // Initialize on mount
  useEffect(() => {
    initialize()
  }, [])

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    initialize
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth Hook
 * Access auth context in components
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
