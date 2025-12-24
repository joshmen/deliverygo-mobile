/**
 * Onboarding Screen (Simplified - Without Reanimated)
 * Welcome slides with indicators
 * Adapted from template for Expo Go compatibility
 */

import React, { useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Text,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Icons from 'phosphor-react-native'

// Components
import AppButton from '../../components/common/AppButton'
import ScreenComponent from '../../components/common/ScreenComponent'
import Typo from '../../components/common/Typo'

// Theme
import colors from '../../theme/colors'
import { radius, spacingX, spacingY } from '../../theme/spacing'
import { normalizeX, normalizeY } from '../../utils/normalize'

const { width, height } = Dimensions.get('window')

interface DataItem {
  title: string
  body: string
  icon: any
}

const data: DataItem[] = [
  {
    title: 'All your favorites',
    body: 'Get all your loved foods in one place, you just place the order we do the rest',
    icon: Icons.ForkKnife,
  },
  {
    title: 'Order from chosen chef',
    body: 'Order from your favorite restaurants and get fast delivery to your doorstep',
    icon: Icons.ChefHat,
  },
  {
    title: 'Free delivery offers',
    body: 'Get special offers and free delivery on your orders, enjoy amazing deals',
    icon: Icons.Motorcycle,
  },
]

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation()
  const [active, setActive] = useState(0)
  const flatListRef = useRef<FlatList<DataItem>>(null)

  const handleChange = () => {
    const nextIndex = active + 1
    if (active === data.length - 1) {
      navigation.navigate('Login' as never)
      return
    }

    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true })
    }
    setActive(nextIndex)
  }

  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width)
    setActive(newIndex)
  }

  return (
    <ScreenComponent style={{ flex: 1 }}>
      <FlatList
        data={data}
        ref={flatListRef}
        horizontal
        pagingEnabled
        onMomentumScrollEnd={onMomentumScrollEnd}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          const IconComponent = item.icon
          return (
            <View style={styles.itemView}>
              <View style={styles.iconContainer}>
                <IconComponent size={normalizeY(120)} color={colors.primary} weight="thin" />
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
            </View>
          )
        }}
      />
      <View style={{ height: height * 0.25 }}>
        <Indicator activeIndex={active} data={data} />
        <AppButton
          title={active === data.length - 1 ? 'GET STARTED' : 'NEXT'}
          style={{ width: '90%' }}
          onPress={handleChange}
        />
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('Login' as never)}
        >
          <Typo style={styles.skip}>Skip</Typo>
        </TouchableOpacity>
      </View>
    </ScreenComponent>
  )
}

interface IndicatorProps {
  activeIndex: number
  data: DataItem[]
}

const Indicator: React.FC<IndicatorProps> = ({ activeIndex, data }) => {
  const indicatorSize = normalizeX(8)

  return (
    <View style={styles.indicatorContainer}>
      {data.map((_, i) => {
        const isActive = i === activeIndex
        return (
          <View
            key={`indicator-${i}`}
            style={{
              width: indicatorSize,
              height: indicatorSize,
              borderRadius: radius._10,
              margin: spacingX._4,
              opacity: isActive ? 1 : 0.6,
              backgroundColor: isActive ? colors.primary : colors.lightGray,
            }}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  itemView: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: width,
    height: height * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacingY._10,
    fontSize: normalizeY(22),
    color: colors.dark,
  },
  body: {
    width: '90%',
    textAlign: 'center',
    lineHeight: spacingY._20,
    color: colors.textGray,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    zIndex: 1,
    marginBottom: '15%',
  },
  skipButton: {
    alignSelf: 'center',
    padding: spacingY._5,
    marginTop: spacingY._10,
  },
  skip: {
    fontWeight: '500',
    color: colors.textGray,
  },
})

export default OnboardingScreen
