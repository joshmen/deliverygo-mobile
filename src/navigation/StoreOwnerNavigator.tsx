/**
 * Store Owner Navigator
 * Bottom tab navigation for Store Owner
 */

import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { StoreOwnerStackParamList } from "../types";
import OrdersHomeScreen from "../screens/store-owner/OrdersHomeScreen";
import StoreSettingsScreen from "../screens/store-owner/StoreSettingsScreen";
import ProfileScreen from "../screens/shared/ProfileScreen";
import { useTenantConfig } from "../contexts/TenantConfigContext";

const Tab = createBottomTabNavigator<StoreOwnerStackParamList>();

const StoreOwnerNavigator: React.FC = () => {
  const { getPrimaryColor } = useTenantConfig();
  const primaryColor = getPrimaryColor();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          borderBottomWidth: Platform.OS === "ios" ? 18 : 15,
          borderBottomColor: "#000000",
          paddingBottom: Math.max(insets.bottom, 5),
          paddingTop: 8,
          height: (Platform.OS === "ios" ? 60 : 70) + insets.bottom,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: Platform.OS === "ios" ? -20 : 4,
        },
      }}
    >
      <Tab.Screen
        name="OrdersHome"
        component={OrdersHomeScreen}
        options={{
          tabBarLabel: "Orders",
          tabBarIcon: ({ color }) => (
            <Ionicons name="receipt-outline" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StoreSettings"
        component={StoreSettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={30} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default StoreOwnerNavigator;
