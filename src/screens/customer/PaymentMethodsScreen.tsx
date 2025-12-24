/**
 * Payment Methods Screen
 * Manage payment methods for orders
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
  StatusBar
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Icons from 'phosphor-react-native'

// Template components
import { Typo, AppButton, AppIcon } from '../../components/common'

// Template theme
import colors from '../../theme/colors'
import { spacingX, spacingY, radius } from '../../theme/spacing'

// Payment method types
interface PaymentMethod {
  id: string
  type: 'card' | 'cash' | 'wallet'
  name: string
  lastFour?: string
  expiryDate?: string
  isDefault: boolean
}

const PaymentMethodsScreen: React.FC = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  // Mock data - replace with API call
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa',
      lastFour: '4242',
      expiryDate: '12/25',
      isDefault: true
    },
    {
      id: '2',
      type: 'cash',
      name: 'Cash on Delivery',
      isDefault: false
    },
    {
      id: '3',
      type: 'wallet',
      name: 'Digital Wallet',
      isDefault: false
    }
  ])

  const [modalVisible, setModalVisible] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    )
    Alert.alert('Success', 'Default payment method updated')
  }

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(methods => methods.filter(m => m.id !== id))
            Alert.alert('Success', 'Payment method removed')
          }
        }
      ]
    )
  }

  const handleAddCard = () => {
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      Alert.alert('Error', 'Please fill all fields')
      return
    }

    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      name: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
      lastFour: cardNumber.slice(-4),
      expiryDate,
      isDefault: paymentMethods.length === 0
    }

    setPaymentMethods([...paymentMethods, newCard])
    setModalVisible(false)
    setCardNumber('')
    setCardName('')
    setExpiryDate('')
    setCvv('')
    Alert.alert('Success', 'Card added successfully')
  }

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card':
        return Icons.CreditCard
      case 'cash':
        return Icons.Money
      case 'wallet':
        return Icons.Wallet
      default:
        return Icons.CreditCard
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacingY._15 }]}>
        <AppIcon
          icon={Icons.ArrowLeft}
          onPress={() => navigation.goBack()}
        />
        <Typo size={18} weight="600" style={{ flex: 1, marginLeft: spacingX._12 }}>
          Payment Methods
        </Typo>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Icons.Info size={20} color={colors.primary} weight="bold" />
          <Typo size={13} color={colors.textGray} style={{ marginLeft: spacingX._10, flex: 1 }}>
            Your payment information is securely stored and encrypted
          </Typo>
        </View>

        {/* Payment Methods List */}
        {paymentMethods.map((method) => {
          const PaymentIcon = getPaymentIcon(method.type)
          return (
            <View key={method.id} style={styles.methodCard}>
              <View style={styles.methodLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                  <PaymentIcon size={24} color={colors.primary} weight="bold" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacingX._8 }}>
                    <Typo size={16} weight="600">
                      {method.name}
                    </Typo>
                    {method.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Typo size={11} weight="600" color={colors.white}>
                          DEFAULT
                        </Typo>
                      </View>
                    )}
                  </View>
                  {method.lastFour && (
                    <Typo size={14} color={colors.textGray} style={{ marginTop: spacingY._4 }}>
                      •••• •••• •••• {method.lastFour}
                    </Typo>
                  )}
                  {method.expiryDate && (
                    <Typo size={13} color={colors.textGray}>
                      Expires {method.expiryDate}
                    </Typo>
                  )}
                </View>
              </View>

              <View style={styles.methodActions}>
                {!method.isDefault && (
                  <TouchableOpacity
                    onPress={() => handleSetDefault(method.id)}
                    style={styles.actionButton}
                  >
                    <Icons.Star size={20} color={colors.textGray} weight="bold" />
                  </TouchableOpacity>
                )}
                {method.type === 'card' && (
                  <TouchableOpacity
                    onPress={() => handleDelete(method.id)}
                    style={styles.actionButton}
                  >
                    <Icons.Trash size={20} color={colors.red} weight="bold" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )
        })}

        {/* Empty State */}
        {paymentMethods.length === 0 && (
          <View style={styles.emptyState}>
            <Icons.CreditCard size={64} color={colors.textGray} weight="thin" />
            <Typo size={16} weight="600" style={{ marginTop: spacingY._15 }}>
              No payment methods yet
            </Typo>
            <Typo size={14} color={colors.textGray} style={{ marginTop: spacingY._8, textAlign: 'center' }}>
              Add a card to make checkout faster
            </Typo>
          </View>
        )}
      </ScrollView>

      {/* Add Card Button */}
      <View style={styles.addButtonContainer}>
        <AppButton
          title="Add New Card"
          onPress={() => setModalVisible(true)}
          icon={<Icons.Plus size={20} color={colors.white} weight="bold" />}
        />
      </View>

      {/* Add Card Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typo size={18} weight="600">
                Add New Card
              </Typo>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icons.X size={24} color={colors.dark} weight="bold" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Typo size={13} color={colors.textGray} style={{ marginBottom: spacingY._15 }}>
                Enter your card details below
              </Typo>

              <TextInput
                style={styles.input}
                placeholder="Card Number"
                placeholderTextColor={colors.textGray}
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="number-pad"
                maxLength={16}
              />

              <TextInput
                style={styles.input}
                placeholder="Cardholder Name"
                placeholderTextColor={colors.textGray}
                value={cardName}
                onChangeText={setCardName}
                autoCapitalize="words"
              />

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: spacingX._10 }]}
                  placeholder="MM/YY"
                  placeholderTextColor={colors.textGray}
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  maxLength={5}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="CVV"
                  placeholderTextColor={colors.textGray}
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="number-pad"
                  maxLength={3}
                  secureTextEntry
                />
              </View>

              <View style={styles.securityNote}>
                <Icons.Lock size={16} color={colors.green} weight="bold" />
                <Typo size={12} color={colors.textGray} style={{ marginLeft: spacingX._8, flex: 1 }}>
                  Your card information is encrypted and secure
                </Typo>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <AppButton
                title="Cancel"
                onPress={() => setModalVisible(false)}
                variant="outline"
                style={{ flex: 1, marginRight: spacingX._10 }}
              />
              <AppButton
                title="Add Card"
                onPress={handleAddCard}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingX._20,
    paddingBottom: spacingY._15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray
  },
  content: {
    flex: 1,
    padding: spacingX._20
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacingX._15,
    borderRadius: radius._12,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    marginBottom: spacingY._20
  },
  methodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacingX._15,
    borderRadius: radius._12,
    marginBottom: spacingY._12,
    borderWidth: 1,
    borderColor: colors.lightGray
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacingX._12
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius._12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  defaultBadge: {
    backgroundColor: colors.green,
    paddingHorizontal: spacingX._8,
    paddingVertical: spacingY._3,
    borderRadius: radius._6
  },
  methodActions: {
    flexDirection: 'row',
    gap: spacingX._8
  },
  actionButton: {
    padding: spacingX._8
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacingY._50,
    paddingHorizontal: spacingX._30
  },
  addButtonContainer: {
    padding: spacingX._20,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._20,
    borderTopRightRadius: radius._20,
    padding: spacingX._20,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._20
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius._12,
    padding: spacingX._15,
    fontSize: 15,
    color: colors.dark,
    marginBottom: spacingY._12,
    borderWidth: 1,
    borderColor: colors.lightGray
  },
  row: {
    flexDirection: 'row'
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green + '10',
    padding: spacingX._12,
    borderRadius: radius._8,
    marginTop: spacingY._10
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: spacingY._20
  }
})

export default PaymentMethodsScreen
