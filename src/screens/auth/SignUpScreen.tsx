/**
 * Sign Up Screen
 * User registration with email and password
 */

import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Icons from 'phosphor-react-native'

// Template components
import { Typo, AppButton, ScreenComponent } from '../../components/common'

// Template theme
import colors from '../../theme/colors'
import { spacingX, spacingY, radius } from '../../theme/spacing'

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSignUp = async () => {
    // Validation
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name')
      return
    }

    if (!email.trim() || !validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return
    }

    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number')
      return
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login' as never) }
      ])
    }, 1500)
  }

  return (
    <ScreenComponent>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.container, { paddingTop: insets.top + spacingY._20 }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icons.ArrowLeft size={24} color={colors.dark} weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Typo size={32} weight="700" style={{ marginBottom: spacingY._8 }}>
            Create Account
          </Typo>
          <Typo size={15} color={colors.textGray} style={{ marginBottom: spacingY._30 }}>
            Sign up to get started with your account
          </Typo>

          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Icons.User size={20} color={colors.textGray} weight="bold" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={colors.textGray}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Icons.EnvelopeSimple size={20} color={colors.textGray} weight="bold" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={colors.textGray}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Icons.Phone size={20} color={colors.textGray} weight="bold" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor={colors.textGray}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Icons.LockKey size={20} color={colors.textGray} weight="bold" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textGray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icons.Eye
                size={20}
                color={colors.textGray}
                weight={showPassword ? 'fill' : 'regular'}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Icons.LockKey size={20} color={colors.textGray} weight="bold" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={colors.textGray}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icons.Eye
                size={20}
                color={colors.textGray}
                weight={showConfirmPassword ? 'fill' : 'regular'}
              />
            </TouchableOpacity>
          </View>

          {/* Terms & Conditions */}
          <View style={styles.termsContainer}>
            <Typo size={13} color={colors.textGray} style={{ textAlign: 'center' }}>
              By signing up, you agree to our{' '}
              <Typo size={13} weight="600" color={colors.primary}>
                Terms of Service
              </Typo>
              {' '}and{' '}
              <Typo size={13} weight="600" color={colors.primary}>
                Privacy Policy
              </Typo>
            </Typo>
          </View>

          {/* Sign Up Button */}
          <AppButton
            title="Sign Up"
            onPress={handleSignUp}
            loading={isLoading}
            style={{ marginBottom: spacingY._20 }}
          />

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Typo size={14} color={colors.textGray}>
              Already have an account?{' '}
            </Typo>
            <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
              <Typo size={14} weight="600" color={colors.primary}>
                Log In
              </Typo>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenComponent>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: spacingX._25,
    paddingBottom: spacingY._30
  },
  header: {
    marginBottom: spacingY._25
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius._12,
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingHorizontal: spacingX._15,
    marginBottom: spacingY._15
  },
  inputIcon: {
    marginRight: spacingX._10
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 15,
    color: colors.dark
  },
  termsContainer: {
    marginBottom: spacingY._25,
    paddingHorizontal: spacingX._10
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacingY._20
  }
})

export default SignUpScreen
