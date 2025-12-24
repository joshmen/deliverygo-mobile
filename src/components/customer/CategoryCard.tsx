/**
 * Category Card Component
 * Displays a selectable category card with icon and title
 * Generic component that works with any category data
 * Adapted from template for flexible integration
 */

import React from 'react'
import { StyleSheet, TouchableOpacity, View, Image, ImageSourcePropType } from 'react-native'

// Components
import Typo from '../common/Typo'

// Theme
import colors from '../../theme/colors'
import { normalizeY } from '../../utils/normalize'
import { radius, spacingX, spacingY } from '../../theme/spacing'

interface Category {
  id: string
  title: string
  image?: ImageSourcePropType | string
  icon?: ImageSourcePropType | string
}

interface Props {
  item: Category
  selected: string
  onSelect: (categoryId: string, categoryTitle: string) => void
  onPress?: () => void
}

function CategoryCard({ item, selected, onSelect, onPress }: Props) {
  const isSelected = selected === item.id

  const handlePress = () => {
    onSelect(item.id, item.title)

    // Optional callback if provided
    if (onPress) {
      setTimeout(() => {
        onPress()
      }, 100)
    }
  }

  // Determine which image to use (prioritize icon over image)
  const imageSource = item.icon || item.image

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.category,
        {
          backgroundColor: isSelected ? colors.yellow : colors.white,
        },
      ]}
    >
      <View
        style={[
          styles.categoryIcon,
          {
            backgroundColor: isSelected ? colors.white : colors.lightGray,
          },
        ]}
      >
        {imageSource ? (
          <Image
            source={
              typeof imageSource === 'string'
                ? { uri: imageSource }
                : imageSource
            }
            style={styles.categoryImg}
          />
        ) : (
          <View style={styles.categoryImg} />
        )}
      </View>
      <Typo size={13} style={styles.categoryName} numberOfLines={1}>
        {item.title}
      </Typo>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  category: {
    padding: spacingY._10,
    paddingEnd: spacingX._15,
    borderRadius: radius._20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryIcon: {
    padding: spacingY._8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius._20,
  },
  categoryImg: {
    height: normalizeY(22),
    width: normalizeY(22),
    resizeMode: 'contain',
  },
  categoryName: {
    fontWeight: '600',
    flex: 1,
  },
})

export default CategoryCard
