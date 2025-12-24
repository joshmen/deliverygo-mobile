/**
 * API Service - Main Export
 * Centralized API layer for DeliveryGo mobile app
 */

// Export the base client
export { default as apiClient } from './client'
export { getAuthToken, setAuthToken, clearAuthToken } from './client'

// Export all auth functions
export {
  login,
  logout,
  getStoredUser,
  refreshToken,
  verifyToken
} from './auth.api'

// Export all tenant functions
export {
  fetchTenantConfig,
  getCachedTenantConfig,
  clearCachedTenantConfig,
  validateTenantCode
} from './tenant.api'

// Export all order functions
export {
  // Store Owner Functions
  getTodayOrdersForStore,
  createOrder,
  getOrderById,
  assignDriver,
  updateOrderStatus,
  getOrders,
  acceptOrder,
  getOrderStatistics,

  // Driver Functions
  getAssignedOrdersForDriver,
  markOrderOnTheWay,
  markOrderDelivered,

  // Common Functions
  cancelOrder
} from './order.api'

// Create a namespace for better organization (optional)
import * as AuthAPI from './auth.api'
import * as TenantAPI from './tenant.api'
import * as OrderAPI from './order.api'

export const API = {
  auth: AuthAPI,
  tenant: TenantAPI,
  order: OrderAPI
}

export default API
