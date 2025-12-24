/**
 * Stores Screen (Customer) - Template Design
 * Browse all stores available in the tenant with modern UI
 */

import React, { useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native'
import { useCustomerBrowseNavigation } from '../../hooks/useTypedNavigation'
import { useQuery } from '@tanstack/react-query'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Icons from 'phosphor-react-native'
import { useUser } from '../../store/auth.store'
import apiClient from '../../services/api/client'
import { ENDPOINTS } from '../../config/constants'

// Template components
import { Typo, AppIcon, SearchBar, RestaurantCard } from '../../components/common'

// Template theme
import colors from '../../theme/colors'
import { spacingX, spacingY } from '../../theme/spacing'

// Store type (should match backend)
interface Store {
  id: string
  name: string
  description: string
  address: string
  phone: string
  imageUrl?: string
  isOpen: boolean
  rating?: number
  deliveryTime?: string
}

const StoresScreen: React.FC = () => {
  const navigation = useCustomerBrowseNavigation()
  const user = useUser()
  const [search, setSearch] = useState('')
  const insets = useSafeAreaInsets()

  // Get tenantId from user
  const tenantId = user?.tenantId || '10000000-0000-0000-0000-000000000001'

  // Fetch stores using React Query
  const {
    data: stores,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['stores', tenantId],
    queryFn: async () => {
      const response = await apiClient.get<Store[]>(ENDPOINTS.customer.getStores, {
        params: { tenantId }
      })
      return response.data
    },
    refetchInterval: 60000,
    staleTime: 30000
  })

  // Navigate to store details
  const handleStorePress = (storeId: string, storeName: string) => {
    navigation.navigate('StoreDetails', { storeId, storeName })
  }

  // Navigate to cart
  const handleCartPress = () => {
    navigation.navigate('Cart' as any)
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Typo style={styles.loadingText}>Loading stores...</Typo>
      </View>
    )
  }

  // Error state
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Icons.WarningCircle size={64} color={colors.red} weight="thin" />
        <Typo size={18} weight="600" style={styles.errorText}>
          Failed to load stores
        </Typo>
        <Typo size={14} color={colors.textGray} style={styles.errorDetail}>
          {(error as Error).message}
        </Typo>
      </View>
    )
  }

  // Main content
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacingY._15 }]}>
        <View style={{ flex: 1, gap: spacingX._3 }}>
          <Typo size={11} style={styles.headerText}>
            DELIVER TO
          </Typo>
          <Typo size={13} weight="600">
            {user?.fullName || 'Customer'}
          </Typo>
        </View>
        <AppIcon
          icon={Icons.ShoppingBagOpen}
          containerStyle={{ backgroundColor: colors.dark }}
          iconColor={colors.white}
          iconWeight="regular"
          onPress={handleCartPress}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.nameRow}>
          <Typo>Hey {user?.fullName?.split(' ')[0] || 'there'},</Typo>
          <Typo weight="600"> Good Day!</Typo>
        </View>

        {/* Search Bar */}
        <View style={{ paddingHorizontal: spacingX._20 }}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search for restaurants..."
          />
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Typo size={20} weight="600">
            All Restaurants
          </Typo>
          <Typo size={14} color={colors.textGray}>
            {stores?.length || 0} restaurants
          </Typo>
        </View>

        {/* Stores List */}
        {!stores || stores.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icons.Storefront size={64} color={colors.textGray} weight="thin" />
            <Typo size={18} weight="600" style={{ marginTop: spacingY._15 }}>
              No stores available
            </Typo>
            <Typo size={14} color={colors.textGray} style={{ marginTop: spacingY._8 }}>
              Check back later for new stores
            </Typo>
          </View>
        ) : (
          <FlatList
            data={stores}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item, index }) => (
              <RestaurantCard
                item={item}
                index={index}
                onPress={() => handleStorePress(item.id, item.name)}
              />
            )}
            scrollEnabled={false}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={refetch}
                tintColor={colors.primary}
              />
            }
          />
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacingX._20,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingX._20,
    paddingBottom: spacingY._15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerText: {
    color: colors.textGray,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  nameRow: {
    flexDirection: 'row',
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._20,
  },
  sectionHeader: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._20,
    paddingBottom: spacingY._15,
  },
  listContent: {
    paddingHorizontal: spacingX._20,
    gap: spacingY._20,
    paddingBottom: spacingY._30,
  },
  loadingText: {
    marginTop: spacingY._12,
    color: colors.textGray,
  },
  errorText: {
    color: colors.red,
    marginTop: spacingY._15,
    marginBottom: spacingY._8,
  },
  errorDetail: {
    textAlign: 'center',
    marginBottom: spacingY._20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacingY._30,
  },
})

export default StoresScreen
