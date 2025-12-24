/**
 * Address Picker Modal
 * Select or add delivery address with GPS location and autocomplete
 */

import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
} from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as Icons from 'phosphor-react-native'
import * as Location from 'expo-location'

import Typo from '../common/Typo'
import AppButton from '../common/AppButton'
import { useUser, useAuthStore } from '../../store/auth.store'
import addressService from '../../services/address.service'
import type { Address, CreateAddressRequest } from '../../types/address'
import { formatAddress } from '../../types/address'
import { GOOGLE_MAPS_API_KEY } from '../../config/constants'

import colors from '../../theme/colors'
import { spacingX, spacingY, radius } from '../../theme/spacing'

interface AddressPickerModalProps {
  visible: boolean
  onClose: () => void
  onSelectAddress: (address: Address) => void
  selectedAddressId?: string
}

interface PlacePrediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

const AddressPickerModal: React.FC<AddressPickerModalProps> = ({
  visible,
  onClose,
  onSelectAddress,
  selectedAddressId,
}) => {
  const user = useUser()
  const queryClient = useQueryClient()

  const [showAddForm, setShowAddForm] = useState(false)
  const [label, setLabel] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [deliveryInstructions, setDeliveryInstructions] = useState('')
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)

  // Autocomplete search
  const [searchQuery, setSearchQuery] = useState('')
  const [predictions, setPredictions] = useState<PlacePrediction[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch addresses
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: () => {
      if (!user?.id) {
        throw new Error('User ID is required to fetch addresses')
      }
      return addressService.getAddresses(user.id)
    },
    enabled: !!user?.id && visible,
  })

  // Get current location
  const getCurrentLocation = async () => {
    try {
      setIsGettingLocation(true)
      console.log('[Location] Requesting permissions...')

      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se requiere permiso de ubicación para detectar tu dirección')
        return
      }

      console.log('[Location] Getting current position...')
      const location = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = location.coords

      console.log('[Location] Got coordinates:', latitude, longitude)

      // Reverse geocode to get address
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      const response = await fetch(url)
      const data = await response.json()

      console.log('[Location] Geocoding response:', data)

      if (data.status === 'REQUEST_DENIED') {
        console.error('[Location] Geocoding API not enabled or API key not authorized')
        Alert.alert(
          'API no configurada',
          'La API de Google no está habilitada. Por favor ingresa tu dirección manualmente.',
          [{ text: 'OK' }]
        )
        return
      }

      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        setSelectedAddress(result.formatted_address)
        parseAddressComponents(result.address_components, result.formatted_address)
        Alert.alert('¡Ubicación detectada!', 'Verifica que la dirección sea correcta.')
      } else {
        Alert.alert('No se encontró dirección', 'Por favor ingresa tu dirección manualmente.')
      }
    } catch (error) {
      console.error('[Location] Error:', error)
      Alert.alert('Error', 'No se pudo obtener tu ubicación. Por favor ingresa manualmente.')
    } finally {
      setIsGettingLocation(false)
    }
  }

  // Search for address predictions using Google Places API
  const searchPlaces = async (query: string) => {
    if (!query || query.length < 3) {
      setPredictions([])
      return
    }

    try {
      setIsSearching(true)
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}&language=es`

      console.log('[PlacesAutocomplete] Searching:', query)
      const response = await fetch(url)
      const data = await response.json()

      console.log('[PlacesAutocomplete] Response:', data)

      if (data.status === 'OK' && data.predictions) {
        setPredictions(data.predictions)
      } else if (data.status === 'ZERO_RESULTS') {
        setPredictions([])
      } else {
        console.error('[PlacesAutocomplete] Error:', data.status)
        setPredictions([])
      }
    } catch (error) {
      console.error('[PlacesAutocomplete] Error:', error)
      setPredictions([])
    } finally {
      setIsSearching(false)
    }
  }

  // Handle search input change with debounce
  const handleSearchChange = (text: string) => {
    setSearchQuery(text)

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(text)
    }, 400)
  }

  // Get place details and parse address
  const selectPlace = async (placeId: string, description: string) => {
    try {
      console.log('[PlacesAutocomplete] Getting place details:', placeId)
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}&language=es`

      const response = await fetch(url)
      const data = await response.json()

      console.log('[PlacesAutocomplete] Place details:', data)

      if (data.status === 'OK' && data.result) {
        const result = data.result
        setSelectedAddress(result.formatted_address || description)
        parseAddressComponents(result.address_components, result.formatted_address)
        setPredictions([])
        setSearchQuery('')
      }
    } catch (error) {
      console.error('[PlacesAutocomplete] Error getting place details:', error)
      Alert.alert('Error', 'No se pudo obtener los detalles de la dirección')
    }
  }

  // Parse address components from Google
  const parseAddressComponents = (components: any[], formattedAddress: string) => {
    let streetNumber = ''
    let route = ''
    let cityName = ''
    let stateName = ''
    let postalCodeValue = ''

    components.forEach((component: any) => {
      const types = component.types
      if (types.includes('street_number')) {
        streetNumber = component.long_name
      }
      if (types.includes('route')) {
        route = component.long_name
      }
      if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        cityName = component.long_name
      }
      if (types.includes('administrative_area_level_1')) {
        stateName = component.short_name
      }
      if (types.includes('postal_code')) {
        postalCodeValue = component.long_name
      }
    })

    setStreet(`${streetNumber} ${route}`.trim() || formattedAddress.split(',')[0])
    setCity(cityName)
    setState(stateName)
    setPostalCode(postalCodeValue)
  }

  // Create address mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      console.log('[AddressPickerModal] ===== STARTING ADDRESS CREATION =====')
      console.log('[AddressPickerModal] User:', JSON.stringify(user, null, 2))
      console.log('[AddressPickerModal] User ID:', user?.id)
      console.log('[AddressPickerModal] Label:', label)
      console.log('[AddressPickerModal] Street:', street)
      console.log('[AddressPickerModal] City:', city)
      console.log('[AddressPickerModal] State:', state)
      console.log('[AddressPickerModal] Postal Code:', postalCode)
      console.log('[AddressPickerModal] House Number:', houseNumber)

      if (!user?.id) {
        const errorMsg = 'No has iniciado sesión. Por favor inicia sesión primero.'
        console.error('[AddressPickerModal] User or User ID is null')
        Alert.alert('Error', errorMsg)
        throw new Error(errorMsg)
      }

      if (!label.trim()) {
        const errorMsg = 'Por favor selecciona una etiqueta (Casa, Oficina, Otro)'
        console.error('[AddressPickerModal] Missing label')
        Alert.alert('Error', errorMsg)
        throw new Error(errorMsg)
      }

      if (!street.trim() || !city.trim()) {
        const errorMsg = 'Por favor busca y selecciona una dirección primero'
        console.error('[AddressPickerModal] Missing street or city')
        Alert.alert('Error', errorMsg)
        throw new Error(errorMsg)
      }

      // Combine street with house number if provided
      const fullStreet = houseNumber.trim()
        ? `${street.trim()} ${houseNumber.trim()}`
        : street.trim()

      const addressData = {
        customerId: user.id,
        label: label.trim(),
        street: fullStreet,
        city: city.trim(),
        state: state.trim() || null,
        postalCode: postalCode.trim() || null,
        deliveryInstructions: deliveryInstructions.trim() || null,
      }

      console.log('[AddressPickerModal] Address data to create:', JSON.stringify(addressData, null, 2))

      try {
        const result = await addressService.createAddress(addressData)
        console.log('[AddressPickerModal] Address created successfully:', JSON.stringify(result, null, 2))
        return result
      } catch (error) {
        console.error('[AddressPickerModal] Error in createAddress:', error)
        throw error
      }
    },
    onSuccess: (newAddress) => {
      console.log('[AddressPickerModal] ===== ADDRESS SAVED SUCCESSFULLY =====')
      console.log('[AddressPickerModal] New address:', JSON.stringify(newAddress, null, 2))
      Alert.alert('¡Éxito!', 'Dirección guardada correctamente')
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      onSelectAddress(newAddress)
      resetForm()
      setShowAddForm(false)
      onClose()
    },
    onError: (error: Error) => {
      console.error('[AddressPickerModal] Error creating address:', error)
      Alert.alert('Error', error.message || 'Failed to add address')
    },
  })

  const resetForm = () => {
    setLabel('')
    setStreet('')
    setCity('')
    setState('')
    setPostalCode('')
    setHouseNumber('')
    setDeliveryInstructions('')
    setSelectedAddress(null)
    setSearchQuery('')
    setPredictions([])
  }

  const handleChangeAddress = () => {
    setSelectedAddress(null)
    setStreet('')
    setCity('')
    setState('')
    setPostalCode('')
    setHouseNumber('')
    setSearchQuery('')
    setPredictions([])
  }

  const handleClose = () => {
    resetForm()
    setShowAddForm(false)
    onClose()
  }

  const handleSelectAddress = (address: Address) => {
    onSelectAddress(address)
    handleClose()
  }

  const handleAddNewAddress = () => {
    setShowAddForm(true)
    setLabel('Casa')
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.modalOverlay}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={[
          styles.modalContent,
          showAddForm && selectedAddress && { height: '80%' }
        ]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Typo size={18} weight="600">
              {showAddForm ? 'Agregar Dirección' : 'Seleccionar Dirección de Entrega'}
            </Typo>
            <TouchableOpacity onPress={handleClose}>
              <Icons.X size={24} color={colors.dark} />
            </TouchableOpacity>
          </View>

          {showAddForm ? (
            // Add Address Form
            <View style={{ flex: 1, minHeight: 0 }}>
              {!selectedAddress ? (
                // Search Mode
                <View style={{ flex: 1 }}>
                  {/* Current Location Button */}
                  <TouchableOpacity
                    style={styles.locationButton}
                    onPress={getCurrentLocation}
                    disabled={isGettingLocation}
                  >
                    {isGettingLocation ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <Icons.MapPin size={20} color={colors.primary} weight="bold" />
                    )}
                    <Typo size={14} color={colors.primary} weight="600" style={{ marginLeft: 8 }}>
                      {isGettingLocation ? 'Detectando ubicación...' : 'Usar ubicación actual'}
                    </Typo>
                  </TouchableOpacity>

                  <Typo size={13} color={colors.textGray} style={{ marginVertical: 15, textAlign: 'center' }}>
                    o busca tu dirección
                  </Typo>

                  {/* Address Search */}
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar dirección..."
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {isSearching && (
                    <ActivityIndicator
                      size="small"
                      color={colors.primary}
                      style={styles.searchLoader}
                    />
                  )}

                  {/* Predictions List - Using FlatList without ScrollView wrapper */}
                  {predictions.length > 0 && (
                    <FlatList
                      data={predictions}
                      keyExtractor={(item) => item.place_id}
                      style={styles.predictionsContainer}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.predictionItem}
                          onPress={() => selectPlace(item.place_id, item.description)}
                        >
                          <Icons.MapPin size={18} color={colors.textGray} />
                          <View style={{ flex: 1, marginLeft: 10 }}>
                            <Typo size={14} weight="500">
                              {item.structured_formatting.main_text}
                            </Typo>
                            <Typo size={12} color={colors.textGray}>
                              {item.structured_formatting.secondary_text}
                            </Typo>
                          </View>
                        </TouchableOpacity>
                      )}
                      ItemSeparatorComponent={() => <View style={styles.separator} />}
                      keyboardShouldPersistTaps="handled"
                    />
                  )}
                </View>
              ) : (
                // Details Mode - After address selected
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Selected Address with Change Button */}
                  <View style={styles.addressHeader}>
                    <View style={{ flex: 1 }}>
                      <Typo size={15} weight="600">
                        {street || selectedAddress}
                      </Typo>
                      <Typo size={13} color={colors.textGray} style={{ marginTop: 4 }}>
                        {city && state ? `${city}, ${state}` : city || state}
                        {postalCode && ` ${postalCode}`}
                      </Typo>
                    </View>
                    <TouchableOpacity onPress={handleChangeAddress}>
                      <Typo size={14} color={colors.primary} weight="600">
                        Cambiar
                      </Typo>
                    </TouchableOpacity>
                  </View>

                  {/* House Number / Apartment */}
                  <View style={{ marginTop: 20 }}>
                    <Typo size={14} weight="600" style={{ marginBottom: 8 }}>
                      Número exterior / interior
                    </Typo>
                    <TextInput
                      style={styles.input}
                      placeholder="Ejemplo: #123, Depto 4B"
                      value={houseNumber}
                      onChangeText={setHouseNumber}
                    />
                  </View>

                  {/* Delivery Instructions */}
                  <View style={{ marginTop: 15 }}>
                    <Typo size={14} weight="600" style={{ marginBottom: 8 }}>
                      Encontrarse en la puerta
                    </Typo>
                    <TextInput
                      style={[styles.input, { height: 80 }]}
                      placeholder="Agregar notas para la entrega o subir fotos"
                      value={deliveryInstructions}
                      onChangeText={setDeliveryInstructions}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>

                  {/* Label Selection */}
                  <View style={{ marginTop: 20 }}>
                    <Typo size={14} weight="600" style={{ marginBottom: 12 }}>
                      Marcar como ubicación frecuente
                    </Typo>
                    <View style={styles.labelButtons}>
                      <TouchableOpacity
                        style={[
                          styles.labelButton,
                          label === 'Casa' && styles.labelButtonActive,
                        ]}
                        onPress={() => setLabel('Casa')}
                      >
                        <Typo
                          size={14}
                          weight="600"
                          color={label === 'Casa' ? colors.primary : colors.textGray}
                        >
                          Casa
                        </Typo>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.labelButton,
                          label === 'Oficina' && styles.labelButtonActive,
                        ]}
                        onPress={() => setLabel('Oficina')}
                      >
                        <Typo
                          size={14}
                          weight="600"
                          color={label === 'Oficina' ? colors.primary : colors.textGray}
                        >
                          Oficina
                        </Typo>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.labelButton,
                          label === 'Otro' && styles.labelButtonActive,
                        ]}
                        onPress={() => setLabel('Otro')}
                      >
                        <Typo
                          size={14}
                          weight="600"
                          color={label === 'Otro' ? colors.primary : colors.textGray}
                        >
                          Otro
                        </Typo>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Save Button */}
                  <AppButton
                    title="Guardar dirección"
                    onPress={() => createMutation.mutate()}
                    loading={createMutation.isPending}
                    style={{ marginTop: 30, marginBottom: 20 }}
                  />
                </ScrollView>
              )}
            </View>
          ) : (
            // Address List
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View>
                {isLoading ? (
                  <Typo style={{ textAlign: 'center', marginVertical: 30 }}>Cargando...</Typo>
                ) : addresses.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Icons.MapPin size={48} color={colors.textGray} weight="thin" />
                    <Typo size={14} color={colors.textGray} style={{ marginTop: 15 }}>
                      No tienes direcciones guardadas
                    </Typo>
                  </View>
                ) : (
                  addresses.map((address) => (
                    <TouchableOpacity
                      key={address.id}
                      style={[
                        styles.addressCard,
                        selectedAddressId === address.id && styles.addressCardSelected,
                      ]}
                      onPress={() => handleSelectAddress(address)}
                    >
                      <View style={{ flex: 1 }}>
                        <View style={styles.labelBadge}>
                          <Typo size={11} color={colors.primary} weight="600">
                            {address.label}
                          </Typo>
                        </View>
                        <Typo size={15} weight="500" style={{ marginTop: 8 }}>
                          {address.street}
                        </Typo>
                        <Typo size={13} color={colors.textGray} style={{ marginTop: 4 }}>
                          {formatAddress(address)}
                        </Typo>
                      </View>
                      {selectedAddressId === address.id && (
                        <Icons.CheckCircle size={24} color={colors.primary} weight="fill" />
                      )}
                    </TouchableOpacity>
                  ))
                )}

                {/* Add New Address Button */}
                <TouchableOpacity style={styles.addAddressButton} onPress={handleAddNewAddress}>
                  <Icons.Plus size={20} color={colors.primary} weight="bold" />
                  <Typo size={15} color={colors.primary} weight="600">
                    Agregar Nueva Dirección
                  </Typo>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._20,
    borderTopRightRadius: radius._20,
    padding: spacingX._20,
    maxHeight: '90%',
    minHeight: '40%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._20,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: radius._8,
    padding: spacingY._12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  searchInput: {
    backgroundColor: colors.background,
    borderRadius: radius._8,
    fontSize: 15,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingHorizontal: spacingX._15,
    paddingRight: 40,
    height: 48,
  },
  searchLoader: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  predictionsContainer: {
    backgroundColor: colors.white,
    borderRadius: radius._8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    maxHeight: 250,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._15,
  },
  separator: {
    height: 1,
    backgroundColor: colors.lightGray,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacingY._15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  labelButtons: {
    flexDirection: 'row',
  },
  labelButton: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._10,
    borderRadius: radius._20,
    borderWidth: 1.5,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    marginRight: spacingX._10,
  },
  labelButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacingY._20,
    paddingTop: spacingY._10,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacingX._15,
    borderRadius: radius._12,
    marginBottom: spacingY._10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  addressCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  labelBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacingX._8,
    paddingVertical: spacingY._3,
    borderRadius: radius._4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacingX._8,
    padding: spacingY._15,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius._12,
    borderStyle: 'dashed',
    marginTop: spacingY._10,
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
  formActions: {
    flexDirection: 'row',
    marginTop: spacingY._10,
  },
})

export default AddressPickerModal
