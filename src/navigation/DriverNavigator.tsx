/**
 * Driver Navigator
 * Bottom tab navigation for Driver
 */

import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { DriverStackParamList } from "../types";
import DeliveriesScreen from "../screens/driver/DeliveriesScreen";
import MapScreen from "../screens/driver/MapScreen";
import HistoryScreen from "../screens/driver/HistoryScreen";
import ProfileScreen from "../screens/shared/ProfileScreen";
import { useTenantConfig } from "../contexts/TenantConfigContext";

const Tab = createBottomTabNavigator<DriverStackParamList>();

const DriverNavigator: React.FC = () => {
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
        name="Deliveries"
        component={DeliveriesScreen}
        options={{
          tabBarLabel: "Deliveries",
          tabBarIcon: ({ color }) => (
            <Ionicons name="bicycle-outline" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: "Map",
          tabBarIcon: ({ color }) => (
            <Ionicons name="map-outline" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color }) => (
            <Ionicons name="time-outline" size={30} color={color} />
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

export default DriverNavigator;
