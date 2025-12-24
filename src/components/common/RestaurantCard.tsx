/**
 * Restaurant/Store Card component from template
 * Displays store information with image, rating, delivery info
 */
import React, { useMemo } from 'react'
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native'
import * as Icons from 'phosphor-react-native'
import Typo from './Typo'
import colors from '../../theme/colors'
import { normalizeY } from '../../theme/spacing'
import { radius, spacingX, spacingY } from '../../theme/spacing'
import { getRestaurantImage } from '../../config/placeholderImages'

interface Store {
  id: string
  name: string
  description?: string
  address?: string
  imageUrl?: string
  isOpen: boolean
  rating?: number
  deliveryTime?: string
}

interface RestaurantCardProps {
  item: Store
  onPress: () => void
  index?: number // For consistent placeholder image selection
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ item, onPress, index = 0 }) => {
  // Get placeholder image based on index for consistency
  const placeholderImage = useMemo(() => getRestaurantImage(index), [index])

  return (
    <View style={{ gap: spacingY._10 }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Image
          source={item.imageUrl ? { uri: item.imageUrl } : placeholderImage}
          style={styles.restaurantImg}
        />
        {!item.isOpen && (
          <View style={styles.closedOverlay}>
            <Typo size={12} color={colors.white} weight="600">
              CLOSED
            </Typo>
          </View>
        )}
      </TouchableOpacity>

      <Typo size={18} weight="500">
        {item.name}
      </Typo>

      {item.description && (
        <Typo size={13} style={styles.restaurantCategory}>
          {item.description}
        </Typo>
      )}

      <View style={styles.row}>
        {item.rating && (
          <View style={styles.iconRow}>
            <Icons.Star size={20} color={colors.primary} weight="fill" />
            <Typo weight="600">{item.rating.toFixed(1)}</Typo>
          </View>
        )}

        <View style={styles.iconRow}>
          <Icons.Truck size={20} color={colors.primary} weight="bold" />
          <Typo size={13}>Free</Typo>
        </View>

        <View style={styles.iconRow}>
          <Icons.ClockCountdown size={20} color={colors.primary} weight="bold" />
          <Typo size={13}>{item.deliveryTime || '20 min'}</Typo>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  restaurantImg: {
    height: normalizeY(150),
    width: '100%',
    backgroundColor: colors.lightGray,
    borderRadius: radius._12,
  },
  placeholderImg: {
    height: normalizeY(150),
    width: '100%',
    backgroundColor: colors.lightGray,
    borderRadius: radius._12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: radius._12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantCategory: {
    color: colors.textGray,
    fontWeight: '500',
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
