/**
 * DeliveryGo Mobile App
 * Main entry point with all providers configured
 */

import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'

// Providers
import { AuthProvider } from './src/contexts/AuthContext'
import { TenantConfigProvider } from './src/contexts/TenantConfigContext'

// Navigation
import AppNavigator from './src/navigation/AppNavigator'

// Query Client Configuration
import { getQueryClient, setupOnlineManager } from './src/config/queryClient'

// Setup online manager for React Query (network state detection)
setupOnlineManager()

// Get singleton query client
const queryClient = getQueryClient()

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <TenantConfigProvider>
            <AuthProvider>
              <StatusBar style="auto" />
              <AppNavigator />
            </AuthProvider>
          </TenantConfigProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
