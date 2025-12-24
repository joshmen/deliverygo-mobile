/**
 * Splash Screen
 * Handles tenant bootstrap and initial app setup
 */

import React, { useEffect } from 'react'
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native'
import { useAuth } from '../contexts/AuthContext'
import { useTenantConfig } from '../contexts/TenantConfigContext'

interface SplashScreenProps {
  onReady: () => void
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onReady }) => {
  const { initialize: initializeAuth, isLoading: authLoading } = useAuth()
  const { loadConfig, isLoading: configLoading, getPrimaryColor, getAppName, getLogoUrl } = useTenantConfig()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Step 1: Load tenant configuration (branding)
        await loadConfig()

        // Step 2: Initialize auth state
        await initializeAuth()

        // Step 3: Navigate to next screen
        // Give a brief moment to show the splash screen
        setTimeout(() => {
          onReady()
        }, 500)
      } catch (error) {
        console.error('Error initializing app:', error)
        // Still proceed even if there's an error
        setTimeout(() => {
          onReady()
        }, 1000)
      }
    }

    initializeApp()
  }, [])

  const primaryColor = getPrimaryColor()
  const appName = getAppName()
  const logoUrl = getLogoUrl()

  return (
    <View style={[styles.container, { backgroundColor: primaryColor }]}>
      {/* Logo */}
      {logoUrl ? (
        <Image
          source={{ uri: logoUrl }}
          style={styles.logo}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>{appName.charAt(0)}</Text>
        </View>
      )}

      {/* App Name */}
      <Text style={styles.appName}>{appName}</Text>

      {/* Loading Indicator */}
      <ActivityIndicator
        size="large"
        color="#FFFFFF"
        style={styles.loader}
      />

      {/* Status Text */}
      <Text style={styles.statusText}>
        {configLoading ? 'Loading configuration...' :
         authLoading ? 'Initializing...' :
         'Ready!'}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40
  },
  loader: {
    marginBottom: 16
  },
  statusText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8
  }
})

export default SplashScreen
