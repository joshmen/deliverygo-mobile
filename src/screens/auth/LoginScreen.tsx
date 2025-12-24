/**
 * Login Screen
 * Multi-role login for Store Owners and Drivers
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { useAuth } from '../../contexts/AuthContext'
import { useTenantConfig } from '../../contexts/TenantConfigContext'
import { TENANT_CODE } from '../../config/constants'

const LoginScreen: React.FC = () => {
  const { login } = useAuth()
  const { getPrimaryColor, getAppName } = useTenantConfig()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const primaryColor = getPrimaryColor()
  const appName = getAppName()

  const handleLogin = async () => {
    // Validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password')
      return
    }

    try {
      setIsLoading(true)
      await login({ email: email.trim(), password, tenantCode: TENANT_CODE })
      // Navigation will be handled by AppNavigator based on user.role
    } catch (error: any) {
      console.error('Login error:', error)
      Alert.alert(
        'Login Failed',
        error?.response?.data?.message || 'Invalid email or password'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = (role: 'StoreOwner' | 'Driver' | 'Customer') => {
    if (role === 'StoreOwner') {
      setEmail('owner@demo-restaurant.com')
      setPassword('StoreOwner123!')
    } else if (role === 'Driver') {
      setEmail('driver@demo-restaurant.com')
      setPassword('Driver123!')
    } else if (role === 'Customer') {
      setEmail('customer@demo-restaurant.com')
      setPassword('Customer123!')
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={[styles.appName, { color: primaryColor }]}>
            {appName}
          </Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              testID="email-input"
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              testID="password-input"
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              editable={!isLoading}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            testID="login-button"
            style={[
              styles.loginButton,
              { backgroundColor: primaryColor },
              isLoading && styles.loginButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Demo Credentials */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Demo Accounts:</Text>
            <View style={styles.demoButtons}>
              <TouchableOpacity
                style={[styles.demoButton, { borderColor: primaryColor }]}
                onPress={() => fillDemoCredentials('StoreOwner')}
                disabled={isLoading}
              >
                <Text style={[styles.demoButtonText, { color: primaryColor }]}>
                  Store Owner
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.demoButton, { borderColor: primaryColor }]}
                onPress={() => fillDemoCredentials('Driver')}
                disabled={isLoading}
              >
                <Text style={[styles.demoButtonText, { color: primaryColor }]}>
                  Driver
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.demoButton, styles.demoButtonFull, { borderColor: primaryColor }]}
              onPress={() => fillDemoCredentials('Customer')}
              disabled={isLoading}
            >
              <Text style={[styles.demoButtonText, { color: primaryColor }]}>
                Customer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 40
  },
  title: {
    fontSize: 24,
    color: '#666',
    marginBottom: 8
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#999'
  },
  form: {
    width: '100%'
  },
  inputContainer: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F9F9F9'
  },
  loginButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  loginButtonDisabled: {
    opacity: 0.6
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  demoSection: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textAlign: 'center'
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  demoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 6
  },
  demoButtonFull: {
    marginTop: 8,
    width: '100%'
  },
  demoButtonText: {
    fontSize: 13,
    fontWeight: '600'
  }
})

export default LoginScreen
