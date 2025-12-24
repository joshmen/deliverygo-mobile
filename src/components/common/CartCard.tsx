/**
 * Cart Item Card component from template
 * Displays cart items with quantity controls
 */
import React from 'react'
import { View, StyleSheet, Image, Dimensions } from 'react-native'
import * as Icons from 'phosphor-react-native'
import Typo from './Typo'
import AppIcon from './AppIcon'
import colors from '../../theme/colors'
import { spacingX, spacingY, radius, normalizeY } from '../../theme/spacing'
import { menuItemImage } from '../../config/placeholderImages'

const { width } = Dimensions.get('window')

interface CartItem {
  productId: string
  productName: string
  price?: number
  productPrice?: number
  quantity: number
  imageUrl?: string
  notes?: string
}

interface CartCardProps {
  item: CartItem
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
}

const CartCard: React.FC<CartCardProps> = ({
  item,
  onIncrement,
  onDecrement,
  onRemove
}) => {
  return (
    <View style={styles.cardContainer}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={item.imageUrl ? { uri: item.imageUrl } : menuItemImage}
          style={styles.image}
        />
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Typo size={16} weight="500" style={styles.titleText}>
            {item.productName}
          </Typo>
          <AppIcon
            icon={Icons.X}
            iconWeight="bold"
            iconSize={15}
            iconColor={colors.white}
            containerStyle={styles.deleteIcon}
            onPress={onRemove}
          />
        </View>

        <Typo size={16} weight="600" color={colors.primary}>
          ${(item.productPrice || item.price || 0).toFixed(2)}
        </Typo>

        {item.notes && (
          <Typo size={12} color={colors.textGray}>
            {item.notes}
          </Typo>
        )}

        {/* Quantity Controls */}
        <View style={styles.quantityRow}>
          <Typo size={13} color={colors.textGray}>
            Quantity
          </Typo>
          <View style={styles.quantityContainer}>
            <AppIcon
              icon={Icons.Minus}
              iconWeight="bold"
              iconSize={15}
              iconColor={colors.white}
              containerStyle={styles.iconButton}
              onPress={onDecrement}
            />
            <Typo weight="600" style={styles.quantityText}>
              {item.quantity}
            </Typo>
            <AppIcon
              icon={Icons.Plus}
              iconWeight="bold"
              iconSize={15}
              iconColor={colors.white}
              containerStyle={styles.iconButton}
              onPress={onIncrement}
            />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    gap: spacingX._15,
    backgroundColor: colors.white,
    padding: spacingX._12,
    borderRadius: radius._12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  imageContainer: {
    backgroundColor: colors.background,
    height: width * 0.25,
    width: width * 0.25,
    borderRadius: radius._12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: spacingY._5,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleText: {
    flex: 1,
    marginRight: spacingX._8,
    lineHeight: normalizeY(20),
  },
  deleteIcon: {
    backgroundColor: colors.red,
    height: normalizeY(24),
    width: normalizeY(24),
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._10,
  },
  iconButton: {
    backgroundColor: colors.primary,
    height: normalizeY(28),
    width: normalizeY(28),
  },
  quantityText: {
    minWidth: 30,
    textAlign: 'center',
  },
})

export default CartCard
