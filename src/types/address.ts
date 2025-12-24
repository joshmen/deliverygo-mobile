/**
 * Address Types
 */

export interface Address {
  id: string
  customerId: string
  label: string
  street: string
  city: string
  state?: string | null
  postalCode?: string | null
  deliveryInstructions?: string | null
  createdAt?: string
}

export interface CreateAddressRequest {
  customerId: string
  label: string
  street: string
  city: string
  state?: string | null
  postalCode?: string | null
  deliveryInstructions?: string | null
}

export interface UpdateAddressRequest {
  label: string
  street: string
  city: string
  state?: string | null
  postalCode?: string | null
  deliveryInstructions?: string | null
}

export const formatAddress = (address: Address): string => {
  let formatted = `${address.street}, ${address.city}`
  if (address.state) {
    formatted += `, ${address.state}`
  }
  if (address.postalCode) {
    formatted += ` ${address.postalCode}`
  }
  return formatted
}
