/**
 * Cart Store (Zustand with Persist Middleware)
 * Manages shopping cart state globally with persistence
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface CartItem {
  productId: string
  productName: string
  productPrice: number
  quantity: number
  notes?: string
  imageUrl?: string
  storeId: string
  storeName: string
}

interface CartState {
  // State
  items: CartItem[]
  storeId: string | null
  storeName: string | null

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateNotes: (productId: string, notes: string) => void
  clearCart: () => void

  // Computed (as functions for Zustand)
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      storeId: null,
      storeName: null,

      // Add item to cart
      addItem: (item) => {
        const state = get()

        // If cart has items from a different store, clear it first
        if (state.storeId && state.storeId !== item.storeId) {
          set({
            items: [],
            storeId: null,
            storeName: null,
          })
        }

        // Check if item already exists (same product and notes)
        const existingItemIndex = state.items.findIndex(
          (i) => i.productId === item.productId && i.notes === item.notes
        )

        let newItems: CartItem[]

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          newItems = [...state.items]
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + (item.quantity || 1),
          }
        } else {
          // Add new item
          newItems = [
            ...state.items,
            {
              ...item,
              quantity: item.quantity || 1,
            } as CartItem,
          ]
        }

        set({
          items: newItems,
          storeId: item.storeId,
          storeName: item.storeName,
        })
      },

      // Remove item from cart
      removeItem: (productId) => {
        const state = get()
        const newItems = state.items.filter((item) => item.productId !== productId)

        set({
          items: newItems,
          storeId: newItems.length > 0 ? state.storeId : null,
          storeName: newItems.length > 0 ? state.storeName : null,
        })
      },

      // Update item quantity
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }))
      },

      // Update item notes
      updateNotes: (productId, notes) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, notes } : item
          ),
        }))
      },

      // Clear cart
      clearCart: () => {
        set({
          items: [],
          storeId: null,
          storeName: null,
        })
      },

      // Get cart total
      getTotal: () => {
        const state = get()
        return state.items.reduce(
          (total, item) => total + item.productPrice * item.quantity,
          0
        )
      },

      // Get total item count
      getItemCount: () => {
        const state = get()
        return state.items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'deliverygo-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist cart data (not computed functions)
      partialize: (state) => ({
        items: state.items,
        storeId: state.storeId,
        storeName: state.storeName,
      }),
    }
  )
)

// Selector hooks for convenience
export const useCartItems = () => useCartStore((state) => state.items)
export const useCartTotal = () => useCartStore((state) => state.getTotal())
export const useCartItemCount = () => useCartStore((state) => state.getItemCount())
export const useCartStoreName = () => useCartStore((state) => state.storeName)
export const useCartStoreId = () => useCartStore((state) => state.storeId)

export default useCartStore
