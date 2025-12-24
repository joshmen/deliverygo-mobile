/**
 * Order API
 * Functions for order management
 */

import apiClient from './client'
import { ENDPOINTS } from '../../config/constants'
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  AssignDriverRequest,
  GetOrdersParams,
  OrderStatus
} from '../../types'

// ============================================================================
// Store Owner Functions
// ============================================================================

/**
 * Get today's orders for a specific store
 * @param storeId - Store identifier
 * @returns List of today's orders
 */
export const getTodayOrdersForStore = async (storeId: string): Promise<Order[]> => {
  try {
    const response = await apiClient.get<Order[]>(ENDPOINTS.orders.getTodayOrders, {
      params: { storeId }
    })
    return response.data
  } catch (error) {
    console.error('[OrderAPI] Get today orders error:', error)
    throw error
  }
}

/**
 * Create a new order
 * @param orderData - Order creation payload
 * @returns Created order
 */
export const createOrder = async (orderData: CreateOrderRequest): Promise<Order> => {
  try {
    const response = await apiClient.post<Order>(
      ENDPOINTS.orders.create,
      orderData
    )
    return response.data
  } catch (error) {
    console.error('[OrderAPI] Create order error:', error)
    throw error
  }
}

/**
 * Get order details by ID
 * @param orderId - Order identifier
 * @returns Order details
 */
export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await apiClient.get<Order>(
      ENDPOINTS.orders.getById(orderId)
    )
    return response.data
  } catch (error) {
    console.error('[OrderAPI] Get order by ID error:', error)
    throw error
  }
}

/**
 * Assign a driver to an order
 * @param orderId - Order identifier
 * @param driverId - Driver identifier
 * @returns Updated order
 */
export const assignDriver = async (
  orderId: string,
  driverId: string
): Promise<Order> => {
  try {
    const payload: AssignDriverRequest = { driverId }
    const response = await apiClient.put<Order>(
      ENDPOINTS.orders.assignDriver(orderId),
      payload
    )
    return response.data
  } catch (error) {
    console.error('[OrderAPI] Assign driver error:', error)
    throw error
  }
}

/**
 * Update order status
 * @param orderId - Order identifier
 * @param newStatus - New order status
 * @param notes - Optional notes about status change
 * @returns Updated order
 */
export const updateOrderStatus = async (
  orderId: string,
  newStatus: OrderStatus,
  notes?: string
): Promise<Order> => {
  try {
    const payload: UpdateOrderStatusRequest = { status: newStatus, notes }
    const response = await apiClient.put<Order>(
      ENDPOINTS.orders.updateStatus(orderId),
      payload
    )
    return response.data
  } catch (error) {
    console.error('[OrderAPI] Update status error:', error)
    throw error
  }
}

/**
 * Get orders with filters
 * @param params - Filter parameters
 * @returns Filtered list of orders
 */
export const getOrders = async (params: GetOrdersParams): Promise<Order[]> => {
  try {
    const response = await apiClient.get<Order[]>(ENDPOINTS.orders.list, {
      params
    })
    return response.data
  } catch (error) {
    console.error('[OrderAPI] Get orders error:', error)
    throw error
  }
}

// ============================================================================
// Driver Functions
// ============================================================================

/**
 * Get assigned orders for a specific driver
 * @param driverId - Driver identifier
 * @returns List of assigned orders
 */
export const getAssignedOrdersForDriver = async (driverId: string): Promise<Order[]> => {
  try {
    const response = await apiClient.get<Order[]>(
      ENDPOINTS.orders.driverOrders(driverId)
    )
    return response.data
  } catch (error) {
    console.error('[OrderAPI] Get driver orders error:', error)
    throw error
  }
}

/**
 * Mark order as on the way (driver started delivery)
 * @param orderId - Order identifier
 * @returns Updated order
 */
export const markOrderOnTheWay = async (orderId: string): Promise<Order> => {
  return updateOrderStatus(orderId, 'OnTheWay')
}

/**
 * Mark order as delivered
 * @param orderId - Order identifier
 * @param notes - Optional delivery notes
 * @returns Updated order
 */
export const markOrderDelivered = async (
  orderId: string,
  notes?: string
): Promise<Order> => {
  return updateOrderStatus(orderId, 'Delivered', notes)
}

// ============================================================================
// Common Functions
// ============================================================================

/**
 * Cancel an order
 * @param orderId - Order identifier
 * @param reason - Cancellation reason
 * @returns Updated order
 */
export const cancelOrder = async (
  orderId: string,
  reason?: string
): Promise<Order> => {
  return updateOrderStatus(orderId, 'Cancelled', reason)
}

/**
 * Accept an order (store owner accepts pending order)
 * @param orderId - Order identifier
 * @returns Updated order
 */
export const acceptOrder = async (orderId: string): Promise<Order> => {
  return updateOrderStatus(orderId, 'Accepted')
}

/**
 * Get order statistics for a store
 * @param storeId - Store identifier
 * @param startDate - Start date for statistics (ISO string)
 * @param endDate - End date for statistics (ISO string)
 * @returns Order statistics
 */
export const getOrderStatistics = async (
  storeId: string,
  startDate?: string,
  endDate?: string
): Promise<{
  total: number
  pending: number
  accepted: number
  onTheWay: number
  delivered: number
  cancelled: number
  totalRevenue: number
}> => {
  try {
    const response = await apiClient.get(ENDPOINTS.orders.statistics, {
      params: { storeId, startDate, endDate }
    })
    return response.data
  } catch (error) {
    console.error('[OrderAPI] Get statistics error:', error)
    throw error
  }
}
