import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { CaretLeft } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { normalizeY } from "../../utils/normalize";
import { radius, spacingX } from "../../theme/spacing";
import colors from "../../theme/colors";

interface BackIconProps {
  color?: string;
}

const BackIcon: React.FC<BackIconProps> = ({ color = "black" }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconView}>
      <CaretLeft size={18} color={color} weight="bold" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconView: {
    height: normalizeY(40),
    width: normalizeY(40),
    alignSelf: "flex-start",
    marginStart: spacingX._20,
    borderRadius: radius._25,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BackIcon;
