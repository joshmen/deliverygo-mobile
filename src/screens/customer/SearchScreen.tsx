/**
 * Search Screen
 * Global search for restaurants and menu items with filters
 */

import React, { useState, useMemo } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import { useCustomerBrowseNavigation } from '../../hooks/useTypedNavigation'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import * as Icons from 'phosphor-react-native'

// Store and API
import { useUser } from '../../store/auth.store'
import apiClient from '../../services/api/client'
import { ENDPOINTS } from '../../config/constants'

// Template components
import { Typo, AppIcon, SearchBar, RestaurantCard, AppButton } from '../../components/common'

// Template theme
import colors from '../../theme/colors'
import { spacingX, spacingY, radius } from '../../theme/spacing'

// Store type (should match backend)
interface Store {
  id: string
  name: string
  description?: string
  address: string
  phone: string
  imageUrl?: string
  isOpen: boolean
  rating?: number
  deliveryTime?: string
  cuisineType?: string
  minimumOrder?: number
  deliveryFee?: number
  distance?: number
}

// Filter types
interface SearchFilters {
  category: string
  minPrice: number
  maxPrice: number
  minRating: number
  deliveryTime: number // max minutes
}

type SearchTab = 'restaurants' | 'items'

const SearchScreen: React.FC = () => {
  const navigation = useCustomerBrowseNavigation()
  const insets = useSafeAreaInsets()
  const user = useUser()

  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<SearchTab>('restaurants')
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'All',
    minPrice: 0,
    maxPrice: 100,
    minRating: 0,
    deliveryTime: 60
  })

  // Get tenantId from user
  const tenantId = user?.tenantId || '10000000-0000-0000-0000-000000000001'

  // Fetch stores using React Query
  const {
    data: stores,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['stores', tenantId],
    queryFn: async () => {
      const response = await apiClient.get<Store[]>(ENDPOINTS.customer.getStores, {
        params: { tenantId }
      })
      return response.data
    },
    staleTime: 30000
  })

  // Mock recent searches (TODO: persist in AsyncStorage)
  const recentSearches = ['Pizza', 'Burgers', 'Sushi', 'Thai Food']

  // Mock popular searches
  const popularSearches = ['Pizza', 'Burgers', 'Coffee', 'Breakfast', 'Desserts', 'Asian']

  // Mock categories for filter
  const categories = ['All', 'Pizza', 'Burgers', 'Sushi', 'Pasta', 'Desserts', 'Asian', 'Mexican']

  // Client-side filtering with useMemo for performance
  const filteredRestaurants = useMemo(() => {
    if (!search.trim() || !stores) return []

    let results = stores.filter(store =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      (store.cuisineType && store.cuisineType.toLowerCase().includes(search.toLowerCase())) ||
      (store.description && store.description.toLowerCase().includes(search.toLowerCase()))
    )

    // Apply filters
    if (filters.category !== 'All') {
      results = results.filter(store =>
        store.cuisineType?.toLowerCase() === filters.category.toLowerCase()
      )
    }

    if (filters.minRating > 0) {
      results = results.filter(store => (store.rating || 0) >= filters.minRating)
    }

    if (filters.deliveryTime < 60) {
      results = results.filter(store => {
        const time = parseInt(store.deliveryTime?.replace(/\D/g, '') || '0')
        return time <= filters.deliveryTime
      })
    }

    return results
  }, [search, stores, filters])

  const handleSearch = (text: string) => {
    setSearch(text)
  }

  const handleRecentSearchPress = (searchTerm: string) => {
    setSearch(searchTerm)
  }

  const handleApplyFilters = () => {
    setFiltersVisible(false)
    // Apply filters logic here
  }

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      minPrice: 0,
      maxPrice: 100,
      minRating: 0,
      deliveryTime: 60
    })
  }

  const activeFiltersCount = () => {
    let count = 0
    if (filters.category !== 'All') count++
    if (filters.minPrice > 0 || filters.maxPrice < 100) count++
    if (filters.minRating > 0) count++
    if (filters.deliveryTime < 60) count++
    return count
  }

  const renderRestaurant = ({ item, index }: { item: Store; index: number }) => (
    <RestaurantCard
      item={item}
      index={index}
      onPress={() => navigation.navigate('StoreDetails', { storeId: item.id, storeName: item.name })}
    />
  )

  const renderLoading = () => {
    if (!isLoading) return null
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Typo size={14} color={colors.textGray} style={{ marginTop: spacingY._12 }}>
          Loading restaurants...
        </Typo>
      </View>
    )
  }

  const renderEmptyState = () => {
    if (isLoading && search.trim()) {
      return renderLoading()
    }

    if (!search.trim()) {
      return (
        <ScrollView style={styles.emptyContainer} showsVerticalScrollIndicator={false}>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Typo size={16} weight="600">Recent Searches</Typo>
                <TouchableOpacity>
                  <Typo size={14} color={colors.primary} weight="600">Clear All</Typo>
                </TouchableOpacity>
              </View>
              <View style={styles.chipsContainer}>
                {recentSearches.map((term, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.chip}
                    onPress={() => handleRecentSearchPress(term)}
                  >
                    <Icons.ClockCounterClockwise size={16} color={colors.textGray} weight="bold" />
                    <Typo size={14} style={{ marginLeft: spacingX._8 }}>{term}</Typo>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Popular Searches */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Typo size={16} weight="600">Popular Searches</Typo>
            </View>
            <View style={styles.chipsContainer}>
              {popularSearches.map((term, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.chip, styles.popularChip]}
                  onPress={() => handleRecentSearchPress(term)}
                >
                  <Icons.TrendUp size={16} color={colors.primary} weight="bold" />
                  <Typo size={14} color={colors.primary} style={{ marginLeft: spacingX._8 }}>
                    {term}
                  </Typo>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Search Tips */}
          <View style={styles.section}>
            <View style={styles.tipsCard}>
              <Icons.Lightbulb size={24} color={colors.yellow} weight="fill" />
              <View style={{ marginLeft: spacingX._12, flex: 1 }}>
                <Typo size={15} weight="600" style={{ marginBottom: spacingY._6 }}>
                  Search Tips
                </Typo>
                <Typo size={13} color={colors.textGray}>
                  • Search by restaurant name or cuisine type{'\n'}
                  • Use filters to narrow down results{'\n'}
                  • Try popular searches for inspiration
                </Typo>
              </View>
            </View>
          </View>
        </ScrollView>
      )
    }

    return (
      <View style={styles.noResultsContainer}>
        <Icons.MagnifyingGlass size={64} color={colors.textGray} weight="thin" />
        <Typo size={18} weight="600" style={{ marginTop: spacingY._15 }}>
          No results found
        </Typo>
        <Typo size={14} color={colors.textGray} style={{ marginTop: spacingY._8, textAlign: 'center' }}>
          Try adjusting your search or filters{'\n'}to find what you're looking for
        </Typo>
      </View>
    )
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
        <View style={{ flex: 1, marginHorizontal: spacingX._12 }}>
          <SearchBar
            value={search}
            onChangeText={handleSearch}
            placeholder="Search restaurants or dishes..."
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFiltersVisible(true)}
        >
          <Icons.FunnelSimple size={20} color={colors.dark} weight="bold" />
          {activeFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Typo size={10} weight="700" color={colors.white}>
                {activeFiltersCount()}
              </Typo>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      {search.trim() ? (
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'restaurants' && styles.activeTab]}
            onPress={() => setActiveTab('restaurants')}
          >
            <Typo
              size={15}
              weight="600"
              color={activeTab === 'restaurants' ? colors.primary : colors.textGray}
            >
              Restaurants
            </Typo>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'items' && styles.activeTab]}
            onPress={() => setActiveTab('items')}
          >
            <Typo
              size={15}
              weight="600"
              color={activeTab === 'items' ? colors.primary : colors.textGray}
            >
              Menu Items
            </Typo>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Results */}
      <FlatList
        data={filteredRestaurants}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Filters Modal */}
      <Modal
        visible={filtersVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFiltersVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Typo size={18} weight="600">Filters</Typo>
              <TouchableOpacity onPress={() => setFiltersVisible(false)}>
                <Icons.X size={24} color={colors.dark} weight="bold" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Category Filter */}
              <View style={styles.filterSection}>
                <Typo size={15} weight="600" style={{ marginBottom: spacingY._12 }}>
                  Category
                </Typo>
                <View style={styles.categoryGrid}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        filters.category === cat && styles.categoryChipActive
                      ]}
                      onPress={() => setFilters({ ...filters, category: cat })}
                    >
                      <Typo
                        size={14}
                        weight="600"
                        color={filters.category === cat ? colors.white : colors.dark}
                      >
                        {cat}
                      </Typo>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price Range Filter */}
              <View style={styles.filterSection}>
                <Typo size={15} weight="600" style={{ marginBottom: spacingY._12 }}>
                  Price Range
                </Typo>
                <View style={styles.priceInputs}>
                  <View style={styles.priceInput}>
                    <Typo size={12} color={colors.textGray}>Min</Typo>
                    <TextInput
                      style={styles.priceValue}
                      value={`$${filters.minPrice}`}
                      keyboardType="number-pad"
                      editable={false}
                    />
                  </View>
                  <View style={styles.priceDivider} />
                  <View style={styles.priceInput}>
                    <Typo size={12} color={colors.textGray}>Max</Typo>
                    <TextInput
                      style={styles.priceValue}
                      value={`$${filters.maxPrice}`}
                      keyboardType="number-pad"
                      editable={false}
                    />
                  </View>
                </View>
              </View>

              {/* Rating Filter */}
              <View style={styles.filterSection}>
                <Typo size={15} weight="600" style={{ marginBottom: spacingY._12 }}>
                  Minimum Rating
                </Typo>
                <View style={styles.ratingOptions}>
                  {[0, 3, 4, 4.5].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      style={[
                        styles.ratingOption,
                        filters.minRating === rating && styles.ratingOptionActive
                      ]}
                      onPress={() => setFilters({ ...filters, minRating: rating })}
                    >
                      <Icons.Star
                        size={18}
                        color={filters.minRating === rating ? colors.white : colors.yellow}
                        weight="fill"
                      />
                      <Typo
                        size={14}
                        weight="600"
                        color={filters.minRating === rating ? colors.white : colors.dark}
                        style={{ marginLeft: spacingX._6 }}
                      >
                        {rating === 0 ? 'Any' : `${rating}+`}
                      </Typo>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Delivery Time Filter */}
              <View style={styles.filterSection}>
                <Typo size={15} weight="600" style={{ marginBottom: spacingY._12 }}>
                  Maximum Delivery Time
                </Typo>
                <View style={styles.timeOptions}>
                  {[60, 45, 30, 15].map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeOption,
                        filters.deliveryTime === time && styles.timeOptionActive
                      ]}
                      onPress={() => setFilters({ ...filters, deliveryTime: time })}
                    >
                      <Icons.Clock
                        size={18}
                        color={filters.deliveryTime === time ? colors.white : colors.primary}
                        weight="bold"
                      />
                      <Typo
                        size={14}
                        weight="600"
                        color={filters.deliveryTime === time ? colors.white : colors.dark}
                        style={{ marginLeft: spacingX._6 }}
                      >
                        {time} min
                      </Typo>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <AppButton
                title="Reset"
                onPress={handleResetFilters}
                variant="outline"
                style={{ flex: 1, marginRight: spacingX._10 }}
              />
              <AppButton
                title="Apply Filters"
                onPress={handleApplyFilters}
                style={{ flex: 2 }}
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: radius._20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: radius._9,
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray
  },
  tab: {
    flex: 1,
    paddingVertical: spacingY._15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  activeTab: {
    borderBottomColor: colors.primary
  },
  listContent: {
    padding: spacingX._15,
    paddingBottom: spacingY._30
  },
  emptyContainer: {
    flex: 1,
    padding: spacingX._20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacingY._50
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacingX._30
  },
  section: {
    marginBottom: spacingY._25
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._12
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingX._10
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._10,
    borderRadius: radius._20,
    borderWidth: 1,
    borderColor: colors.lightGray
  },
  popularChip: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary + '30'
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacingX._15,
    borderRadius: radius._12,
    borderWidth: 1,
    borderColor: colors.lightGray
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._25,
    borderTopRightRadius: radius._25,
    maxHeight: '85%',
    paddingTop: spacingY._20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacingX._20,
    paddingBottom: spacingY._15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray
  },
  filterSection: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingX._10
  },
  categoryChip: {
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._10,
    borderRadius: radius._20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.lightGray
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  priceInput: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacingX._15,
    borderRadius: radius._12,
    borderWidth: 1,
    borderColor: colors.lightGray
  },
  priceDivider: {
    width: 20,
    height: 2,
    backgroundColor: colors.lightGray,
    marginHorizontal: spacingX._10
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginTop: spacingY._6
  },
  ratingOptions: {
    flexDirection: 'row',
    gap: spacingX._10
  },
  ratingOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacingY._12,
    borderRadius: radius._12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.lightGray
  },
  ratingOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingX._10
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._12,
    borderRadius: radius._12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.lightGray
  },
  timeOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._15,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray
  }
})

export default SearchScreen
