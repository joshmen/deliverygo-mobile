/**
 * Product Details Modal
 * Modal for viewing product details and adding to cart
 * Adapted from template
 */

import React, { useState } from 'react'
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native'
import * as Icons from 'phosphor-react-native'

// Components
import Typo from '../common/Typo'
import AppButton from '../common/AppButton'

// Theme
import colors from '../../theme/colors'
import { spacingX, spacingY, radius } from '../../theme/spacing'
import { normalizeY } from '../../utils/normalize'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  category?: string
}

interface ProductDetailsModalProps {
  visible: boolean
  product: Product | null
  storeName?: string
  onClose: () => void
  onAddToCart: (product: Product, quantity: number, notes: string) => void
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  visible,
  product,
  storeName,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')

  if (!product) return null

  const handleAddToCart = () => {
    onAddToCart(product, quantity, notes)
    // Reset state
    setQuantity(1)
    setNotes('')
    onClose()
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const totalPrice = product.price * quantity

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icons.X size={24} color={colors.dark} weight="bold" />
            </TouchableOpacity>
            <Typo size={16} weight="600">
              Product Details
            </Typo>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Product Image */}
            {product.imageUrl ? (
              <Image
                source={{ uri: product.imageUrl }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.productImage, styles.placeholderImage]}>
                <Icons.ForkKnife size={60} color={colors.textGray} weight="thin" />
              </View>
            )}

            {/* Store Name */}
            {storeName && (
              <View style={styles.storeRow}>
                <Icons.Storefront size={18} color={colors.primary} weight="bold" />
                <Typo size={13} weight="500" color={colors.textGray}>
                  {storeName}
                </Typo>
              </View>
            )}

            {/* Product Name */}
            <Typo size={20} weight="600" style={{ marginBottom: spacingY._8 }}>
              {product.name}
            </Typo>

            {/* Product Description */}
            {product.description && (
              <Typo size={14} color={colors.textGray} style={{ marginBottom: spacingY._15 }}>
                {product.description}
              </Typo>
            )}

            {/* Price */}
            <View style={styles.priceRow}>
              <Typo size={16} color={colors.textGray}>
                Price:
              </Typo>
              <Typo size={18} weight="600" color={colors.primary}>
                ${product.price.toFixed(2)}
              </Typo>
            </View>

            {/* Category Badge */}
            {product.category && (
              <View style={styles.categoryBadge}>
                <Icons.Tag size={16} color={colors.primary} weight="bold" />
                <Typo size={12} weight="500" color={colors.primary}>
                  {product.category}
                </Typo>
              </View>
            )}

            {/* Special Notes */}
            <View style={{ marginTop: spacingY._20 }}>
              <Typo size={14} weight="600" style={{ marginBottom: spacingY._8 }}>
                Special Instructions (Optional)
              </Typo>
              <TextInput
                style={styles.notesInput}
                placeholder="Add any special requests here..."
                placeholderTextColor={colors.textGray}
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Bottom Section - Quantity & Add to Cart */}
          <View style={styles.bottomSection}>
            {/* Quantity Counter */}
            <View style={styles.quantityContainer}>
              <Typo size={14} weight="600" style={{ marginBottom: spacingY._8 }}>
                Quantity
              </Typo>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={decrementQuantity}
                  style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
                  disabled={quantity === 1}
                >
                  <Icons.Minus size={16} color={quantity === 1 ? colors.textGray : colors.white} weight="bold" />
                </TouchableOpacity>

                <View style={styles.quantityDisplay}>
                  <Typo size={18} weight="600">
                    {quantity}
                  </Typo>
                </View>

                <TouchableOpacity
                  onPress={incrementQuantity}
                  style={styles.quantityButton}
                >
                  <Icons.Plus size={16} color={colors.white} weight="bold" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Add to Cart Button */}
            <AppButton
              title={`Add to Cart - $${totalPrice.toFixed(2)}`}
              onPress={handleAddToCart}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._20,
    borderTopRightRadius: radius._20,
    maxHeight: '90%',
    paddingBottom: spacingY._20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  scrollContent: {
    padding: spacingX._20,
  },
  productImage: {
    width: '100%',
    height: normalizeY(200),
    borderRadius: radius._12,
    marginBottom: spacingY._15,
    backgroundColor: colors.lightGray,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._5,
    marginBottom: spacingY._10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._10,
    marginBottom: spacingY._10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._5,
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._8,
    borderRadius: radius._20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: radius._12,
    padding: spacingX._15,
    fontSize: 14,
    color: colors.dark,
    minHeight: normalizeY(80),
  },
  bottomSection: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._15,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    gap: spacingY._15,
  },
  quantityContainer: {
    //
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._15,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: radius._8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
  quantityDisplay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacingY._8,
    backgroundColor: colors.background,
    borderRadius: radius._8,
  },
})

export default ProductDetailsModal
