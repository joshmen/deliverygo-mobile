import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Typo from './Typo';
import { radius, spacingH, spacingX } from '../../theme/spacing';
import colors from '../../theme/colors';
import MyIndicator from './MyIndicator';

export interface AppButtonProps {
  label?: string;
  title?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

const AppButton: React.FC<AppButtonProps> = ({
  label = '',
  title,
  onPress,
  style,
  textStyle,
  loading = false,
  disabled = false,
  icon,
  variant = 'primary',
}) => {
  const buttonText = title || label;

  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.lightGray;
      case 'outline':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.black;
      case 'outline':
        return colors.primary;
      default:
        return colors.white;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && styles.outline,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <MyIndicator visible={loading} />
      ) : (
        <>
          {icon}
          <Typo
            size={14}
            color={getTextColor()}
            weight="500"
            style={StyleSheet.flatten([styles.label, textStyle])}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {buttonText}
          </Typo>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: spacingH.btn,
    borderRadius: radius._12,
    alignSelf: 'center',
  },
  label: {
    color: colors.white,
    fontWeight: '500',
    marginHorizontal: spacingX._10,
  },
  disabled: {
    opacity: 0.5,
  },
  outline: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
});

export default AppButton;
