import { useState, useEffect, useRef } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, Alert,
  Switch, Platform,
} from 'react-native'
import * as Location from 'expo-location'
import * as Notifications from 'expo-notifications'
import { colors } from '../../../shared/colors'
import { getToken } from '../../../shared/api'

const API_BASE = __DEV__
  ? 'http://192.168.0.100:6868/api'
  : 'https://taxi-mouine.de/api'

const statusLabels = {
  pending: 'Ausstehend',
  accepted: 'Angenommen',
  arrived: 'Vor Ort',
  in_progress: 'In Fahrt',
}

export default function DriverHomeScreen({ navigation }) {
  const [isOnline, setIsOnline] = useState(false)
  const [rides, setRides] = useState([])
  const [activeRide, setActiveRide] = useState(null)
  const [loading, setLoading] = useState(false)
  const socketRef = useRef(null)
  const locationWatcherRef = useRef(null)

  async function fetchPendingRides() {
    try {
      const res = await fetch(`${API_BASE}/driver/rides/pending`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const data = await res.json()
      if (data.success) {
        setRides(data.rides.filter(r => r.status === 'pending'))
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function fetchActiveRides() {
    try {
      const res = await fetch(`${API_BASE}/driver/rides/upcoming`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const data = await res.json()
      if (data.success) {
        const active = data.rides.find(r =>
          ['accepted', 'arrived', 'in_progress'].includes(r.status)
        )
        setActiveRide(active || null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function toggleOnline(value) {
    setIsOnline(value)
    try {
      await fetch(`${API_BASE}/driver/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ isOnline: value }),
      })
    } catch (err) {
      console.error(err)
    }

    if (value) {
      startLocationTracking()
      connectSocket()
    } else {
      stopLocationTracking()
      disconnectSocket()
    }
  }

  async function startLocationTracking() {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') return

    locationWatcherRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 50,
      },
      (loc) => {
        if (socketRef.current?.connected) {
          socketRef.current.emit('driver:location_update', {
            rideId: activeRide?._id,
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            heading: loc.coords.heading,
          })
        }
      }
    )
  }

  function stopLocationTracking() {
    if (locationWatcherRef.current) {
      locationWatcherRef.current.remove()
      locationWatcherRef.current = null
    }
  }

  async function connectSocket() {
    try {
      const { io } = await import('../../../shared/socket')
      socketRef.current = io

      socketRef.current.on('driver:new_booking', (data) => {
        setRides(prev => [data.ride, ...prev])
        Alert.alert('Neue Fahrt!', `${data.ride.pickup.address} → ${data.ride.dropoff.address}`)
      })
    } catch (err) {
      console.error('Socket connection failed:', err)
    }
  }

  function disconnectSocket() {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
  }

  useEffect(() => {
    fetchPendingRides()
    fetchActiveRides()
    const interval = setInterval(() => {
      fetchPendingRides()
      fetchActiveRides()
    }, 10000)
    return () => {
      clearInterval(interval)
      stopLocationTracking()
      disconnectSocket()
    }
  }, [])

  async function handleAccept(rideId) {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/driver/rides/${rideId}/accept`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const data = await res.json()
      if (data.success) {
        setActiveRide(data.ride)
        setRides(prev => prev.filter(r => r._id !== rideId))
        Alert.alert('Fahrt angenommen!', 'Sie können jetzt den Kunden abholen.')
      }
    } catch (err) {
      Alert.alert('Fehler', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusRow}>
          <Text style={styles.title}>Taxi Mouine</Text>
          <View style={styles.onlineToggle}>
            <Text style={[styles.onlineText, isOnline && styles.onlineActive]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={toggleOnline}
              trackColor={{ false: '#D1D5DB', true: colors.green }}
              thumbColor={colors.white}
            />
          </View>
        </View>
      </View>

      {activeRide && (
        <TouchableOpacity
          style={styles.activeRideCard}
          onPress={() => navigation.navigate('RideDetail', { ride: activeRide })}
        >
          <Text style={styles.activeLabel}>AKTIVE FAHRT</Text>
          <Text style={styles.activeAddress}>
            {activeRide.pickup.address || `${activeRide.pickup.lat.toFixed(4)}, ${activeRide.pickup.lng.toFixed(4)}`}
          </Text>
          <Text style={styles.activeArrow}>↓</Text>
          <Text style={styles.activeAddress}>
            {activeRide.dropoff.address || `${activeRide.dropoff.lat.toFixed(4)}, ${activeRide.dropoff.lng.toFixed(4)}`}
          </Text>
          {activeRide.estimatedFare > 0 && (
            <Text style={styles.activeFare}>€{activeRide.estimatedFare.toFixed(2)}</Text>
          )}
          <Text style={styles.tapHint}>Zum Verwalten tippen →</Text>
        </TouchableOpacity>
      )}

      {isOnline && rides.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ausstehende Fahrten ({rides.length})</Text>
          <FlatList
            data={rides}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.rideCard}>
                <View style={styles.rideInfo}>
                  <Text style={styles.rideAddress} numberOfLines={1}>
                    📍 {item.pickup.address || `${item.pickup.lat.toFixed(4)}, ${item.pickup.lng.toFixed(4)}`}
                  </Text>
                  <Text style={styles.rideAddress} numberOfLines={1}>
                    🎯 {item.dropoff.address || `${item.dropoff.lat.toFixed(4)}, ${item.dropoff.lng.toFixed(4)}`}
                  </Text>
                  {item.estimatedFare > 0 && (
                    <Text style={styles.rideFare}>€{item.estimatedFare.toFixed(2)}</Text>
                  )}
                  {item.customer?.name && (
                    <Text style={styles.customerName}>Kunde: {item.customer.name}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={[styles.acceptButton, loading && styles.buttonDisabled]}
                  onPress={() => handleAccept(item._id)}
                  disabled={loading}
                >
                  <Text style={styles.acceptText}>Annehmen</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      {isOnline && rides.length === 0 && !activeRide && (
        <View style={styles.waiting}>
          <Text style={styles.waitingEmoji}>🕐</Text>
          <Text style={styles.waitingText}>Warten auf Fahrten...</Text>
          <Text style={styles.waitingSubtext}>
            Sie werden benachrichtigt, wenn eine Buchung eingeht
          </Text>
        </View>
      )}

      {!isOnline && (
        <View style={styles.waiting}>
          <Text style={styles.waitingEmoji}>⛔</Text>
          <Text style={styles.waitingText}>Sie sind offline</Text>
          <Text style={styles.waitingSubtext}>
            Schalten Sie auf Online, um Fahrten zu erhalten
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.footerText}>Verlauf & Einnahmen</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.black },
  onlineToggle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  onlineText: { fontSize: 14, color: '#92400E', fontWeight: '600' },
  onlineActive: { color: colors.green },
  activeRideCard: {
    backgroundColor: colors.blue,
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 4,
  },
  activeLabel: { color: '#93C5FD', fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  activeAddress: { color: '#fff', fontSize: 14, fontWeight: '500' },
  activeArrow: { color: '#93C5FD', textAlign: 'center', fontSize: 16, marginVertical: 4 },
  activeFare: { color: '#FDE047', fontSize: 20, fontWeight: 'bold', marginTop: 8 },
  tapHint: { color: '#93C5FD', fontSize: 12, marginTop: 8, textAlign: 'right' },
  section: { flex: 1, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 12, color: colors.black },
  rideCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  rideInfo: { flex: 1 },
  rideAddress: { fontSize: 13, color: colors.black, marginBottom: 2 },
  rideFare: { fontSize: 15, fontWeight: 'bold', color: colors.primaryDark, marginTop: 4 },
  customerName: { fontSize: 12, color: colors.gray, marginTop: 2 },
  acceptButton: {
    backgroundColor: colors.green,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 12,
  },
  buttonDisabled: { opacity: 0.5 },
  acceptText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  waiting: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  waitingEmoji: { fontSize: 48, marginBottom: 12 },
  waitingText: { fontSize: 18, fontWeight: 'bold', color: colors.black },
  waitingSubtext: { fontSize: 14, color: colors.gray, textAlign: 'center', marginTop: 4 },
  footer: { padding: 16 },
  footerButton: { alignItems: 'center', padding: 12 },
  footerText: { color: colors.primaryDark, fontWeight: '600', fontSize: 14 },
})
