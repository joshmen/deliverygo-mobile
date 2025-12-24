/**
 * Restaurant Card Component
 * Displays restaurant information with rating, delivery info, and estimated time
 * Adapted from template for API integration
 */

import React from 'react'
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Icons from 'phosphor-react-native'

// Components
import Typo from '../common/Typo'

// Theme
import colors from '../../theme/colors'
import { radius, spacingX, spacingY } from '../../theme/spacing'
import { normalizeY } from '../../utils/normalize'

interface Store {
  id: string
  name: string
  description?: string
  address?: string
  phone?: string
  imageUrl?: string
  isActive: boolean
  rating?: number
  deliveryFee?: number
  estimatedDeliveryTime?: number
  categories?: string[]
}

interface Props {
  store: Store
  onPress?: () => void
}

function RestaurantCard({ store, onPress }: Props) {
  const navigation = useNavigation()

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      // @ts-ignore - navigation types not fully configured
      navigation.navigate('StoreDetails', {
        storeId: store.id,
        storeName: store.name
      })
    }
  }

  // Format categories for display
  const categoriesText = store.categories?.join(' - ') || store.description || 'Food & Beverages'

  // Default values
  const rating = store.rating || 4.5
  const deliveryFee = store.deliveryFee || 0
  const estimatedTime = store.estimatedDeliveryTime || 30

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        {store.imageUrl ? (
          <Image
            source={{ uri: store.imageUrl }}
            style={styles.restaurantImg}
            defaultSource={require('../../assets/images/placeholder-store.png')}
          />
        ) : (
          <View style={[styles.restaurantImg, styles.placeholderImg]}>
            <Icons.Storefront size={48} color={colors.textGray} weight="thin" />
          </View>
        )}
      </TouchableOpacity>

      <Typo size={18} weight="500" numberOfLines={1}>
        {store.name}
      </Typo>

      <Typo size={13} color={colors.textGray} weight="500" numberOfLines={1} style={styles.category}>
        {categoriesText}
      </Typo>

      <View style={styles.row}>
        {/* Rating */}
        <View style={styles.iconRow}>
          <Icons.Star size={20} color={colors.primary} weight="fill" />
          <Typo size={13} weight="600">
            {rating.toFixed(1)}
          </Typo>
        </View>

        {/* Delivery Fee */}
        <View style={styles.iconRow}>
          <Icons.Truck size={20} color={colors.primary} weight="bold" />
          <Typo size={13}>
            {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
          </Typo>
        </View>

        {/* Estimated Time */}
        <View style={styles.iconRow}>
          <Icons.ClockCountdown size={20} color={colors.primary} weight="bold" />
          <Typo size={13}>
            {estimatedTime} min
          </Typo>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacingY._10,
  },
  restaurantImg: {
    height: normalizeY(150),
    width: '100%',
    backgroundColor: colors.lightGray,
    borderRadius: radius._12,
    resizeMode: 'cover',
  },
  placeholderImg: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  category: {
    marginTop: -spacingY._5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._20,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._5,
  },
})

export default RestaurantCard
