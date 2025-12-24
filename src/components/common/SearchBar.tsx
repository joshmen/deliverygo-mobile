/**
 * Search Bar component from template
 * Styled search input with icon
 */
import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import * as Icons from 'phosphor-react-native'
import colors from '../../theme/colors'
import { spacingX, spacingY, radius } from '../../theme/spacing'
import { normalizeX } from '../../theme/spacing'

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  editable?: boolean
  onPress?: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search for restaurants...',
  editable = true,
  onPress
}) => {
  const content = (
    <View style={styles.container}>
      <Icons.MagnifyingGlass size={20} color={colors.textGray} weight="bold" />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textGray}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
      />
    </View>
  )

  if (!editable && onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    )
  }

  return content
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input,
    borderRadius: radius._12,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._12,
    gap: spacingX._10,
  },
  input: {
    flex: 1,
    fontSize: normalizeX(15),
    color: colors.dark,
  }
})

export default SearchBar
