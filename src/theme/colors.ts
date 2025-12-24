/**
 * Color palette from template
 * Integrated with tenant branding system
 */

import type { TenantConfig } from '../types'

// Template color palette
const colors = {
  transparent: 'transparent',
  white: '#fff',
  black: '#000',
  primary: '#ff7623',
  lightPrimary: '#ffe1cd',
  yellow: '#ffd27c',
  gray: '#80807F',
  dark: '#121223',
  input: '#f0f5fb',
  lightGray: '#ebf0f4',
  textGray: '#babdcc',
  count: '#41414f',
  orange: '#f58d1e',
  green: '#0b7457',
  red: '#ff3434',
  splash: '#e04c05',
  background: '#f7f8fa',
  purple: '#8786fd',
  blue: '#64b2ff',
  lightBlue: '#7aebeb',
  pink: '#ff6b9d',
  brown: '#8b5a2b',
}

// Also export as templateColors for compatibility
export const templateColors = colors

/**
 * Get theme colors with tenant branding override
 * @param tenantConfig Optional tenant configuration for branding
 * @returns Color palette with tenant-specific overrides
 */
export const getThemeColors = (tenantConfig?: TenantConfig) => ({
  ...colors,
  // Override with tenant branding if available
  primary: tenantConfig?.branding.primaryColor || colors.primary,
  secondary: tenantConfig?.branding.secondaryColor || colors.lightPrimary,
})

export default colors
