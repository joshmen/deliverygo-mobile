/**
 * Payment Success Screen
 * Shown after successful order placement
 */

import React, { useEffect } from 'react'
import {
  View,
  StyleSheet,
  StatusBar,
  Animated
} from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useAppNavigation } from '../../hooks/useTypedNavigation'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Icons from 'phosphor-react-native'

// Template components
import { Typo, AppButton } from '../../components/common'

// Template theme
import colors from '../../theme/colors'
import { spacingX, spacingY, radius } from '../../theme/spacing'

// Route params
type PaymentSuccessRouteProp = RouteProp<
  { PaymentSuccess: { orderId: string; orderNumber: string; total: number } },
  'PaymentSuccess'
>

const PaymentSuccessScreen: React.FC = () => {
  const navigation = useAppNavigation()
  const route = useRoute<PaymentSuccessRouteProp>()
  const insets = useSafeAreaInsets()

  const { orderId, orderNumber, total } = route.params || {
    orderId: '123',
    orderNumber: '#12345',
    total: 45.99
  }

  // Animation values
  const scaleAnim = new Animated.Value(0)
  const fadeAnim = new Animated.Value(0)

  useEffect(() => {
    // Animate checkmark
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start()
  }, [])

  const handleViewOrder = () => {
    navigation.navigate('OrderDetails', { orderId })
  }

  const handleBackToHome = () => {
    navigation.navigate('Browse', { screen: 'Home' })
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={[styles.content, { paddingTop: insets.top + spacingY._30 }]}>
        {/* Success Animation */}
        <Animated.View
          style={[
            styles.successIconContainer,
            {
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.successCircle}>
            <Icons.CheckCircle size={80} color={colors.white} weight="fill" />
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Typo size={28} weight="700" color={colors.green} style={{ textAlign: 'center' }}>
            Order Placed!
          </Typo>
          <Typo size={16} color={colors.textGray} style={{ textAlign: 'center', marginTop: spacingY._10 }}>
            Your order has been successfully placed
          </Typo>
        </Animated.View>

        {/* Order Details Card */}
        <Animated.View style={[styles.orderCard, { opacity: fadeAnim }]}>
          <View style={styles.orderRow}>
            <Typo size={14} color={colors.textGray}>
              Order Number
            </Typo>
            <Typo size={16} weight="600">
              {orderNumber}
            </Typo>
          </View>

          <View style={styles.divider} />

          <View style={styles.orderRow}>
            <Typo size={14} color={colors.textGray}>
              Total Amount
            </Typo>
            <Typo size={18} weight="700" color={colors.primary}>
              ${total.toFixed(2)}
            </Typo>
          </View>

          <View style={styles.divider} />

          <View style={styles.orderRow}>
            <Typo size={14} color={colors.textGray}>
              Status
            </Typo>
            <View style={styles.statusBadge}>
              <Icons.Clock size={14} color={colors.orange} weight="bold" />
              <Typo size={13} weight="600" color={colors.orange} style={{ marginLeft: spacingX._5 }}>
                Pending
              </Typo>
            </View>
          </View>
        </Animated.View>

        {/* Info Banner */}
        <Animated.View style={[styles.infoBanner, { opacity: fadeAnim }]}>
          <Icons.Info size={20} color={colors.primary} weight="bold" />
          <Typo size={13} color={colors.textGray} style={{ marginLeft: spacingX._10, flex: 1 }}>
            You'll receive a notification once the store accepts your order
          </Typo>
        </Animated.View>

        {/* Estimated Delivery */}
        <Animated.View style={[styles.deliveryInfo, { opacity: fadeAnim }]}>
          <Icons.Motorcycle size={24} color={colors.primary} weight="bold" />
          <View style={{ marginLeft: spacingX._12, flex: 1 }}>
            <Typo size={14} weight="600">
              Estimated Delivery
            </Typo>
            <Typo size={13} color={colors.textGray} style={{ marginTop: spacingY._3 }}>
              25-35 minutes
            </Typo>
          </View>
        </Animated.View>

        <View style={{ flex: 1 }} />

        {/* Action Buttons */}
        <Animated.View style={[styles.actionsContainer, { opacity: fadeAnim }]}>
          <AppButton
            title="Track Order"
            onPress={handleViewOrder}
            icon={<Icons.MapPin size={20} color={colors.white} weight="bold" />}
            style={{ marginBottom: spacingY._12 }}
          />
          <AppButton
            title="Back to Home"
            onPress={handleBackToHome}
            variant="outline"
          />
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  content: {
    flex: 1,
    paddingHorizontal: spacingX._20
  },
  successIconContainer: {
    alignItems: 'center',
    marginTop: spacingY._50,
    marginBottom: spacingY._25
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: radius._60,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  textContainer: {
    marginBottom: spacingY._30
  },
  orderCard: {
    backgroundColor: colors.background,
    borderRadius: radius._15,
    padding: spacingX._20,
    borderWidth: 1,
    borderColor: colors.lightGray
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacingY._10
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: spacingY._5
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.orange + '20',
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._6,
    borderRadius: radius._20
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    padding: spacingX._15,
    borderRadius: radius._12,
    marginTop: spacingY._20,
    borderWidth: 1,
    borderColor: colors.primary + '30'
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacingX._15,
    borderRadius: radius._12,
    marginTop: spacingY._15,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed'
  },
  actionsContainer: {
    paddingBottom: spacingY._20
  }
})

export default PaymentSuccessScreen
