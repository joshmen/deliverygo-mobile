/**
 * Categories Screen
 * Browse all food categories
 */

import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image
} from 'react-native'
import { useCustomerBrowseNavigation } from '../../hooks/useTypedNavigation'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Icons from 'phosphor-react-native'

// Template components
import { Typo, AppIcon, SearchBar } from '../../components/common'

// Template theme
import colors from '../../theme/colors'
import { spacingX, spacingY, radius } from '../../theme/spacing'

// Category type
interface Category {
  id: string
  name: string
  icon: any
  itemCount: number
  color: string
}

const CategoriesScreen: React.FC = () => {
  const navigation = useCustomerBrowseNavigation()
  const insets = useSafeAreaInsets()
  const [search, setSearch] = useState('')

  // Mock categories - replace with API call
  const allCategories: Category[] = [
    { id: '1', name: 'Pizza', icon: Icons.Pizza, itemCount: 45, color: colors.red },
    { id: '2', name: 'Burgers', icon: Icons.Hamburger, itemCount: 38, color: colors.orange },
    { id: '3', name: 'Sushi', icon: Icons.Fish, itemCount: 28, color: colors.blue },
    { id: '4', name: 'Pasta', icon: Icons.ForkKnife, itemCount: 32, color: colors.green },
    { id: '5', name: 'Desserts', icon: Icons.IceCream, itemCount: 51, color: colors.pink },
    { id: '6', name: 'Salads', icon: Icons.Leaf, itemCount: 24, color: colors.green },
    { id: '7', name: 'Asian', icon: Icons.BowlFood, itemCount: 42, color: colors.red },
    { id: '8', name: 'Mexican', icon: Icons.Pepper, itemCount: 30, color: colors.orange },
    { id: '9', name: 'Breakfast', icon: Icons.Egg, itemCount: 26, color: colors.yellow },
    { id: '10', name: 'Coffee', icon: Icons.Coffee, itemCount: 35, color: colors.brown },
    { id: '11', name: 'BBQ', icon: Icons.Fire, itemCount: 22, color: colors.red },
    { id: '12', name: 'Seafood', icon: Icons.FishSimple, itemCount: 19, color: colors.blue }
  ]

  // Filter categories by search
  const filteredCategories = search.trim()
    ? allCategories.filter(cat =>
        cat.name.toLowerCase().includes(search.toLowerCase())
      )
    : allCategories

  const handleCategoryPress = (category: Category) => {
    // Navigate to stores filtered by category
    navigation.navigate('Stores', { category: category.name })
  }

  const renderCategory = ({ item, index }: { item: Category; index: number }) => {
    const CategoryIcon = item.icon

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
          <CategoryIcon size={32} color={item.color} weight="bold" />
        </View>
        <Typo size={16} weight="600" style={{ marginTop: spacingY._10 }}>
          {item.name}
        </Typo>
        <Typo size={13} color={colors.textGray} style={{ marginTop: spacingY._4 }}>
          {item.itemCount} items
        </Typo>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacingY._15 }]}>
        <AppIcon
          icon={Icons.ArrowLeft}
          onPress={() => navigation.goBack()}
        />
        <Typo size={18} weight="600" style={{ flex: 1, marginLeft: spacingX._12 }}>
          Categories
        </Typo>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search categories..."
        />
      </View>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <View style={styles.emptyState}>
          <Icons.MagnifyingGlass size={64} color={colors.textGray} weight="thin" />
          <Typo size={16} weight="600" style={{ marginTop: spacingY._15 }}>
            No categories found
          </Typo>
          <Typo size={14} color={colors.textGray} style={{ marginTop: spacingY._8 }}>
            Try a different search term
          </Typo>
        </View>
      ) : (
        <FlatList
          data={filteredCategories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingX._20,
    paddingBottom: spacingY._15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray
  },
  searchContainer: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray
  },
  gridContent: {
    padding: spacingX._15,
    paddingBottom: spacingY._30
  },
  gridRow: {
    justifyContent: 'space-between'
  },
  categoryCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius._15,
    padding: spacingX._15,
    margin: spacingX._5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
    minHeight: 130
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: radius._30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacingX._30
  }
})

export default CategoriesScreen
