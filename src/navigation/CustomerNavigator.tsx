import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeScreen from "../screens/customer/HomeScreen";
import StoresScreen from "../screens/customer/StoresScreen";
import StoreDetailsScreen from "../screens/customer/StoreDetailsScreen";
import CartScreen from "../screens/customer/CartScreen";
import OrdersScreen from "../screens/customer/OrdersScreen";
import OrderDetailsScreen from "../screens/customer/OrderDetailsScreen";
import ProfileScreen from "../screens/shared/ProfileScreen";
import CategoriesScreen from "../screens/customer/CategoriesScreen";
import SearchScreen from "../screens/customer/SearchScreen";
import PaymentMethodsScreen from "../screens/customer/PaymentMethodsScreen";
import AddressManagementScreen from "../screens/customer/AddressManagementScreen";
import PaymentSuccessScreen from "../screens/customer/PaymentSuccessScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Browse Stack Navigator (Home -> Stores -> StoreDetails -> Categories -> Search)
const BrowseStack = () => {
  const primaryColor = "#FF6B35";

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: primaryColor,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Stores"
        component={StoresScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StoreDetails"
        component={StoreDetailsScreen}
        options={({ route }: any) => ({
          title: route.params?.storeName || "Store Menu",
        })}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentMethods"
        component={PaymentMethodsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressManagement"
        component={AddressManagementScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Orders Stack Navigator (Orders -> OrderDetails)
const OrdersStack = () => {
  const primaryColor = "#FF6B35";

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: primaryColor,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="OrdersList"
        component={OrdersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ title: "Order Details" }}
      />
    </Stack.Navigator>
  );
};

/**
 * Customer Navigator - Bottom tab navigation for Customer role
 *
 * Tabs:
 * 1. Browse - View stores and browse products/menu
 * 2. Cart - Shopping cart with checkout
 * 3. Orders - Track orders and view history
 * 4. Profile - Customer profile, addresses, payment methods
 *
 * Features:
 * - Browse stores by tenant
 * - View product catalog with categories
 * - Add items to cart with customization notes
 * - Checkout with delivery address
 * - Real-time order tracking
 * - Order history
 * - Saved delivery addresses
 * - Payment method management
 *
 * Backend Endpoints Used:
 * - GET /api/customer/stores?tenantId={id}
 * - GET /api/customer/products/{storeId}
 * - POST /api/customer/cart/checkout
 * - GET /api/customer/orders?customerId={id}
 * - GET /api/customer/orders/{orderId}
 */
const CustomerNavigator = () => {
  // TODO: Uncomment when tenant store is implemented
  // import { useTenantStore } from '../store/tenant.store'
  // const primaryColor = useTenantStore((state) => state.config?.branding.primaryColor || '#FF6B35')

  const primaryColor = "#FF6B35"; // Default orange/red color for customers
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Configure tab bar icons
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          switch (route.name) {
            case "Browse":
              iconName = focused ? "storefront" : "storefront-outline";
              break;
            case "Cart":
              iconName = focused ? "cart" : "cart-outline";
              break;
            case "Orders":
              iconName = focused ? "receipt" : "receipt-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return <Ionicons name={iconName} size={30} color={color} />;
        },

        // Tab bar styling
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          paddingBottom: Math.max(insets.bottom, 5),
          paddingTop: 8,
          height: (Platform.OS === "ios" ? 60 : 70) + insets.bottom,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          borderBottomWidth: Platform.OS === "ios" ? 18 : 15,
          borderBottomColor: "#000000",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: Platform.OS === "ios" ? -20 : 4,
        },

        // Header styling
        headerStyle: {
          backgroundColor: primaryColor,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
      })}
    >
      {/* Browse Tab - Main store/product browsing */}
      <Tab.Screen
        name="Browse"
        component={BrowseStack}
        options={{
          title: "Browse",
          headerShown: false,
        }}
      />

      {/* Cart Tab - Shopping cart */}
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: "Cart",
          headerTitle: "My Cart",
          tabBarBadge: undefined, // TODO: Add badge count for items in cart
        }}
      />

      {/* Orders Tab - Order tracking and history */}
      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={{
          title: "Orders",
          headerShown: false,
        }}
      />

      {/* Profile Tab - Customer profile and settings */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          headerTitle: "My Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default CustomerNavigator;
