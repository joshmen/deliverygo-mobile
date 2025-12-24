/**
 * Verification Screen
 * OTP verification for phone/email
 */

import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Icons from 'phosphor-react-native'

// Template components
import { Typo, AppButton, ScreenComponent } from '../../components/common'

// Template theme
import colors from '../../theme/colors'
import { spacingX, spacingY, radius } from '../../theme/spacing'

// Route params
type VerificationRouteProp = RouteProp<
  { Verification: { email?: string; phone?: string; type: 'email' | 'phone' } },
  'Verification'
>

const VerificationScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<VerificationRouteProp>()
  const insets = useSafeAreaInsets()

  const { email, phone, type } = route.params || { type: 'email', email: 'user@example.com' }

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  // Refs for OTP inputs
  const inputRefs = useRef<(TextInput | null)[]>([])

  // Timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all filled
    if (index === 5 && value && newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp)
    }
  }

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (otpToVerify?: string[]) => {
    const codeToVerify = otpToVerify || otp
    const code = codeToVerify.join('')

    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code')
      return
    }

    setIsVerifying(true)

    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false)
      // In real app, verify with backend
      if (code === '123456') {
        Alert.alert('Success', 'Verification successful!', [
          { text: 'OK', onPress: () => navigation.navigate('Login' as never) }
        ])
      } else {
        Alert.alert('Error', 'Invalid verification code. Try 123456 for demo.')
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    }, 1500)
  }

  const handleResend = () => {
    if (!canResend) return

    setCanResend(false)
    setResendTimer(60)
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
    Alert.alert('Code Sent', `A new verification code has been sent to your ${type}`)
  }

  const maskedContact = type === 'email'
    ? email?.replace(/(.{2})(.*)(?=@)/, (_, a, b) => a + '*'.repeat(b.length))
    : phone?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) ***-$3')

  return (
    <ScreenComponent>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

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
            <Icons.EnvelopeSimple size={48} color={colors.primary} weight="bold" />
          </View>
        </View>

        {/* Title */}
        <Typo size={28} weight="700" style={{ textAlign: 'center', marginBottom: spacingY._10 }}>
          Verification Code
        </Typo>

        <Typo size={15} color={colors.textGray} style={{ textAlign: 'center', marginBottom: spacingY._40 }}>
          We've sent a 6-digit code to{'\n'}
          <Typo weight="600" color={colors.dark}>
            {maskedContact}
          </Typo>
        </Typo>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref }}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
                index === otp.findIndex(d => d === '') && styles.otpInputActive
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Resend */}
        <View style={styles.resendContainer}>
          <Typo size={14} color={colors.textGray}>
            Didn't receive the code?
          </Typo>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Typo size={14} weight="600" color={colors.primary} style={{ marginLeft: spacingX._5 }}>
                Resend Code
              </Typo>
            </TouchableOpacity>
          ) : (
            <Typo size={14} color={colors.textGray} style={{ marginLeft: spacingX._5 }}>
              Resend in {resendTimer}s
            </Typo>
          )}
        </View>

        <View style={{ flex: 1 }} />

        {/* Verify Button */}
        <AppButton
          title="Verify"
          onPress={() => handleVerify()}
          loading={isVerifying}
          disabled={otp.some(digit => digit === '')}
          style={{ marginBottom: spacingY._20 }}
        />

        {/* Demo Hint */}
        <View style={styles.hintBox}>
          <Icons.Info size={16} color={colors.primary} weight="bold" />
          <Typo size={12} color={colors.textGray} style={{ marginLeft: spacingX._8, flex: 1 }}>
            Demo: Use code <Typo weight="600">123456</Typo> to verify
          </Typo>
        </View>
      </View>
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacingY._25
  },
  otpInput: {
    width: 50,
    height: 60,
    borderRadius: radius._12,
    borderWidth: 2,
    borderColor: colors.lightGray,
    backgroundColor: colors.background,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: colors.dark
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10'
  },
  otpInputActive: {
    borderColor: colors.primary,
    backgroundColor: colors.white
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingY._30
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacingX._12,
    borderRadius: radius._8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: spacingY._20
  }
})

export default VerificationScreen
