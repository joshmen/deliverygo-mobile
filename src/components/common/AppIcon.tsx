import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  ImageStyle,
  StyleProp,
} from "react-native";
import { Icon, IconProps } from "phosphor-react-native";
import { radius, spacingY } from "../../theme/spacing";
import colors from "../../theme/colors";
import { normalizeY } from "../../utils/normalize";
// @/app/utils/normalize
interface AppIconProps {
  icon: React.FC<IconProps>;
  iconSize?: number;
  iconColor?: string;
  iconWeight?: "thin" | "light" | "regular" | "bold" | "fill";
  iconStyle?: StyleProp<ViewStyle>;
  containerStyle?: ViewStyle;
  onPress?: () => void;
}

const AppIcon: React.FC<AppIconProps> = ({
  icon: Icon,
  iconSize = 23,
  iconColor = colors.black,
  iconWeight = "bold",
  iconStyle = {},
  containerStyle,
  onPress,
}) => {
  const size = normalizeY(42);

  return (
    <TouchableOpacity
      style={[styles.icon, { height: size, width: size }, containerStyle]}
      onPress={onPress}
    >
      <Icon
        size={iconSize}
        color={iconColor}
        weight={iconWeight}
        duotoneColor="black"
        duotoneOpacity={0.9}
        style={iconStyle}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    borderRadius: radius._25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightGray,
  },
});

export default AppIcon;
