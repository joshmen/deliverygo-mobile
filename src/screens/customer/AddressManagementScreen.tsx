/**
 * Address Management Screen
 * Manage delivery addresses
 */

import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Icons from 'phosphor-react-native'

import { Typo, AppButton, AppIcon } from '../../components/common'
import { useUser } from '../../store/auth.store'
import addressService from '../../services/address.service'
import type { Address, CreateAddressRequest } from '../../types/address'

import colors from '../../theme/colors'
import { spacingX, spacingY, radius } from '../../theme/spacing'

const AddressManagementScreen: React.FC = () => {
  const navigation = useNavigation()
  const user = useUser()
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()

  const [modalVisible, setModalVisible] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [label, setLabel] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [deliveryInstructions, setDeliveryInstructions] = useState('')

  // Fetch addresses
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: () => addressService.getAddresses(user!.id),
    enabled: !!user?.id,
  })

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('User not found. Please log in again.')
      }

      if (editingAddress) {
        return addressService.updateAddress(editingAddress.id, {
          label,
          street,
          city,
          state: state || null,
          postalCode: postalCode || null,
          deliveryInstructions: deliveryInstructions || null,
        })
      } else {
        return addressService.createAddress({
          customerId: user.id,
          label,
          street,
          city,
          state: state || null,
          postalCode: postalCode || null,
          deliveryInstructions: deliveryInstructions || null,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      closeModal()
      Alert.alert('Success', editingAddress ? 'Address updated!' : 'Address added!')
    },
    onError: () => {
      Alert.alert('Error', 'Failed to save address')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => addressService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      Alert.alert('Success', 'Address deleted!')
    },
    onError: () => {
      Alert.alert('Error', 'Failed to delete address')
    },
  })

  const openModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address)
      setLabel(address.label)
      setStreet(address.street)
      setCity(address.city)
      setState(address.state || '')
      setPostalCode(address.postalCode || '')
      setDeliveryInstructions(address.deliveryInstructions || '')
    } else {
      setEditingAddress(null)
      setLabel('Home')
      setStreet('')
      setCity('')
      setState('')
      setPostalCode('')
      setDeliveryInstructions('')
    }
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setEditingAddress(null)
  }

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
      ]
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.CaretLeft size={24} color={colors.dark} weight="bold" />
        </TouchableOpacity>
        <Typo size={18} weight="600">
          My Addresses
        </Typo>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? (
          <Typo style={{ textAlign: 'center', marginTop: 50 }}>Loading...</Typo>
        ) : addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <Icons.MapPin size={64} color={colors.textGray} weight="thin" />
            <Typo size={16} color={colors.textGray} style={{ marginTop: 20 }}>
              No addresses yet
            </Typo>
          </View>
        ) : (
          addresses.map((address) => (
            <View key={address.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <View style={{ flex: 1 }}>
                  <View style={styles.labelBadge}>
                    <Typo size={12} color={colors.primary} weight="600">
                      {address.label}
                    </Typo>
                  </View>
                  <Typo size={16} weight="500" style={{ marginTop: 8 }}>
                    {address.street}
                  </Typo>
                  <Typo size={14} color={colors.textGray}>
                    {address.city}{address.state ? `, ${address.state}` : ''}{address.postalCode ? ` ${address.postalCode}` : ''}
                  </Typo>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={() => openModal(address)}
                    style={styles.iconButton}
                  >
                    <Icons.PencilSimple size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(address.id)}
                    style={styles.iconButton}
                  >
                    <Icons.Trash size={20} color={colors.red} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Button */}
      <View style={styles.addButtonContainer}>
        <AppButton
          title="Add New Address"
          onPress={() => openModal()}
          icon={<Icons.Plus size={20} color={colors.white} weight="bold" />}
        />
      </View>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typo size={18} weight="600">
                {editingAddress ? 'Edit Address' : 'Add Address'}
              </Typo>
              <TouchableOpacity onPress={closeModal}>
                <Icons.X size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <TextInput
                style={styles.input}
                placeholder="Label (Home, Work, etc.)"
                value={label}
                onChangeText={setLabel}
              />
              <TextInput
                style={styles.input}
                placeholder="Street Address"
                value={street}
                onChangeText={setStreet}
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 10 }]}
                  placeholder="State (Optional)"
                  value={state}
                  onChangeText={setState}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Postal Code (Optional)"
                  value={postalCode}
                  onChangeText={setPostalCode}
                />
              </View>
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Delivery Instructions (Optional)"
                value={deliveryInstructions}
                onChangeText={setDeliveryInstructions}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <AppButton
                title="Cancel"
                onPress={closeModal}
                variant="outline"
                style={{ flex: 1, marginRight: 10 }}
              />
              <AppButton
                title="Save"
                onPress={() => saveMutation.mutate()}
                loading={saveMutation.isPending}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  content: {
    flex: 1,
    padding: spacingX._20,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  addressCard: {
    backgroundColor: colors.white,
    padding: spacingX._15,
    borderRadius: radius._12,
    marginBottom: spacingY._12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacingX._10,
    paddingVertical: spacingY._4,
    borderRadius: radius._6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacingX._10,
  },
  iconButton: {
    padding: spacingX._8,
  },
  addButtonContainer: {
    padding: spacingX._20,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._20,
    borderTopRightRadius: radius._20,
    padding: spacingX._20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._20,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius._8,
    padding: spacingX._15,
    fontSize: 15,
    color: colors.dark,
    marginBottom: spacingY._12,
  },
  row: {
    flexDirection: 'row',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: spacingY._10,
  },
})

export default AddressManagementScreen
