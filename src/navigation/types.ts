/**
 * Navigation Type Definitions
 * Centralized navigation types for type-safe navigation
 */

import type { NavigatorScreenParams, CompositeNavigationProp } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

// ============================================================================
// Root Stack (App Navigator)
// ============================================================================

export type RootStackParamList = {
  Splash: undefined
  Auth: undefined
  StoreOwnerApp: undefined
  DriverApp: undefined
  CustomerApp: undefined
}

// ============================================================================
// Auth Stack
// ============================================================================

export type AuthStackParamList = {
  Onboarding: undefined
  Login: undefined
  SignUp: undefined
  Verification: { email?: string; phone?: string; type: 'email' | 'phone' }
  ForgotPassword: undefined
}

// ============================================================================
// Customer Navigation
// ============================================================================

// Customer Tab Navigator
export type CustomerTabParamList = {
  Browse: NavigatorScreenParams<CustomerBrowseStackParamList>
  Cart: undefined
  Orders: NavigatorScreenParams<CustomerOrdersStackParamList>
  Profile: undefined
}

// Customer Browse Stack (inside Browse tab)
export type CustomerBrowseStackParamList = {
  Home: undefined
  Stores: { category?: string } | undefined
  StoreDetails: { storeId: string; storeName?: string }
  Categories: undefined
  Search: undefined
  PaymentMethods: undefined
  AddressManagement: undefined
  PaymentSuccess: { orderId: string; orderNumber: string; total: number }
}

// Customer Orders Stack (inside Orders tab)
export type CustomerOrdersStackParamList = {
  OrdersList: undefined
  OrderDetails: { orderId: string }
}

// Composite navigation type for Customer screens
export type CustomerNavigationProp = CompositeNavigationProp<
  StackNavigationProp<CustomerBrowseStackParamList>,
  CompositeNavigationProp<
    BottomTabNavigationProp<CustomerTabParamList>,
    StackNavigationProp<RootStackParamList>
  >
>

// ============================================================================
// Store Owner Navigation
// ============================================================================

export type StoreOwnerTabParamList = {
  OrdersHome: undefined
  StoreSettings: undefined
  Profile: undefined
}

export type StoreOwnerStackParamList = {
  OrdersHome: undefined
  OrderDetail: { orderId: string }
  StoreSettings: undefined
  Profile: undefined
}

export type StoreOwnerNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<StoreOwnerTabParamList>,
  StackNavigationProp<RootStackParamList>
>

// ============================================================================
// Driver Navigation
// ============================================================================

export type DriverTabParamList = {
  Deliveries: undefined
  Map: undefined
  History: undefined
  Profile: undefined
}

export type DriverStackParamList = {
  Deliveries: undefined
  DeliveryDetail: { orderId: string }
  Map: undefined
  History: undefined
  Profile: undefined
}

export type DriverNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<DriverTabParamList>,
  StackNavigationProp<RootStackParamList>
>

// ============================================================================
// Screen Props Types
// ============================================================================

// Helper type for screen props
export type ScreenProps<
  ParamList extends Record<string, object | undefined>,
  RouteName extends keyof ParamList
> = {
  navigation: StackNavigationProp<ParamList, RouteName>
  route: { params: ParamList[RouteName] }
}

// Customer screen props
export type HomeScreenProps = ScreenProps<CustomerBrowseStackParamList, 'Home'>
export type StoresScreenProps = ScreenProps<CustomerBrowseStackParamList, 'Stores'>
export type StoreDetailsScreenProps = ScreenProps<CustomerBrowseStackParamList, 'StoreDetails'>
export type CategoriesScreenProps = ScreenProps<CustomerBrowseStackParamList, 'Categories'>
export type SearchScreenProps = ScreenProps<CustomerBrowseStackParamList, 'Search'>
export type PaymentSuccessScreenProps = ScreenProps<CustomerBrowseStackParamList, 'PaymentSuccess'>
export type OrderDetailsScreenProps = ScreenProps<CustomerOrdersStackParamList, 'OrderDetails'>

// Store Owner screen props
export type OrderDetailScreenProps = ScreenProps<StoreOwnerStackParamList, 'OrderDetail'>

// Driver screen props
export type DeliveryDetailScreenProps = ScreenProps<DriverStackParamList, 'DeliveryDetail'>

// ============================================================================
// Declaration merging for useNavigation hook
// ============================================================================

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
