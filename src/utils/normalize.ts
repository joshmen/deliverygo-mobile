import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions for design (iPhone 11 Pro)
const baseWidth = 375;
const baseHeight = 812;

/**
 * Normalize width value based on screen width
 */
export const normalizeX = (size: number): number => {
  const scale = SCREEN_WIDTH / baseWidth;
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

/**
 * Normalize height value based on screen height
 */
export const normalizeY = (size: number): number => {
  const scale = SCREEN_HEIGHT / baseHeight;
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

/**
 * Normalize font size
 */
export const normalizeFontSize = (size: number): number => {
  return normalizeY(size);
};
