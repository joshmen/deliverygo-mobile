/**
 * Home Screen (Customer)
 * Main dashboard with categories and featured restaurants
 * Adapted from template for API integration
 */

import React, { useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useCustomerBrowseNavigation } from '../../hooks/useTypedNavigation'
import { useQuery } from '@tanstack/react-query'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Icons from 'phosphor-react-native'
import { useUser } from '../../store/auth.store'
import apiClient from '../../services/api/client'
import { ENDPOINTS } from '../../config/constants'

// Components
import { Typo, AppIcon, SearchBar, RestaurantCard, ScreenComponent } from '../../components/common'

// Theme
import colors from '../../theme/colors'
import { spacingX, spacingY } from '../../theme/spacing'

// Store type
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

// Category type (for future implementation)
interface Category {
  id: string
  name: string
  icon: string
}

const HomeScreen: React.FC = () => {
  const navigation = useCustomerBrowseNavigation()
  const user = useUser()
  const [search, setSearch] = useState('')
  const insets = useSafeAreaInsets()

  // Get tenantId from user
  const tenantId = user?.tenantId || '10000000-0000-0000-0000-000000000001'

  // Fetch stores
  const {
    data: stores,
    isLoading,
    isError,
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

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  // Navigate to cart
  const handleCartPress = () => {
    navigation.navigate('Cart' as any)
  }

  // Navigate to store details
  const handleStorePress = (storeId: string, storeName: string) => {
    navigation.navigate('StoreDetails', { storeId, storeName })
  }

  // Navigate to all stores
  const handleSeeAllStores = () => {
    navigation.navigate('Stores', {})
  }

  return (
    <ScreenComponent>
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
          <Typo weight="600"> {getGreeting()}!</Typo>
        </View>

        {/* Search Bar */}
        <View style={{ paddingHorizontal: spacingX._20 }}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search for restaurants or food..."
            editable={false}
            onPress={() => {
              // Navigate to search screen when implemented
              navigation.navigate('Stores' as never)
            }}
          />
        </View>

        <View style={{ height: spacingY._20 }} />

        {/* Categories Section - Coming Soon */}
        <SeeRow
          title="Categories"
          onPress={() => {
            // Navigate to categories screen when implemented
          }}
          showSeeAll={false}
        />
        <View style={styles.categoriesPlaceholder}>
          <Icons.GridFour size={40} color={colors.textGray} weight="thin" />
          <Typo size={14} color={colors.textGray} style={{ marginTop: spacingY._10 }}>
            Categories coming soon
          </Typo>
        </View>

        {/* Featured Restaurants */}
        <SeeRow
          title="Featured Restaurants"
          onPress={handleSeeAllStores}
        />

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Typo style={{ marginTop: spacingY._12, color: colors.textGray }}>
              Loading restaurants...
            </Typo>
          </View>
        ) : isError ? (
          <View style={styles.centerContainer}>
            <Icons.WarningCircle size={48} color={colors.red} weight="thin" />
            <Typo size={16} weight="600" style={{ marginTop: spacingY._15, color: colors.red }}>
              Failed to load restaurants
            </Typo>
          </View>
        ) : !stores || stores.length === 0 ? (
          <View style={styles.centerContainer}>
            <Icons.Storefront size={64} color={colors.textGray} weight="thin" />
            <Typo size={16} weight="600" style={{ marginTop: spacingY._15 }}>
              No restaurants available
            </Typo>
          </View>
        ) : (
          <FlatList
            data={stores.slice(0, 5)} // Show only first 5 as featured
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
          />
        )}
      </ScrollView>
    </ScreenComponent>
  )
}

// See All Row Component
const SeeRow = ({
  title,
  onPress,
  showSeeAll = true
}: {
  title: string
  onPress: () => void
  showSeeAll?: boolean
}) => {
  return (
    <View style={styles.seeAllRow}>
      <Typo size={18} weight="600">
        {title}
      </Typo>
      <View style={{ flex: 1 }} />
      {showSeeAll && (
        <TouchableOpacity style={styles.viewAllButton} onPress={onPress}>
          <Typo size={14} color={colors.primary}>
            See All
          </Typo>
          <Icons.CaretRight size={20} color={colors.primary} weight="bold" />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
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
  seeAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacingX._20,
    marginBottom: spacingY._15,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._5,
  },
  categoriesPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacingY._30,
    marginHorizontal: spacingX._20,
    marginBottom: spacingY._20,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderStyle: 'dashed',
  },
  listContent: {
    paddingHorizontal: spacingX._20,
    gap: spacingY._20,
    paddingBottom: spacingY._30,
  },
  centerContainer: {
    alignItems: 'center',
    paddingVertical: spacingY._30,
  },
})

export default HomeScreen
