/**
 * Spacing and sizing system
 * Provides normalized, responsive spacing values
 */
import { Platform, Dimensions } from 'react-native'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

// Re-export screen dimensions
export const width = screenWidth
export const height = screenHeight

// Normalize function for responsive sizing
export const normalizeX = (size: number) => (screenWidth / 375) * size
export const normalizeY = (size: number) => (screenHeight / 812) * size

// Horizontal spacing (width-based)
export const spacingX = {
  _3: normalizeX(3),
  _4: normalizeX(4),
  _5: normalizeX(5),
  _6: normalizeX(6),
  _7: normalizeX(7),
  _8: normalizeX(8),
  _10: normalizeX(10),
  _12: normalizeX(12),
  _14: normalizeX(14),
  _15: normalizeX(15),
  _16: normalizeX(16),
  _20: normalizeX(20),
  _24: normalizeX(24),
  _25: normalizeX(25),
  _30: normalizeX(30),
  _40: normalizeX(40),
  _50: normalizeX(50),
  _60: normalizeX(60),
}

// Vertical spacing (height-based)
export const spacingY = {
  _3: normalizeY(3),
  _4: normalizeY(4),
  _5: normalizeY(5),
  _6: normalizeY(6),
  _7: normalizeY(7),
  _8: normalizeY(8),
  _10: normalizeY(10),
  _12: normalizeY(12),
  _14: normalizeY(14),
  _15: normalizeY(15),
  _16: normalizeY(16),
  _20: normalizeY(20),
  _24: normalizeY(24),
  _25: normalizeY(25),
  _30: normalizeY(30),
  _35: normalizeY(35),
  _40: normalizeY(40),
  _50: normalizeY(50),
  _60: normalizeY(60),
}

// Component-specific heights (used by buttons, inputs, etc.)
export const spacingH = {
  btn: normalizeY(52),
  notiCard: normalizeY(55),
  icon: normalizeY(40),
  input: normalizeY(45),
  topImg: Platform.OS === 'ios' ? screenHeight * 0.28 : screenHeight * 0.21,
  registerTop: screenHeight * 0.3,
  _10: normalizeY(10),
  _12: normalizeY(12),
  _15: normalizeY(15),
  _20: normalizeY(20),
  _25: normalizeY(25),
  _30: normalizeY(30),
  _40: normalizeY(40),
}

// Border radius
export const radius = {
  _3: normalizeY(3),
  _4: 4,
  _5: normalizeY(5),
  _6: normalizeY(6),
  _8: 8,
  _9: 9,
  _10: normalizeY(10),
  _12: normalizeY(12),
  _14: 14,
  _15: normalizeY(15),
  _16: 16,
  _20: normalizeY(20),
  _24: 24,
  _25: normalizeY(25),
  _30: normalizeY(30),
  _35: normalizeY(35),
  _50: 50,
  _60: 60,
}

// Font sizes
export const fontS = {
  _12: normalizeY(12),
  _14: normalizeY(14),
  _16: normalizeY(16),
  _18: normalizeY(18),
  _20: normalizeY(20),
  _22: normalizeY(22),
  _24: normalizeY(24),
  _26: normalizeY(26),
  _28: normalizeY(28),
  _30: normalizeY(30),
  _32: normalizeY(32),
  _34: normalizeY(34),
  _36: normalizeY(36),
  _38: normalizeY(38),
  _40: normalizeY(40),
}
