/**
 * Store Settings Screen (Store Owner)
 * Manage store configuration and menu - Placeholder for future implementation
 */

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { usePrimaryColor } from '../../store/tenant.store'

const StoreSettingsScreen: React.FC = () => {
  const primaryColor = usePrimaryColor()

  return (
    <View style={styles.container}>
      <Ionicons name="settings-outline" size={80} color={primaryColor} />
      <Text style={styles.title}>Store Settings</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
      <Text style={styles.description}>
        Manage your store configuration,{'\n'}
        menu items, and business hours
      </Text>

      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Ionicons name="storefront-outline" size={24} color={primaryColor} />
          <Text style={styles.featureText}>Store information</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="restaurant-outline" size={24} color={primaryColor} />
          <Text style={styles.featureText}>Menu management</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="time-outline" size={24} color={primaryColor} />
          <Text style={styles.featureText}>Business hours</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="pricetag-outline" size={24} color={primaryColor} />
          <Text style={styles.featureText}>Product pricing</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F2F2F7'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 16
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 300
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1
  }
})

export default StoreSettingsScreen
