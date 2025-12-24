/**
 * Profile Screen (Shared across all roles)
 * View profile info and account settings with template UI
 */

import React from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Icons from 'phosphor-react-native'
import { useAuth } from '../../contexts/AuthContext'
import { useTenantConfig } from '../../contexts/TenantConfigContext'

// Template components
import { Typo } from '../../components/common'

// Template theme
import colors from '../../theme/colors'
import { spacingX, spacingY, radius } from '../../theme/spacing'

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { user, logout } = useAuth()
  const { getPrimaryColor } = useTenantConfig()
  const primaryColor = getPrimaryColor()

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout()
              // Navigation will be handled automatically by AppNavigator
            } catch (error) {
              console.error('Logout error:', error)
              Alert.alert('Error', 'Failed to logout. Please try again.')
            }
          }
        }
      ]
    )
  }

  const handleEditProfile = () => {
    Alert.alert('Coming Soon', 'Personal Info editing feature is under development')
  }

  const handleMyOrders = () => {
    // Navigate to Orders tab
    navigation.navigate('Orders' as never)
  }

  const handleAddresses = () => {
    // Navigate to AddressManagement screen
    navigation.navigate('AddressManagement' as never)
  }

  const handlePaymentMethods = () => {
    navigation.navigate('PaymentMethods' as never)
  }

  const handleSettings = () => {
    Alert.alert('Coming Soon', 'Settings feature is under development')
  }

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.fullName) return 'U'
    const names = user.fullName.split(' ')
    if (names.length === 1) return names[0].charAt(0).toUpperCase()
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={primaryColor} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={[styles.header, { backgroundColor: primaryColor, paddingTop: insets.top + spacingY._20 }]}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Typo size={32} weight="700" color={primaryColor}>
                {getInitials()}
              </Typo>
            </View>
          </View>
          <Typo size={24} weight="700" color={colors.white} style={{ marginBottom: spacingY._4 }}>
            {user?.fullName || 'User'}
          </Typo>
          <Typo size={15} color={colors.white} style={{ opacity: 0.9, marginBottom: spacingY._12 }}>
            {user?.email || ''}
          </Typo>
          <View style={styles.roleBadge}>
            <Typo size={13} weight="600" color={colors.white}>
              {user?.role || 'User'}
            </Typo>
          </View>
        </View>

        {/* Customer-specific Menu Items */}
        {user?.role === 'Customer' && (
          <View style={styles.section}>
            <Typo size={12} weight="600" color={colors.textGray} style={{ paddingHorizontal: spacingX._16, marginBottom: spacingY._10 }}>
              ACCOUNT
            </Typo>

            <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
              <View style={styles.menuItemLeft}>
                <Icons.User size={22} color={colors.primary} weight="bold" />
                <Typo size={15} style={{ marginLeft: spacingX._15 }}>
                  Personal Information
                </Typo>
              </View>
              <Icons.CaretRight size={20} color={colors.textGray} weight="bold" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleMyOrders}>
              <View style={styles.menuItemLeft}>
                <Icons.Receipt size={22} color={colors.primary} weight="bold" />
                <Typo size={15} style={{ marginLeft: spacingX._15 }}>
                  My Orders
                </Typo>
              </View>
              <Icons.CaretRight size={20} color={colors.textGray} weight="bold" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleAddresses}>
              <View style={styles.menuItemLeft}>
                <Icons.MapPin size={22} color={colors.primary} weight="bold" />
                <Typo size={15} style={{ marginLeft: spacingX._15 }}>
                  Delivery Addresses
                </Typo>
              </View>
              <Icons.CaretRight size={20} color={colors.textGray} weight="bold" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={handlePaymentMethods}>
              <View style={styles.menuItemLeft}>
                <Icons.CreditCard size={22} color={colors.primary} weight="bold" />
                <Typo size={15} style={{ marginLeft: spacingX._15 }}>
                  Payment Methods
                </Typo>
              </View>
              <Icons.CaretRight size={20} color={colors.textGray} weight="bold" />
            </TouchableOpacity>
          </View>
        )}

        {/* General Menu Items */}
        <View style={styles.section}>
          <Typo size={12} weight="600" color={colors.textGray} style={{ paddingHorizontal: spacingX._16, marginBottom: spacingY._10 }}>
            SETTINGS
          </Typo>

          <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
            <View style={styles.menuItemLeft}>
              <Icons.Gear size={22} color={colors.primary} weight="bold" />
              <Typo size={15} style={{ marginLeft: spacingX._15 }}>
                Settings
              </Typo>
            </View>
            <Icons.CaretRight size={20} color={colors.textGray} weight="bold" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icons.Question size={22} color={colors.primary} weight="bold" />
              <Typo size={15} style={{ marginLeft: spacingX._15 }}>
                Help & Support
              </Typo>
            </View>
            <Icons.CaretRight size={20} color={colors.textGray} weight="bold" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icons.FileText size={22} color={colors.primary} weight="bold" />
              <Typo size={15} style={{ marginLeft: spacingX._15 }}>
                Terms & Privacy
              </Typo>
            </View>
            <Icons.CaretRight size={20} color={colors.textGray} weight="bold" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Typo size={15} color={colors.textGray}>
              App Version
            </Typo>
            <Typo size={15} weight="500">
              1.0.0
            </Typo>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icons.SignOut size={22} color={colors.red} weight="bold" />
            <Typo size={16} weight="600" color={colors.red} style={{ marginLeft: spacingX._10 }}>
              Logout
            </Typo>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    alignItems: 'center',
    paddingBottom: spacingY._25,
    borderBottomLeftRadius: radius._24,
    borderBottomRightRadius: radius._24
  },
  avatarContainer: {
    marginBottom: spacingY._15
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: radius._50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._6,
    borderRadius: radius._20,
    borderWidth: 1,
    borderColor: colors.white
  },
  section: {
    backgroundColor: colors.white,
    marginTop: spacingY._15,
    paddingTop: spacingY._15
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacingY._15,
    paddingHorizontal: spacingX._16
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginHorizontal: spacingX._16
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacingY._15,
    paddingHorizontal: spacingX._16
  },
  logoutSection: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._20,
    paddingBottom: spacingY._30
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacingY._15,
    borderWidth: 2,
    borderColor: colors.red,
    borderRadius: radius._12,
    backgroundColor: colors.white
  }
})

export default ProfileScreen
