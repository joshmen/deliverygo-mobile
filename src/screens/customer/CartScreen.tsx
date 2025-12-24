/**
 * Cart Screen (Customer) - Template Design
 * View cart items and proceed to checkout with modern UI
 */

import React, { useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Icons from 'phosphor-react-native'
import { useUser } from '../../store/auth.store'
import { useCartStore, CartItem } from '../../store/cart.store'
import apiClient from '../../services/api/client'
import { ENDPOINTS } from '../../config/constants'
import type { Address } from '../../types/address'
import { formatAddress } from '../../types/address'

// Template components
import { Typo, AppIcon, AppButton, CartCard } from '../../components/common'
import AddressPickerModal from '../../components/customer/AddressPickerModal'

// Template theme
import colors from '../../theme/colors'
import { spacingX, spacingY, radius } from '../../theme/spacing'

const CartScreen: React.FC = () => {
  const navigation = useNavigation()
  const user = useUser()
  const insets = useSafeAreaInsets()

  const items = useCartStore((state) => state.items)
  const storeName = useCartStore((state) => state.storeName)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const total = useCartStore((state) => state.getTotal())

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [showAddressPicker, setShowAddressPicker] = useState(false)

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAddress) {
        throw new Error('Please select a delivery address')
      }

      const response = await apiClient.post(ENDPOINTS.customer.checkout, {
        customerId: user?.id,
        storeId: items[0].storeId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          notes: item.notes
        })),
        deliveryAddress: formatAddress(selectedAddress),
        deliveryNotes: deliveryNotes.trim()
      })

      return response.data
    },
    onSuccess: (data) => {
      clearCart()
      Alert.alert(
        'Order Placed!',
        `Your order has been placed successfully. Order #${data.orderNumber || 'N/A'}`,
        [
          {
            text: 'View Orders',
            onPress: () => navigation.navigate('Orders' as never)
          },
          {
            text: 'OK',
            style: 'default'
          }
        ]
      )
    },
    onError: (error: Error) => {
      Alert.alert(
        'Checkout Failed',
        error.message || 'Failed to place order. Please try again.',
        [{ text: 'OK' }]
      )
    }
  })

  // Handle quantity changes
  const handleIncrement = (productId: string) => {
    const item = items.find((i) => i.productId === productId)
    if (item) {
      updateQuantity(productId, item.quantity + 1)
    }
  }

  const handleDecrement = (productId: string) => {
    const item = items.find((i) => i.productId === productId)
    if (!item) return

    if (item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1)
    } else {
      Alert.alert(
        'Remove Item',
        'Remove this item from cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', onPress: () => removeItem(productId), style: 'destructive' }
        ]
      )
    }
  }

  const handleRemove = (productId: string) => {
    Alert.alert(
      'Remove Item',
      'Remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => removeItem(productId), style: 'destructive' }
      ]
    )
  }

  const deliveryFee = 2.99
  const safeTotal = total || 0
  const tax = safeTotal * 0.08
  const grandTotal = safeTotal + deliveryFee + tax

  // Empty cart state
  if (items.length === 0) {
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
            Cart
          </Typo>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.emptyContainer}>
          <Icons.ShoppingBagOpen size={80} color={colors.textGray} weight="thin" />
          <Typo size={20} weight="600" style={{ marginTop: spacingY._20 }}>
            Your cart is empty
          </Typo>
          <Typo size={14} color={colors.textGray} style={{ marginTop: spacingY._8 }}>
            Add items from a restaurant to get started
          </Typo>
          <AppButton
            title="Browse Restaurants"
            onPress={() => navigation.navigate('StoresList' as never)}
            style={{ marginTop: spacingY._25 }}
          />
        </View>
      </View>
    )
  }

  // Cart with items
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
          Cart ({items.length})
        </Typo>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Store Name */}
        {storeName && (
          <View style={styles.storeSection}>
            <Icons.Storefront size={20} color={colors.primary} weight="bold" />
            <Typo size={16} weight="600">
              {storeName}
            </Typo>
          </View>
        )}

        {/* Cart Items */}
        <View style={styles.itemsSection}>
          <Typo size={16} weight="600" style={{ marginBottom: spacingY._15 }}>
            Your Items
          </Typo>
          <FlatList
            data={items}
            keyExtractor={(item) => item.productId}
            renderItem={({ item }) => (
              <CartCard
                item={item}
                onIncrement={() => handleIncrement(item.productId)}
                onDecrement={() => handleDecrement(item.productId)}
                onRemove={() => handleRemove(item.productId)}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ height: spacingY._12 }} />}
            scrollEnabled={false}
          />
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Typo size={16} weight="600" style={{ marginBottom: spacingY._15 }}>
            Order Summary
          </Typo>

          <View style={styles.summaryRow}>
            <Typo color={colors.textGray}>Subtotal</Typo>
            <Typo weight="500">${safeTotal.toFixed(2)}</Typo>
          </View>

          <View style={styles.summaryRow}>
            <Typo color={colors.textGray}>Delivery Fee</Typo>
            <Typo weight="500">${deliveryFee.toFixed(2)}</Typo>
          </View>

          <View style={styles.summaryRow}>
            <Typo color={colors.textGray}>Tax</Typo>
            <Typo weight="500">${tax.toFixed(2)}</Typo>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Typo size={18} weight="600">Total</Typo>
            <Typo size={20} weight="600" color={colors.primary}>
              ${grandTotal.toFixed(2)}
            </Typo>
          </View>
        </View>

        {/* Delivery Information */}
        <View style={styles.deliverySection}>
          <Typo size={16} weight="600" style={{ marginBottom: spacingY._15 }}>
            Delivery Information
          </Typo>

          {/* Address Selector */}
          <TouchableOpacity
            style={styles.addressSelector}
            onPress={() => setShowAddressPicker(true)}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.addressSelectorHeader}>
                <Icons.MapPin size={18} color={colors.primary} weight="bold" />
                <Typo size={13} color={colors.textGray}>
                  Delivery Address
                </Typo>
              </View>
              {selectedAddress ? (
                <View style={{ marginTop: 8 }}>
                  <Typo size={15} weight="500">
                    {selectedAddress.street}
                  </Typo>
                  <Typo size={13} color={colors.textGray} style={{ marginTop: 2 }}>
                    {formatAddress(selectedAddress)}
                  </Typo>
                </View>
              ) : (
                <Typo size={14} color={colors.primary} style={{ marginTop: 8 }}>
                  Select delivery address
                </Typo>
              )}
            </View>
            <Icons.CaretRight size={20} color={colors.textGray} />
          </TouchableOpacity>

          {/* Delivery Notes */}
          <TextInput
            style={styles.input}
            placeholder="Delivery Notes (Optional)"
            placeholderTextColor={colors.textGray}
            value={deliveryNotes}
            onChangeText={setDeliveryNotes}
            multiline
          />
        </View>

        {/* Checkout Button */}
        <View style={styles.checkoutSection}>
          <AppButton
            title="Proceed to Checkout"
            onPress={() => checkoutMutation.mutate()}
            loading={checkoutMutation.isPending}
          />
        </View>
      </ScrollView>

      {/* Address Picker Modal */}
      <AddressPickerModal
        visible={showAddressPicker}
        onClose={() => setShowAddressPicker(false)}
        onSelectAddress={(address) => setSelectedAddress(address)}
        selectedAddressId={selectedAddress?.id}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingX._20,
    paddingBottom: spacingY._15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacingX._30,
  },
  storeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._10,
    padding: spacingX._20,
    backgroundColor: colors.white,
    marginTop: spacingY._10,
  },
  itemsSection: {
    padding: spacingX._20,
    backgroundColor: colors.white,
    marginTop: spacingY._10,
  },
  summarySection: {
    padding: spacingX._20,
    backgroundColor: colors.white,
    marginTop: spacingY._10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._12,
  },
  totalRow: {
    paddingTop: spacingY._15,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    marginTop: spacingY._5,
  },
  deliverySection: {
    padding: spacingX._20,
    backgroundColor: colors.white,
    marginTop: spacingY._10,
  },
  addressSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius._12,
    padding: spacingX._15,
    marginBottom: spacingY._12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  addressSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._6,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius._8,
    padding: spacingX._15,
    fontSize: 15,
    color: colors.dark,
    marginBottom: spacingY._12,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  checkoutSection: {
    padding: spacingX._20,
    paddingBottom: spacingY._30,
  },
})

export default CartScreen
