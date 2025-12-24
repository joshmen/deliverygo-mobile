/**
 * Deliveries Screen (Driver)
 * View assigned deliveries and update status
 */

import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Ionicons } from '@expo/vector-icons'
import { usePrimaryColor } from '../../store/tenant.store'
import { useUser } from '../../store/auth.store'
import apiClient from '../../services/api/client'
import { ENDPOINTS } from '../../config/constants'

// Delivery type
interface Delivery {
  id: string
  orderNumber: string
  status: 'Accepted' | 'OnTheWay' | 'Delivered'
  storeName: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  totalAmount: number
  createdAt: string
  items: Array<{
    productName: string
    quantity: number
  }>
}

const DeliveriesScreen: React.FC = () => {
  const user = useUser()
  const primaryColor = usePrimaryColor()
  const queryClient = useQueryClient()

  // Fetch assigned deliveries
  const {
    data: deliveries,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['assignedDeliveries', user?.id],
    queryFn: async () => {
      const response = await apiClient.get<Delivery[]>(ENDPOINTS.orders.getAssignedOrders, {
        params: { driverId: user?.id }
      })
      return response.data
    },
    refetchInterval: 15000, // Auto-refresh every 15 seconds
    staleTime: 5000
  })

  // Update delivery status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await apiClient.patch(ENDPOINTS.orders.updateOrderStatus(orderId), {
        status
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignedDeliveries'] })
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message || 'Failed to update status')
    }
  })

  // Handle status update
  const handleUpdateStatus = (delivery: Delivery) => {
    const nextStatus = delivery.status === 'Accepted' ? 'On The Way' : 'Delivered'

    Alert.alert(
      'Update Status',
      `Mark this delivery as "${nextStatus}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            updateStatusMutation.mutate({
              orderId: delivery.id,
              status: nextStatus.replace(' ', '')
            })
          }
        }
      ]
    )
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return '#007AFF'
      case 'OnTheWay':
        return '#5856D6'
      case 'Delivered':
        return '#34C759'
      default:
        return '#8E8E93'
    }
  }

  // Render delivery card
  const renderDeliveryCard = ({ item }: { item: Delivery }) => {
    const itemsCount = item.items.reduce((sum, i) => sum + i.quantity, 0)
    const canUpdate = item.status !== 'Delivered'

    return (
      <View style={styles.deliveryCard}>
        {/* Delivery Header */}
        <View style={styles.deliveryHeader}>
          <View>
            <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
            <Text style={styles.storeName}>{item.storeName}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.customerInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#8E8E93" />
            <Text style={styles.infoText}>{item.customerName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color="#8E8E93" />
            <Text style={styles.infoText}>{item.customerPhone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#8E8E93" />
            <Text style={styles.infoText} numberOfLines={2}>
              {item.deliveryAddress}
            </Text>
          </View>
        </View>

        {/* Items Summary */}
        <View style={styles.itemsSummary}>
          <Text style={styles.itemsText}>{itemsCount} items</Text>
          <Text style={[styles.totalAmount, { color: primaryColor }]}>
            ${item.totalAmount.toFixed(2)}
          </Text>
        </View>

        {/* Action Button */}
        {canUpdate && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: primaryColor }]}
            onPress={() => handleUpdateStatus(item)}
            disabled={updateStatusMutation.isPending}
          >
            {updateStatusMutation.isPending ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>
                  {item.status === 'Accepted' ? 'Start Delivery' : 'Complete Delivery'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={styles.loadingText}>Loading deliveries...</Text>
      </View>
    )
  }

  // Error state
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorText}>Failed to load deliveries</Text>
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
  if (!deliveries || deliveries.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="bicycle-outline" size={80} color="#8E8E93" />
        <Text style={styles.emptyText}>No active deliveries</Text>
        <Text style={styles.emptySubtext}>
          New delivery assignments will appear here
        </Text>
      </View>
    )
  }

  // Main content
  return (
    <View style={styles.container}>
      <FlatList
        data={deliveries}
        renderItem={renderDeliveryCard}
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
    backgroundColor: '#F2F2F7'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F2F2F7'
  },
  listContent: {
    padding: 16
  },
  deliveryCard: {
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
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4
  },
  storeName: {
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
    color: '#FFF',
    fontWeight: '600'
  },
  customerInfo: {
    marginBottom: 16
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1
  },
  itemsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0'
  },
  itemsText: {
    fontSize: 14,
    color: '#666'
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
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
    marginTop: 16,
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
    marginTop: 16,
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  }
})

export default DeliveriesScreen
