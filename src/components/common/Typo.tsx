import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { normalizeY } from '../../utils/normalize';
import colors from '../../theme/colors';

export interface TypoProps extends TextProps {
  size?: number;
  color?: string;
  weight?: 'normal' | 'bold' | '500' | '600' | '700';
  style?: TextStyle | TextStyle[];
}

const Typo: React.FC<TypoProps> = ({
  size,
  color = colors.black,
  weight = 'normal',
  style,
  children,
  ...props
}) => {
  const fontWeight =
    weight === 'bold' ? '700' :
    weight === '700' ? '700' :
    weight === '600' ? '600' :
    weight === '500' ? '500' :
    '400';

  return (
    <Text
      allowFontScaling={false}
      style={[
        styles.default,
        {
          fontSize: size ? normalizeY(size) : normalizeY(14),
          color,
          fontWeight,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  default: {
    fontFamily: 'System',
  },
});

export default Typo;
