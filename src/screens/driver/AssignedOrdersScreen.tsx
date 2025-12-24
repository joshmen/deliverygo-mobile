/**
 * Assigned Orders Screen (Driver)
 * View assigned deliveries
 */

import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../contexts/AuthContext'
import { useTenantConfig } from '../../contexts/TenantConfigContext'

const AssignedOrdersScreen: React.FC = () => {
  const navigation = useNavigation()
  const { user } = useAuth()
  const { getPrimaryColor, getAppName } = useTenantConfig()

  const primaryColor = getPrimaryColor()
  const appName = getAppName()

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.fullName}!</Text>
        <Text style={styles.subtitle}>{appName} - Driver</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Assigned Deliveries</Text>
        <Text style={styles.description}>
          This is a placeholder screen for assigned deliveries.
        </Text>
        <Text style={styles.description}>
          Here you will see:
        </Text>
        <View style={styles.featureList}>
          <Text style={styles.feature}>• Your assigned orders</Text>
          <Text style={styles.feature}>• Delivery addresses with map</Text>
          <Text style={styles.feature}>• Customer contact info</Text>
          <Text style={styles.feature}>• Status updates (On The Way, Delivered)</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: primaryColor }]}
          onPress={() => {
            // Navigate to delivery detail (placeholder)
            console.log('Navigate to delivery detail')
          }}
        >
          <Text style={styles.buttonText}>View Sample Delivery</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards (Placeholder) */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { borderLeftColor: primaryColor }]}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Active Deliveries</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: primaryColor }]}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Completed Today</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: '#666'
  },
  content: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 24
  },
  featureList: {
    marginTop: 12,
    marginBottom: 24
  },
  feature: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 24
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 14,
    color: '#666'
  }
})

export default AssignedOrdersScreen
