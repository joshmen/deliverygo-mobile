/**
 * Ring Animation Component (Simplified - Without Reanimated)
 * Static rings - animations removed for Expo Go compatibility
 */

import { StyleSheet, View } from 'react-native'
import React from 'react'

// Theme
import { normalizeY } from '../../utils/normalize'
import colors from '../../theme/colors'

const SIZE = normalizeY(40)

interface RingAnimationProps {
  numberOfRings?: number
  color?: string
  children?: React.ReactNode
}

const RingAnimation: React.FC<RingAnimationProps> = ({
  numberOfRings = 3,
  color = colors.primary,
  children
}) => {
  return (
    <View style={styles.container}>
      {/* Rings animation disabled - requires react-native-reanimated */}
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default RingAnimation
