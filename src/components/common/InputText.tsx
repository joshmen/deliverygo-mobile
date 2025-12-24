import React from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from "react-native";
import { normalizeY } from "../../utils/normalize";
import { radius, spacingY } from "../../theme/spacing";
import colors from "../../theme/colors";
import Typo from "./Typo";

interface InputTextProps extends TextInputProps {
  index: number;
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  inputStyle?: StyleProp<TextStyle>;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

const InputText: React.FC<InputTextProps> = ({
  index,
  label,
  value,
  onChangeText,
  placeholder,
  inputStyle = {},
  containerStyle,
  labelStyle,
  ...props
}) => {
  return (
    <View style={[{ width: "100%" }, containerStyle]}>
      <Typo style={[styles.label, labelStyle || {}]}>{label}</Typo>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={"rgba(0,0,0,0.5)"}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "rgba(0,0,0,0.7)",
    fontSize: normalizeY(14),
    fontWeight: "600",
    marginBottom: spacingY._10,
  },
  input: {
    paddingHorizontal: spacingY._20,
    marginBottom: spacingY._20,
    borderRadius: radius._12,
    backgroundColor: colors.input,
    paddingVertical: normalizeY(17),
    fontSize: normalizeY(16),
    fontWeight: "600",
    color: colors.black,
  },
});

export default InputText;
