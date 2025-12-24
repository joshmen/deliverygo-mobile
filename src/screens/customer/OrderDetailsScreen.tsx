/**
 * Order Details Screen (Customer)
 * Track order status and view order details with template-style UI
 */

import React from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Linking
} from 'react-native'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Icons from 'phosphor-react-native'
import apiClient from '../../services/api/client'
import { ENDPOINTS } from '../../config/constants'

// Template components
import { Typo, AppIcon, AppButton } from '../../components/common'

// Template theme
import colors from '../../theme/colors'
import { spacingX, spacingY, radius } from '../../theme/spacing'

// Order type
interface OrderDetail {
  id: string
  orderNumber: string
  status: 'Pending' | 'Accepted' | 'OnTheWay' | 'Delivered' | 'Cancelled'
  storeName: string
  storePhone: string
  totalAmount: number
  createdAt: string
  deliveryAddress: string
  deliveryNotes?: string
  items: Array<{
    productName: string
    quantity: number
    price: number
    notes?: string
  }>
  driver?: {
    name: string
    phone: string
  }
}

// Route params
type OrderDetailsRouteProp = RouteProp<
  { OrderDetails: { orderId: string } },
  'OrderDetails'
>

const OrderDetailsScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<OrderDetailsRouteProp>()
  const { orderId } = route.params
  const insets = useSafeAreaInsets()

  // Fetch order details
  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['orderDetails', orderId],
    queryFn: async () => {
      const response = await apiClient.get<OrderDetail>(
        ENDPOINTS.customer.getOrderDetail(orderId)
      )
      return response.data
    },
    refetchInterval: 15000, // Auto-refresh every 15 seconds for live tracking
    staleTime: 5000
  })

  // Make phone call
  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`)
  }

  // Get status color using template theme
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return colors.orange
      case 'Accepted':
        return colors.blue
      case 'OnTheWay':
        return colors.purple
      case 'Delivered':
        return colors.green
      case 'Cancelled':
        return colors.red
      default:
        return colors.textGray
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return Icons.Clock
      case 'Accepted':
        return Icons.CheckCircle
      case 'OnTheWay':
        return Icons.Motorcycle
      case 'Delivered':
        return Icons.CheckCircle
      default:
        return Icons.CircleDashed
    }
  }

  // Get status steps with template icons
  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      { status: 'Pending', label: 'Order Placed', icon: Icons.Receipt },
      { status: 'Accepted', label: 'Accepted', icon: Icons.CheckCircle },
      { status: 'OnTheWay', label: 'On The Way', icon: Icons.Motorcycle },
      { status: 'Delivered', label: 'Delivered', icon: Icons.Package }
    ]

    const statusOrder = ['Pending', 'Accepted', 'OnTheWay', 'Delivered']
    const currentIndex = statusOrder.indexOf(currentStatus)

    return steps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentIndex,
      isActive: index === currentIndex
    }))
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Typo style={{ marginTop: spacingY._12, color: colors.textGray }}>
            Loading order details...
          </Typo>
        </View>
      </View>
    )
  }

  // Error state
  if (isError || !order) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <View style={styles.centerContainer}>
          <Icons.WarningCircle size={64} color={colors.red} weight="thin" />
          <Typo size={18} weight="600" style={{ marginTop: spacingY._15, color: colors.red }}>
            Failed to load order
          </Typo>
          <Typo size={14} color={colors.textGray} style={{ marginTop: spacingY._8, textAlign: 'center' }}>
            {error instanceof Error ? error.message : 'Order not found'}
          </Typo>
          <AppButton
            title="Retry"
            onPress={() => refetch()}
            style={{ marginTop: spacingY._20 }}
          />
        </View>
      </View>
    )
  }

  const statusSteps = getStatusSteps(order.status)
  const isActive = ['Pending', 'Accepted', 'OnTheWay'].includes(order.status)

  const StatusIcon = getStatusIcon(order.status)

  // Main content
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header with Back Button */}
      <View style={[styles.header, { paddingTop: insets.top + spacingY._15 }]}>
        <AppIcon
          icon={Icons.ArrowLeft}
          onPress={() => navigation.goBack()}
        />
        <Typo size={18} weight="600" style={{ flex: 1, marginLeft: spacingX._12 }}>
          Order #{order.orderNumber}
        </Typo>
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}
        >
          <StatusIcon size={14} color={colors.white} weight="bold" />
          <Typo size={12} weight="600" color={colors.white} style={{ marginLeft: spacingX._5 }}>
            {order.status}
          </Typo>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />
        }
      >
        {/* Order Date */}
        <View style={styles.dateSection}>
          <Icons.CalendarBlank size={18} color={colors.textGray} weight="bold" />
          <Typo size={13} color={colors.textGray} style={{ marginLeft: spacingX._8 }}>
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typo>
        </View>

        {/* Status Timeline - only for active orders */}
        {isActive && order.status !== 'Cancelled' && (
          <View style={styles.section}>
            <Typo size={16} weight="600" style={{ marginBottom: spacingY._15 }}>
              Order Status
            </Typo>
            {statusSteps.map((step, index) => {
              const StepIcon = step.icon
              return (
                <View key={step.status} style={styles.timelineStep}>
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.timelineIcon,
                        {
                          backgroundColor: step.isCompleted
                            ? colors.primary
                            : step.isActive
                            ? colors.primary + '40'
                            : colors.lightGray
                        }
                      ]}
                    >
                      <StepIcon
                        size={20}
                        color={step.isCompleted || step.isActive ? colors.white : colors.textGray}
                        weight="bold"
                      />
                    </View>
                    {index < statusSteps.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          { backgroundColor: step.isCompleted ? colors.primary : colors.lightGray }
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.timelineRight}>
                    <Typo
                      size={15}
                      weight={step.isActive ? '600' : '500'}
                      color={step.isActive ? colors.primary : colors.dark}
                    >
                      {step.label}
                    </Typo>
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* Store Info */}
        <View style={styles.section}>
          <Typo size={16} weight="600" style={{ marginBottom: spacingY._15 }}>
            Store Details
          </Typo>
          <View style={styles.infoRow}>
            <Icons.Storefront size={22} color={colors.primary} weight="bold" />
            <Typo size={15} style={styles.infoText}>
              {order.storeName}
            </Typo>
          </View>
          <TouchableOpacity style={styles.infoRow} onPress={() => handleCall(order.storePhone)}>
            <Icons.Phone size={22} color={colors.primary} weight="bold" />
            <Typo size={15} style={styles.infoText} color={colors.primary}>
              {order.storePhone}
            </Typo>
          </TouchableOpacity>
        </View>

        {/* Driver Info - only if assigned */}
        {order.driver && (
          <View style={styles.section}>
            <Typo size={16} weight="600" style={{ marginBottom: spacingY._15 }}>
              Driver Info
            </Typo>
            <View style={styles.infoRow}>
              <Icons.User size={22} color={colors.primary} weight="bold" />
              <Typo size={15} style={styles.infoText}>
                {order.driver.name}
              </Typo>
            </View>
            <TouchableOpacity style={styles.infoRow} onPress={() => handleCall(order.driver?.phone ?? '')}>
              <Icons.Phone size={22} color={colors.primary} weight="bold" />
              <Typo size={15} style={styles.infoText} color={colors.primary}>
                {order.driver.phone}
              </Typo>
            </TouchableOpacity>
          </View>
        )}

        {/* Delivery Address */}
        <View style={styles.section}>
          <Typo size={16} weight="600" style={{ marginBottom: spacingY._15 }}>
            Delivery Address
          </Typo>
          <View style={styles.infoRow}>
            <Icons.MapPin size={22} color={colors.primary} weight="bold" />
            <Typo size={15} style={styles.infoText}>
              {order.deliveryAddress}
            </Typo>
          </View>
          {order.deliveryNotes && (
            <View style={styles.infoRow}>
              <Icons.Info size={22} color={colors.primary} weight="bold" />
              <Typo size={14} color={colors.textGray} style={styles.infoText}>
                {order.deliveryNotes}
              </Typo>
            </View>
          )}
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Typo size={16} weight="600" style={{ marginBottom: spacingY._15 }}>
            Order Items
          </Typo>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <Typo size={15} weight="600" color={colors.textGray} style={styles.itemQuantity}>
                  {item.quantity}x
                </Typo>
                <View style={styles.itemDetails}>
                  <Typo size={15} weight="500">
                    {item.productName}
                  </Typo>
                  {item.notes && (
                    <Typo size={13} color={colors.textGray} style={{ fontStyle: 'italic', marginTop: spacingY._4 }}>
                      {item.notes}
                    </Typo>
                  )}
                </View>
              </View>
              <Typo size={15} weight="600">
                ${(item.price * item.quantity).toFixed(2)}
              </Typo>
            </View>
          ))}

          {/* Order Summary */}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Typo size={14} color={colors.textGray}>
              Subtotal
            </Typo>
            <Typo size={14} weight="500">
              $
              {order.items
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}
            </Typo>
          </View>
          <View style={styles.summaryRow}>
            <Typo size={14} color={colors.textGray}>
              Delivery Fee
            </Typo>
            <Typo size={14} weight="500">
              $5.00
            </Typo>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Typo size={17} weight="600">
              Total
            </Typo>
            <Typo size={19} weight="700" color={colors.primary}>
              ${order.totalAmount.toFixed(2)}
            </Typo>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacingX._30
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingX._20,
    paddingBottom: spacingY._15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._6,
    borderRadius: radius._20
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._12,
    backgroundColor: colors.white,
    marginTop: spacingY._8
  },
  section: {
    backgroundColor: colors.white,
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._20,
    marginTop: spacingY._8
  },
  timelineStep: {
    flexDirection: 'row',
    marginBottom: spacingY._12
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: spacingX._15
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: radius._20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: spacingY._5
  },
  timelineRight: {
    flex: 1,
    paddingTop: spacingY._10
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacingY._12
  },
  infoText: {
    marginLeft: spacingX._12,
    flex: 1
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacingY._15
  },
  itemLeft: {
    flexDirection: 'row',
    flex: 1,
    marginRight: spacingX._15
  },
  itemQuantity: {
    marginRight: spacingX._12,
    minWidth: 35
  },
  itemDetails: {
    flex: 1
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: spacingY._15
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._10
  }
})

export default OrderDetailsScreen
