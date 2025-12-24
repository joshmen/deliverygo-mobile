/**
 * Typed Navigation Hooks
 * Provides type-safe navigation throughout the app
 */

import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type {
  CustomerBrowseStackParamList,
  CustomerOrdersStackParamList,
  StoreOwnerStackParamList,
  DriverStackParamList,
} from '../navigation/types'

/**
 * Hook for Customer Browse navigation
 * Use in screens within the Customer Browse stack
 */
export const useCustomerBrowseNavigation = () => {
  return useNavigation<StackNavigationProp<CustomerBrowseStackParamList>>()
}

/**
 * Hook for Customer Orders navigation
 * Use in screens within the Customer Orders stack
 */
export const useCustomerOrdersNavigation = () => {
  return useNavigation<StackNavigationProp<CustomerOrdersStackParamList>>()
}

/**
 * Hook for Store Owner navigation
 * Use in screens within the Store Owner stack
 */
export const useStoreOwnerNavigation = () => {
  return useNavigation<StackNavigationProp<StoreOwnerStackParamList>>()
}

/**
 * Hook for Driver navigation
 * Use in screens within the Driver stack
 */
export const useDriverNavigation = () => {
  return useNavigation<StackNavigationProp<DriverStackParamList>>()
}

/**
 * Generic navigation hook with any type
 * Use when you need to navigate across different stacks
 * Note: Less type-safe, use sparingly
 */
export const useAppNavigation = () => {
  return useNavigation<StackNavigationProp<any>>()
}
