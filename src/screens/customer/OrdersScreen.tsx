/**
 * Orders Screen (Customer) - Template Design
 * View order history and track current orders with modern UI
 */

import React, { useState } from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from 'react-native'
import { useCustomerOrdersNavigation } from '../../hooks/useTypedNavigation'
import { useQuery } from '@tanstack/react-query'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Icons from 'phosphor-react-native'
import { useUser } from '../../store/auth.store'
import apiClient from '../../services/api/client'
import { ENDPOINTS } from '../../config/constants'

// Template components
import { Typo, AppIcon, OrderCard, AppButton } from '../../components/common'

// Template theme
import colors from '../../theme/colors'
import { spacingX, spacingY, radius } from '../../theme/spacing'

// Order type
interface Order {
  id: string
  orderNumber: string
  status: string
  storeName: string
  totalAmount: number
  createdAt: string
  deliveryAddress: string
  itemCount: number
  items?: Array<{
    productName: string
    quantity: number
    price: number
  }>
}

// Status filter options
type OrderStatus = 'All' | 'Active' | 'Delivered' | 'Cancelled'

const OrdersScreen: React.FC = () => {
  const navigation = useCustomerOrdersNavigation()
  const user = useUser()
  const insets = useSafeAreaInsets()

  const [statusFilter, setStatusFilter] = useState<OrderStatus>('All')

  // Fetch customer orders
  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['customerOrders', user?.id],
    queryFn: async () => {
      const response = await apiClient.get<Order[]>(ENDPOINTS.customer.getOrders, {
        params: { customerId: user?.id }
      })
      // Transform data to include itemCount if items exist
      return response.data.map(order => ({
        ...order,
        itemCount: order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0
      }))
    },
    refetchInterval: 30000,
    staleTime: 10000
  })

  // Filter orders by status
  const filteredOrders = orders?.filter((order) => {
    if (statusFilter === 'All') return true
    if (statusFilter === 'Active')
      return ['pending', 'preparing', 'ready', 'in_transit', 'delivering'].includes(order.status.toLowerCase())
    if (statusFilter === 'Delivered') return order.status.toLowerCase() === 'delivered'
    if (statusFilter === 'Cancelled') return order.status.toLowerCase() === 'cancelled'
    return true
  }) || []

  // Navigate to order detail
  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetails', { orderId })
  }

  // Render filter tabs
  const renderFilterTab = (status: OrderStatus) => {
    const isActive = statusFilter === status
    const count =
      status === 'All'
        ? orders?.length || 0
        : status === 'Active'
        ? orders?.filter((o) => ['pending', 'preparing', 'ready', 'in_transit', 'delivering'].includes(o.status.toLowerCase()))
            .length || 0
        : orders?.filter((o) => o.status.toLowerCase() === status.toLowerCase()).length || 0

    return (
      <TouchableOpacity
        key={status}
        style={[
          styles.filterTab,
          isActive && styles.filterTabActive
        ]}
        onPress={() => setStatusFilter(status)}
        activeOpacity={0.7}
      >
        <Typo
          size={13}
          weight={isActive ? '600' : '500'}
          color={isActive ? colors.white : colors.textGray}
        >
          {status} ({count})
        </Typo>
      </TouchableOpacity>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + spacingY._15 }]}>
          <AppIcon
            icon={Icons.ArrowLeft}
            onPress={() => navigation.goBack()}
          />
          <Typo size={18} weight="600">
            My Orders
          </Typo>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Typo style={{ marginTop: spacingY._12 }} color={colors.textGray}>
            Loading orders...
          </Typo>
        </View>
      </View>
    )
  }

  // Error state
  if (isError) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + spacingY._15 }]}>
          <AppIcon
            icon={Icons.ArrowLeft}
            onPress={() => navigation.goBack()}
          />
          <Typo size={18} weight="600">
            My Orders
          </Typo>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.centerContainer}>
          <Icons.WarningCircle size={64} color={colors.red} weight="thin" />
          <Typo size={18} weight="600" style={{ marginTop: spacingY._15, color: colors.red }}>
            Failed to load orders
          </Typo>
          <Typo size={14} color={colors.textGray} style={{ marginTop: spacingY._8, textAlign: 'center' }}>
            {(error as Error).message}
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

  // Empty state
  if (filteredOrders.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

        {/* Header */}
        <View style={styles.header}>
          <AppIcon
            icon={Icons.ArrowLeft}
            onPress={() => navigation.goBack()}
          />
          <Typo size={18} weight="600">
            My Orders
          </Typo>
          <View style={{ width: 40 }} />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {(['All', 'Active', 'Delivered', 'Cancelled'] as OrderStatus[]).map((status) =>
            renderFilterTab(status)
          )}
        </View>

        <View style={styles.centerContainer}>
          <Icons.Receipt size={80} color={colors.textGray} weight="thin" />
          <Typo size={20} weight="600" style={{ marginTop: spacingY._20 }}>
            {statusFilter === 'All' ? 'No orders yet' : `No ${statusFilter.toLowerCase()} orders`}
          </Typo>
          <Typo size={14} color={colors.textGray} style={{ marginTop: spacingY._8, textAlign: 'center' }}>
            {statusFilter === 'All'
              ? 'Browse stores and place your first order'
              : 'Try changing the filter'}
          </Typo>
          {statusFilter === 'All' && (
            <AppButton
              title="Browse Stores"
              onPress={() => navigation.navigate('Stores' as never)}
              style={{ marginTop: spacingY._25 }}
            />
          )}
        </View>
      </View>
    )
  }

  // Main content
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacingY._15 }]}>
        <AppIcon
          icon={Icons.ArrowLeft}
          onPress={() => navigation.goBack()}
        />
        <Typo size={18} weight="600">
          My Orders
        </Typo>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['All', 'Active', 'Delivered', 'Cancelled'] as OrderStatus[]).map((status) =>
          renderFilterTab(status)
        )}
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <OrderCard
            order={item}
            index={index}
            onPress={() => handleOrderPress(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacingY._12 }} />}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacingX._30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingX._20,
    paddingBottom: spacingY._15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._15,
    backgroundColor: colors.white,
    gap: spacingX._10,
  },
  filterTab: {
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._8,
    borderRadius: radius._20,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  listContent: {
    padding: spacingX._20,
    paddingBottom: spacingY._30,
  },
})

export default OrdersScreen
