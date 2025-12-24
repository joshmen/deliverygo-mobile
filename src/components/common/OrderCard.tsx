/**
 * Order Card component from template
 * Displays order information with status
 */
import React, { useMemo } from 'react'
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import * as Icons from 'phosphor-react-native'
import Typo from './Typo'
import colors from '../../theme/colors'
import { spacingX, spacingY, radius, normalizeY } from '../../theme/spacing'
import { getOrderImage } from '../../config/placeholderImages'

interface Order {
  id: string
  orderNumber: string
  storeName: string
  totalAmount: number
  status: string
  createdAt: string
  itemCount: number
  imageUrl?: string
}

interface OrderCardProps {
  order: Order
  onPress: () => void
  index?: number
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress, index = 0 }) => {
  // Get placeholder image based on index
  const placeholderImage = useMemo(() => getOrderImage(index), [index])

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return colors.orange
      case 'preparing':
        return colors.blue
      case 'ready':
        return colors.purple
      case 'in_transit':
      case 'delivering':
        return colors.lightBlue
      case 'delivered':
        return colors.green
      case 'cancelled':
        return colors.red
      default:
        return colors.gray
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return Icons.Clock
      case 'preparing':
        return Icons.CookingPot
      case 'ready':
        return Icons.CheckCircle
      case 'in_transit':
      case 'delivering':
        return Icons.Bicycle
      case 'delivered':
        return Icons.CheckCircle
      case 'cancelled':
        return Icons.XCircle
      default:
        return Icons.CircleNotch
    }
  }

  const statusColor = getStatusColor(order.status)
  const StatusIcon = getStatusIcon(order.status)

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Main Row with Image */}
      <View style={styles.mainRow}>
        {/* Order Image */}
        <Image
          source={order.imageUrl ? { uri: order.imageUrl } : placeholderImage}
          style={styles.orderImage}
        />

        {/* Order Info */}
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Typo size={16} weight="600">
                Order #{order.orderNumber}
              </Typo>
              <Typo size={13} color={colors.textGray} style={{ marginTop: spacingY._3 }}>
                {new Date(order.createdAt).toLocaleDateString()}
              </Typo>
            </View>
            <Icons.CaretRight size={20} color={colors.textGray} weight="bold" />
          </View>

          {/* Store Info */}
          <View style={styles.storeRow}>
            <Icons.Storefront size={16} color={colors.primary} weight="bold" />
            <Typo size={13} weight="500">
              {order.storeName}
            </Typo>
          </View>

          {/* Details */}
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Typo size={14} weight="600" color={colors.dark}>
                ${order.totalAmount.toFixed(2)}
              </Typo>
            </View>
            <Typo size={12} color={colors.textGray}>
              {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
            </Typo>
          </View>
        </View>
      </View>

      {/* Status */}
      <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
        <StatusIcon size={16} color={statusColor} weight="bold" />
        <Typo size={13} weight="600" color={statusColor}>
          {order.status.replace('_', ' ').toUpperCase()}
        </Typo>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius._12,
    padding: spacingX._15,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  mainRow: {
    flexDirection: 'row',
    gap: spacingX._15,
    marginBottom: spacingY._12,
  },
  orderImage: {
    width: normalizeY(60),
    height: normalizeY(60),
    borderRadius: radius._10,
    backgroundColor: colors.lightGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacingY._8,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._5,
    marginBottom: spacingY._8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._8,
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._8,
    borderRadius: radius._8,
    alignSelf: 'flex-start',
  },
})

export default OrderCard
