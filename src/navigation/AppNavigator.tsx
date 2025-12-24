/**
 * App Navigator
 * Root navigation with auth state and role-based routing
 */

import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import type { RootStackParamList } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { useTenantConfig } from '../contexts/TenantConfigContext'
import SplashScreen from '../screens/SplashScreen'
import AuthNavigator from './AuthNavigator'
import StoreOwnerNavigator from './StoreOwnerNavigator'
import DriverNavigator from './DriverNavigator'
import CustomerNavigator from './CustomerNavigator'

const Stack = createStackNavigator<RootStackParamList>()

const AppNavigator: React.FC = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth()
  const { isLoaded: configLoaded } = useTenantConfig()
  const [isAppReady, setIsAppReady] = useState(false)

  // Show splash screen while initializing
  if (!isAppReady || authLoading || !configLoaded) {
    return <SplashScreen onReady={() => setIsAppReady(true)} />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animationEnabled: true,
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 300,
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 300,
              },
            },
          },
        }}
      >
        {!isAuthenticated ? (
          // Not authenticated - show login
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user?.role === 'StoreOwner' ? (
          // Authenticated as Store Owner
          <Stack.Screen name="StoreOwnerApp" component={StoreOwnerNavigator} />
        ) : user?.role === 'Driver' ? (
          // Authenticated as Driver
          <Stack.Screen name="DriverApp" component={DriverNavigator} />
        ) : user?.role === 'Customer' ? (
          // Authenticated as Customer
          <Stack.Screen name="CustomerApp" component={CustomerNavigator} />
        ) : (
          // Fallback to auth if role is unknown
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
