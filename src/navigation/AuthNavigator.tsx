/**
 * Auth Navigator
 * Authentication stack for onboarding, login, signup, and password recovery
 */

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import type { AuthStackParamList } from '../types'
import OnboardingScreen from '../screens/auth/OnboardingScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import SignUpScreen from '../screens/auth/SignUpScreen'
import VerificationScreen from '../screens/auth/VerificationScreen'
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen'

const Stack = createStackNavigator<AuthStackParamList>()

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  )
}

export default AuthNavigator
