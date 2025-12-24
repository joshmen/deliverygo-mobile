/**
 * Address Service
 * API calls for address management
 */

import apiClient from './api/client'
import { API_ORDER_URL } from '../config/constants'
import type { Address, CreateAddressRequest, UpdateAddressRequest } from '../types/address'

const BASE_URL = `${API_ORDER_URL}/api/customer/addresses`

export const addressService = {
  // Get all addresses for a customer
  getAddresses: async (customerId: string): Promise<Address[]> => {
    const response = await apiClient.get<Address[]>(`${BASE_URL}/${customerId}`)
    return response.data
  },

  // Create a new address
  createAddress: async (request: CreateAddressRequest): Promise<Address> => {
    const response = await apiClient.post<Address>(BASE_URL, request)
    return response.data
  },

  // Update an existing address
  updateAddress: async (id: string, request: UpdateAddressRequest): Promise<Address> => {
    const response = await apiClient.put<Address>(`${BASE_URL}/${id}`, request)
    return response.data
  },

  // Delete an address
  deleteAddress: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`)
  }
}

export default addressService
