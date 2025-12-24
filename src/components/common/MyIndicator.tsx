import {
  StyleSheet,
  View,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React from 'react';
import colors from '../../theme/colors';

interface MyIndicatorProps {
  visible: boolean;
  style?: StyleProp<ViewStyle>;
  size?: 'small' | 'large';
  color?: string;
}

const MyIndicator: React.FC<MyIndicatorProps> = ({
  visible,
  style,
  size,
  color,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        style={{ width: 50, height: 50 }}
        size={size ?? 'small'}
        color={color ?? colors.black}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
  },
});

export default MyIndicator;
