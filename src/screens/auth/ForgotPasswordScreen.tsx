/**
 * Forgot Password Screen
 * Reset password via email
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
  Platform
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Icons from 'phosphor-react-native'

// Template components
import { Typo, AppButton, ScreenComponent } from '../../components/common'

// Template theme
import colors from '../../theme/colors'
import { spacingX, spacingY, radius } from '../../theme/spacing'

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSendResetLink = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setEmailSent(true)
    }, 1500)
  }

  const handleBackToLogin = () => {
    navigation.navigate('Login' as never)
  }

  if (emailSent) {
    return (
      <ScreenComponent>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

        <View style={[styles.container, { paddingTop: insets.top + spacingY._20 }]}>
          {/* Success Icon */}
          <View style={styles.successIconContainer}>
            <View style={styles.successCircle}>
              <Icons.PaperPlaneTilt size={48} color={colors.white} weight="bold" />
            </View>
          </View>

          {/* Title */}
          <Typo size={28} weight="700" style={{ textAlign: 'center', marginBottom: spacingY._10 }}>
            Check Your Email
          </Typo>

          <Typo size={15} color={colors.textGray} style={{ textAlign: 'center', marginBottom: spacingY._30, lineHeight: 22 }}>
            We've sent password reset instructions to{'\n'}
            <Typo weight="600" color={colors.dark}>
              {email}
            </Typo>
          </Typo>

          {/* Instructions */}
          <View style={styles.instructionsCard}>
            <View style={styles.instructionRow}>
              <View style={styles.stepNumber}>
                <Typo size={14} weight="700" color={colors.primary}>
                  1
                </Typo>
              </View>
              <Typo size={14} color={colors.textGray} style={{ flex: 1 }}>
                Check your email inbox and spam folder
              </Typo>
            </View>

            <View style={styles.instructionRow}>
              <View style={styles.stepNumber}>
                <Typo size={14} weight="700" color={colors.primary}>
                  2
                </Typo>
              </View>
              <Typo size={14} color={colors.textGray} style={{ flex: 1 }}>
                Click the reset password link
              </Typo>
            </View>

            <View style={styles.instructionRow}>
              <View style={styles.stepNumber}>
                <Typo size={14} weight="700" color={colors.primary}>
                  3
                </Typo>
              </View>
              <Typo size={14} color={colors.textGray} style={{ flex: 1 }}>
                Create a new password
              </Typo>
            </View>
          </View>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Icons.Info size={18} color={colors.primary} weight="bold" />
            <Typo size={13} color={colors.textGray} style={{ marginLeft: spacingX._10, flex: 1 }}>
              The reset link will expire in 1 hour
            </Typo>
          </View>

          <View style={{ flex: 1 }} />

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <AppButton
              title="Resend Email"
              onPress={handleSendResetLink}
              variant="outline"
              style={{ marginBottom: spacingY._12 }}
            />
            <AppButton
              title="Back to Login"
              onPress={handleBackToLogin}
            />
          </View>
        </View>
      </ScreenComponent>
    )
  }

  return (
    <ScreenComponent>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={[styles.container, { paddingTop: insets.top + spacingY._20 }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icons.ArrowLeft size={24} color={colors.dark} weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Icons.LockKey size={48} color={colors.primary} weight="bold" />
            </View>
          </View>

          {/* Title */}
          <Typo size={28} weight="700" style={{ textAlign: 'center', marginBottom: spacingY._10 }}>
            Forgot Password?
          </Typo>

          <Typo size={15} color={colors.textGray} style={{ textAlign: 'center', marginBottom: spacingY._40, lineHeight: 22 }}>
            No worries! Enter your email address and we'll send you instructions to reset your password
          </Typo>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Icons.EnvelopeSimple size={20} color={colors.textGray} weight="bold" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={colors.textGray}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={{ flex: 1 }} />

          {/* Submit Button */}
          <AppButton
            title="Send Reset Link"
            onPress={handleSendResetLink}
            loading={isLoading}
            style={{ marginBottom: spacingY._15 }}
          />

          {/* Back to Login */}
          <TouchableOpacity onPress={handleBackToLogin} style={styles.backButton}>
            <Icons.CaretLeft size={16} color={colors.primary} weight="bold" />
            <Typo size={14} weight="600" color={colors.primary} style={{ marginLeft: spacingX._5 }}>
              Back to Login
            </Typo>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenComponent>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._25
  },
  header: {
    marginBottom: spacingY._30
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacingY._25
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: radius._50,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius._12,
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingHorizontal: spacingX._15,
    marginBottom: spacingY._20
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
  backButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacingY._15,
    marginBottom: spacingY._20
  },
  successIconContainer: {
    alignItems: 'center',
    marginTop: spacingY._50,
    marginBottom: spacingY._25
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: radius._50,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  instructionsCard: {
    backgroundColor: colors.background,
    borderRadius: radius._15,
    padding: spacingX._20,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: spacingY._20
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacingY._15
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: radius._14,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacingX._12
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    padding: spacingX._15,
    borderRadius: radius._12,
    borderWidth: 1,
    borderColor: colors.primary + '30',
    marginBottom: spacingY._20
  },
  actionsContainer: {
    paddingBottom: spacingY._20
  }
})

export default ForgotPasswordScreen
