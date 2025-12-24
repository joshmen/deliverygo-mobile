/**
 * Order Card Component
 * Displays order information with actions to rate or re-order/track
 * Adapted from template for API integration
 */

import React from 'react'
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { Order } from '../../types'

// Components
import Typo from '../common/Typo'

// Theme
import colors from '../../theme/colors'
import { radius, spacingX, spacingY } from '../../theme/spacing'
import { normalizeY } from '../../utils/normalize'

interface Props {
  item: Order
  isTrack?: boolean
  onRate?: (orderId: string) => void
  onReOrder?: (orderId: string) => void
}

const OrderCard: React.FC<Props> = ({ item, isTrack = false, onRate, onReOrder }) => {
  const navigation = useNavigation()

  const handleRate = () => {
    if (onRate) {
      onRate(item.id)
    }
  }

  const handleTrackOrReOrder = () => {
    if (isTrack) {
      // Navigate to track order screen
      // @ts-ignore - navigation types not fully configured
      navigation.navigate('OrderDetails', {
        orderId: item.id
      })
    } else if (onReOrder) {
      onReOrder(item.id)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch {
      return dateString
    }
  }

  // Format total amount
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  // Get store image (placeholder)
  const getStoreImage = () => {
    return require('../../assets/images/placeholder-store.png')
  }

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          source={getStoreImage()}
          style={styles.img}
          defaultSource={require('../../assets/images/placeholder-store.png')}
        />
        <View style={{ flex: 1, justifyContent: 'center', gap: spacingY._10 }}>
          <View style={styles.textRow}>
            <Typo style={styles.name} numberOfLines={1}>
              {item.store.name}
            </Typo>
            <Typo style={styles.serialNumber} numberOfLines={1}>
              #{item.orderNumber}
            </Typo>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Typo style={styles.name}>{formatPrice(item.totalAmount)}</Typo>
            <Typo style={{ color: colors.textGray }}>
              {'  '}|{'  '}
              {formatDate(item.createdAt)}
            </Typo>
          </View>
        </View>
      </View>
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.white }]}
          onPress={handleRate}
        >
          <Typo style={styles.buttonTitle}>Rate</Typo>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleTrackOrReOrder}
        >
          <Typo style={[styles.buttonTitle, { color: colors.white }]}>
            {isTrack ? 'Track' : 'Re-Order'}
          </Typo>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacingY._15,
    borderColor: colors.lightGray,
    marginHorizontal: spacingY._15,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    gap: spacingX._15,
  },
  img: {
    backgroundColor: colors.lightGray,
    height: normalizeY(60),
    width: normalizeY(60),
    borderRadius: radius._12,
    resizeMode: 'cover',
  },
  name: {
    fontWeight: '600',
  },
  serialNumber: {
    textDecorationLine: 'underline',
    color: colors.textGray,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    gap: spacingX._15,
    marginTop: spacingY._20,
  },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    height: normalizeY(40),
    borderRadius: radius._12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonTitle: {
    fontWeight: '600',
    color: colors.primary,
  },
})

export default OrderCard
