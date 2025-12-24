/**
 * Core TypeScript types for DeliveryGo
 */

// ============================================================================
// User & Authentication Types
// ============================================================================

export type UserRole = 'StoreOwner' | 'Driver' | 'Customer'

export interface User {
  id: string
  email: string
  role: UserRole
  tenantId: string
  isActive: boolean
  createdAt: string
  fullName?: string
  phoneNumber?: string
  updatedAt?: string
}

export interface LoginRequest {
  email: string
  password: string
  tenantCode: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: User
}

// ============================================================================
// Tenant Configuration Types
// ============================================================================

export type PaymentMethod = 'CASH' | 'CARDONDELIVERY' | 'ONLINEPAYMENT' | 'DIGITALWALLET'

export interface TenantBranding {
  logoUrl: string | null
  primaryColor: string
  secondaryColor: string
  appDisplayName: string
}

export interface TenantPaymentConfig {
  enabledPaymentMethods: PaymentMethod[]
}

export interface TenantConfig {
  tenantId: string
  code: string
  name: string
  contactEmail?: string
  branding: TenantBranding
  payment: TenantPaymentConfig
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

// ============================================================================
// Store Types
// ============================================================================

export interface Store {
  id: string
  name: string
  address: string
  city: string
  postalCode?: string
  phone: string
  email: string
  tenantId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ============================================================================
// Driver Types
// ============================================================================

export interface Driver {
  id: string
  userId: string
  fullName: string
  email: string
  phone: string
  vehicleType: string
  vehiclePlate: string
  tenantId: string
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export interface DriverAssignment {
  orderId: string
  driverId: string
  assignedAt: string
}

// ============================================================================
// Order Types
// ============================================================================

export type OrderStatus = 'Pending' | 'Accepted' | 'OnTheWay' | 'Delivered' | 'Cancelled'

export interface OrderItem {
  id: string
  orderId: string
  productName: string
  quantity: number
  price: number
  subtotal: number
  notes?: string
}

export interface Customer {
  name: string
  phone: string
  email?: string
}

export interface DeliveryAddress {
  street: string
  city: string
  postalCode?: string
  notes?: string
  fullAddress: string
  latitude?: number
  longitude?: number
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  customer: Customer
  deliveryAddress: DeliveryAddress
  items: OrderItem[]
  totalAmount: number
  paymentMethod: PaymentMethod
  notes?: string
  store: {
    id: string
    name: string
    address?: string
    phone?: string
  }
  driver?: {
    id: string
    name: string
    phone: string
    vehicleType: string
    vehiclePlate: string
  }
  tenantId: string
  createdAt: string
  updatedAt: string
  acceptedAt?: string
  deliveredAt?: string
  cancelledAt?: string
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface CreateOrderRequest {
  storeId: string
  customer: Customer
  deliveryAddress: DeliveryAddress
  items: Array<{
    productName: string
    quantity: number
    price: number
    notes?: string
  }>
  paymentMethod: PaymentMethod
  notes?: string
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus
  notes?: string
}

export interface AssignDriverRequest {
  driverId: string
}

export interface GetOrdersParams {
  storeId?: string
  driverId?: string
  status?: OrderStatus
  startDate?: string
  endDate?: string
}

// ============================================================================
// API Response Wrappers
// ============================================================================

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface ApiError {
  message: string
  code?: string
  details?: any
}

// Navigation types - Re-export from centralized navigation types
export type {
  RootStackParamList,
  AuthStackParamList,
  CustomerTabParamList,
  CustomerBrowseStackParamList,
  CustomerOrdersStackParamList,
  CustomerNavigationProp,
  StoreOwnerTabParamList,
  StoreOwnerStackParamList,
  StoreOwnerNavigationProp,
  DriverTabParamList,
  DriverStackParamList,
  DriverNavigationProp,
} from '../navigation/types'
