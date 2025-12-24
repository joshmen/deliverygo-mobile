/**
 * Store Details Screen (Customer) - Template Design
 * View store products and add items to cart with modern UI
 */

import React, { useState } from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Image,
  TextInput,
  Modal,
  ScrollView,
  StatusBar,
} from 'react-native'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Icons from 'phosphor-react-native'
import { useCartStore, useCartItemCount, useCartTotal } from '../../store/cart.store'
import apiClient from '../../services/api/client'
import { ENDPOINTS } from '../../config/constants'

// Template components
import { Typo, AppIcon, AppButton } from '../../components/common'
import ProductDetailsModal from '../../components/customer/ProductDetailsModal'

// Template theme
import colors from '../../theme/colors'
import { spacingX, spacingY, radius, normalizeY } from '../../theme/spacing'

// Product type
interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl?: string
  isAvailable: boolean
  preparationTime?: number
}

// Route params
type StoreDetailsRouteProp = RouteProp<
  { StoreDetails: { storeId: string; storeName: string } },
  'StoreDetails'
>

const StoreDetailsScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<StoreDetailsRouteProp>()
  const { storeId, storeName } = route.params
  const addItem = useCartStore((state) => state.addItem)
  const cartStoreId = useCartStore((state) => state.storeId)
  const itemCount = useCartItemCount()
  const cartTotal = useCartTotal()
  const insets = useSafeAreaInsets()

  // Only show cart button if cart has items from THIS store
  const showCartButton = itemCount > 0 && cartStoreId === storeId

  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  // Fetch products
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['products', storeId],
    queryFn: async () => {
      const response = await apiClient.get<Product[]>(
        ENDPOINTS.customer.getProducts(storeId)
      )
      return response.data
    },
    staleTime: 30000
  })

  // Get unique categories
  const categories = ['All', ...new Set(products?.map((p) => p.category) || [])]

  // Filter products by category
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products?.filter((p) => p.category === selectedCategory)

  // Open product modal
  const handleProductPress = (product: Product) => {
    if (!product.isAvailable) return
    setSelectedProduct(product)
    setModalVisible(true)
  }

  // Add to cart - receives data from modal
  const handleAddToCart = (product: { id: string; name: string; price: number; imageUrl?: string }, quantity: number, notes: string) => {
    addItem({
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      quantity,
      notes,
      imageUrl: product.imageUrl,
      storeId,
      storeName
    })

    // Close modal
    setModalVisible(false)
  }

  // Close modal handler
  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedProduct(null)
  }

  // Render category filter
  const renderCategoryFilter = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => {
          const isActive = selectedCategory === category
          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                isActive && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <Typo
                size={13}
                weight={isActive ? '600' : '500'}
                color={isActive ? colors.white : colors.textGray}
              >
                {category}
              </Typo>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    )
  }

  // Render product card
  const renderProductCard = ({ item }: { item: Product }) => {
    return (
      <TouchableOpacity
        style={[styles.productCard, !item.isAvailable && styles.productCardDisabled]}
        onPress={() => handleProductPress(item)}
        activeOpacity={0.7}
        disabled={!item.isAvailable}
      >
        {/* Product Image */}
        <View style={styles.productImageContainer}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Icons.ForkKnife size={32} color={colors.textGray} weight="thin" />
            </View>
          )}
          {!item.isAvailable && (
            <View style={styles.unavailableOverlay}>
              <Typo size={12} weight="600" color={colors.white}>
                Unavailable
              </Typo>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Typo size={16} weight="500" numberOfLines={2} style={styles.productName}>
            {item.name}
          </Typo>
          <Typo size={12} color={colors.textGray} numberOfLines={2} style={styles.productDescription}>
            {item.description}
          </Typo>
          <View style={styles.productFooter}>
            <Typo size={18} weight="600" color={colors.primary}>
              ${item.price.toFixed(2)}
            </Typo>
            {item.preparationTime && (
              <View style={styles.prepTimeContainer}>
                <Icons.Clock size={14} color={colors.textGray} weight="bold" />
                <Typo size={12} color={colors.textGray} style={{ marginLeft: spacingX._3 }}>
                  {item.preparationTime} min
                </Typo>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }


  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + spacingY._15 }]}>
          <AppIcon
            icon={Icons.ArrowLeft}
            onPress={() => navigation.goBack()}
          />
          <Typo size={18} weight="600">
            {storeName}
          </Typo>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Typo style={{ marginTop: spacingY._12 }} color={colors.textGray}>
            Loading menu...
          </Typo>
        </View>
      </View>
    )
  }

  // Error state
  if (isError) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + spacingY._15 }]}>
          <AppIcon
            icon={Icons.ArrowLeft}
            onPress={() => navigation.goBack()}
          />
          <Typo size={18} weight="600">
            {storeName}
          </Typo>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.centerContainer}>
          <Icons.WarningCircle size={64} color={colors.red} weight="thin" />
          <Typo size={18} weight="600" style={{ marginTop: spacingY._15, color: colors.red }}>
            Failed to load menu
          </Typo>
          <Typo size={14} color={colors.textGray} style={{ marginTop: spacingY._8, textAlign: 'center' }}>
            {(error as Error).message}
          </Typo>
          <AppButton
            title="Retry"
            onPress={() => refetch()}
            style={{ marginTop: spacingY._20 }}
          />
        </View>
      </View>
    )
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + spacingY._15 }]}>
          <AppIcon
            icon={Icons.ArrowLeft}
            onPress={() => navigation.goBack()}
          />
          <Typo size={18} weight="600">
            {storeName}
          </Typo>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.centerContainer}>
          <Icons.ForkKnife size={80} color={colors.textGray} weight="thin" />
          <Typo size={20} weight="600" style={{ marginTop: spacingY._20 }}>
            No menu items available
          </Typo>
          <Typo size={14} color={colors.textGray} style={{ marginTop: spacingY._8 }}>
            Check back later for updates
          </Typo>
        </View>
      </View>
    )
  }

  // Main content
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacingY._15 }]}>
        <AppIcon
          icon={Icons.ArrowLeft}
          onPress={() => navigation.goBack()}
        />
        <View style={{ flex: 1, marginLeft: spacingX._12 }}>
          <Typo size={18} weight="600">
            {storeName}
          </Typo>
          <Typo size={13} color={colors.textGray}>
            {filteredProducts?.length || 0} items
          </Typo>
        </View>

        {/* Cart Icon with Badge */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart' as never)}
          activeOpacity={0.7}
          style={styles.cartIconContainer}
        >
          <View style={styles.cartIconWrapper}>
            <Icons.ShoppingCart size={24} color={colors.white} weight="bold" />
            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Typo size={11} weight="600" color={colors.white}>
                  {itemCount}
                </Typo>
              </View>
            )}
          </View>
          {cartTotal > 0 && (
            <Typo size={13} weight="600" color={colors.primary} style={{ marginTop: spacingY._3 }}>
              ${cartTotal.toFixed(2)}
            </Typo>
          )}
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      {renderCategoryFilter()}

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Product Detail Modal */}
      <ProductDetailsModal
        visible={modalVisible}
        product={selectedProduct}
        storeName={storeName}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacingX._30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingX._20,
    paddingBottom: spacingY._15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  cartIconContainer: {
    alignItems: 'center',
  },
  cartIconWrapper: {
    backgroundColor: colors.dark,
    width: 40,
    height: 40,
    borderRadius: radius._10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  categoryScroll: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  categoryContent: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._12,
    gap: spacingX._8,
  },
  categoryChip: {
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._8,
    borderRadius: radius._20,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  gridContent: {
    padding: spacingX._12,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    flex: 0.48,
    backgroundColor: colors.white,
    borderRadius: radius._12,
    marginBottom: spacingY._12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  productCardDisabled: {
    opacity: 0.6,
  },
  productImageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: spacingX._12,
  },
  productName: {
    marginBottom: spacingY._5,
    height: 40,
  },
  productDescription: {
    marginBottom: spacingY._8,
    height: 32,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prepTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.red,
    minWidth: 20,
    height: 20,
    borderRadius: radius._10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacingX._5,
    borderWidth: 2,
    borderColor: colors.white,
  },
})

export default StoreDetailsScreen
