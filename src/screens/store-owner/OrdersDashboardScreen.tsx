/**
 * Orders Dashboard Screen (Store Owner)
 * Displays today's orders with status filtering
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator
} from 'react-native'
import { useStoreOwnerNavigation } from '../../hooks/useTypedNavigation'
import { useQuery } from '@tanstack/react-query'
import { usePrimaryColor } from '../../store/tenant.store'
import { useUser } from '../../store/auth.store'
import apiClient from '../../services/api/client'
import { ENDPOINTS } from '../../config/constants'

// Order type (should match backend)
interface Order {
  id: string
  orderNumber: string
  status: 'Pending' | 'Accepted' | 'OnTheWay' | 'Delivered' | 'Cancelled'
  customer: {
    name: string
    phone: string
  }
  totalAmount: number
  createdAt: string
  items: Array<{
    productName: string
    quantity: number
    price: number
  }>
}

// Status filter options
type OrderStatus = 'All' | 'Pending' | 'Accepted' | 'OnTheWay' | 'Delivered'

const OrdersDashboardScreen: React.FC = () => {
  const navigation = useStoreOwnerNavigation()
  const user = useUser()
  const primaryColor = usePrimaryColor()

  const [statusFilter, setStatusFilter] = useState<OrderStatus>('All')

  // TODO: Get actual storeId from user profile or API
  const storeId = '30000000-0000-0000-0000-000000000001' // Demo store ID

  // Fetch today's orders using React Query
  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['orders', storeId],
    queryFn: async () => {
      const response = await apiClient.get<Order[]>(ENDPOINTS.orders.getTodayOrders, {
        params: { storeId }
      })
      return response.data
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    staleTime: 10000 // Consider data stale after 10 seconds
  })

  // Filter orders by status
  const filteredOrders = orders?.filter((order) => {
    if (statusFilter === 'All') return true
    return order.status === statusFilter
  }) || []

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#FF9500'
      case 'Accepted':
        return '#007AFF'
      case 'OnTheWay':
        return '#5856D6'
      case 'Delivered':
        return '#34C759'
      case 'Cancelled':
        return '#FF3B30'
      default:
        return '#8E8E93'
    }
  }

  // Navigate to order detail
  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetail' as any, { orderId })
  }

  // Render order card
  const renderOrderCard = ({ item }: { item: Order }) => {
    const itemsCount = item.items.reduce((sum, i) => sum + i.quantity, 0)

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => handleOrderPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            <Text style={styles.customerName}>{item.customer.name}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <Text style={styles.itemsCount}>{itemsCount} items</Text>
          <Text style={styles.orderTime}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>

        <View style={styles.orderFooter}>
          <Text style={[styles.totalAmount, { color: primaryColor }]}>
            ${item.totalAmount.toFixed(2)}
          </Text>
          <TouchableOpacity
            style={[styles.viewButton, { borderColor: primaryColor }]}
            onPress={() => handleOrderPress(item.id)}
          >
            <Text style={[styles.viewButtonText, { color: primaryColor }]}>View Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  // Render filter tabs
  const renderFilterTab = (status: OrderStatus) => {
    const isActive = statusFilter === status
    const count = status === 'All'
      ? orders?.length || 0
      : orders?.filter((o) => o.status === status).length || 0

    return (
      <TouchableOpacity
        key={status}
        style={[
          styles.filterTab,
          isActive && { backgroundColor: primaryColor, borderColor: primaryColor }
        ]}
        onPress={() => setStatusFilter(status)}
      >
        <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
          {status} ({count})
        </Text>
      </TouchableOpacity>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    )
  }

  // Error state
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load orders</Text>
        <Text style={styles.errorDetail}>{(error as Error).message}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: primaryColor }]}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Empty state
  if (filteredOrders.length === 0) {
    return (
      <View style={styles.container}>
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {['All', 'Pending', 'Accepted', 'OnTheWay', 'Delivered'].map((status) =>
            renderFilterTab(status as OrderStatus)
          )}
        </View>

        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No {statusFilter.toLowerCase()} orders</Text>
          <Text style={styles.emptySubtext}>Orders will appear here when customers place them</Text>
        </View>
      </View>
    )
  }

  // Main content
  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['All', 'Pending', 'Accepted', 'OnTheWay', 'Delivered'] as OrderStatus[]).map((status) =>
          renderFilterTab(status)
        )}
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={primaryColor}
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
    backgroundColor: '#F5F5F5'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 8,
    backgroundColor: '#FFFFFF'
  },
  filterTabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500'
  },
  filterTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  listContent: {
    padding: 16
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  customerName: {
    fontSize: 14,
    color: '#666'
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600'
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  itemsCount: {
    fontSize: 14,
    color: '#666'
  },
  orderTime: {
    fontSize: 14,
    color: '#999'
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666'
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 8
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  }
})

export default OrdersDashboardScreen
