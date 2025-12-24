/**
 * Category Item Component
 * Displays a product/item card with image, price, and add-to-cart button
 * Generic component that works with any item data structure
 * Adapted from template for flexible integration
 */

import React from 'react'
import { StyleSheet, TouchableOpacity, View, Image, ImageSourcePropType } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Icons from 'phosphor-react-native'

// Components
import Typo from '../common/Typo'

// Theme
import colors from '../../theme/colors'
import { radius, spacingX, spacingY } from '../../theme/spacing'
import { normalizeY } from '../../utils/normalize'
import { Dimensions } from 'react-native'

const { height: screenHeight } = Dimensions.get('window')

interface CategoryItemData {
  id: string
  name: string
  description?: string
  price: number
  image?: ImageSourcePropType | string
  imageUrl?: string
}

interface Props {
  item: CategoryItemData
  onAddPress?: (item: CategoryItemData) => void
  onPress?: () => void
}

function CategoryItem({ item, onAddPress, onPress }: Props) {
  const navigation = useNavigation()

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      // Default navigation to item details
      // @ts-ignore - navigation types not fully configured
      navigation.navigate('StoreDetails', {
        itemId: item.id,
        itemName: item.name,
      })
    }
  }

  const handleAddPress = () => {
    if (onAddPress) {
      onAddPress(item)
    }
  }

  // Get image source
  const getImageSource = (): ImageSourcePropType | { uri: string } | undefined => {
    if (item.image) {
      return typeof item.image === 'string' ? { uri: item.image } : item.image
    }
    if (item.imageUrl) {
      return { uri: item.imageUrl }
    }
    // Return a default placeholder
    return require('../../assets/images/placeholder-store.png')
  }

  const imageSource = getImageSource()

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {imageSource && (
        <Image
          source={imageSource}
          style={styles.itemImg}
          defaultSource={require('../../assets/images/placeholder-store.png')}
        />
      )}

      <Typo style={styles.itemName} numberOfLines={2}>
        {item.name}
      </Typo>

      {item.description && (
        <Typo
          style={styles.itemDescription}
          numberOfLines={2}
        >
          {item.description}
        </Typo>
      )}

      <View style={styles.itemRow}>
        <Typo style={styles.price}>
          ${item.price.toFixed(2)}
        </Typo>
        <TouchableOpacity
          style={styles.plusIcon}
          onPress={handleAddPress}
          activeOpacity={0.7}
        >
          <Icons.Plus size={15} weight="bold" color={colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    height: screenHeight * 0.2,
    width: '47%',
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._10,
    borderRadius: radius._16,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    gap: spacingY._5,
  },
  itemImg: {
    height: '48%',
    width: '85%',
    alignSelf: 'center',
    marginBottom: spacingY._5,
    resizeMode: 'contain',
    borderRadius: radius._8,
  },
  itemName: {
    fontWeight: '600',
    fontSize: 14,
  },
  itemDescription: {
    color: colors.gray,
    fontWeight: '500',
    fontSize: 12,
    marginTop: -spacingY._3,
  },
  plusIcon: {
    height: normalizeY(25),
    width: normalizeY(25),
    borderRadius: radius._20,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacingY._5,
  },
  price: {
    fontWeight: '600',
    fontSize: 14,
  },
})

export default CategoryItem
