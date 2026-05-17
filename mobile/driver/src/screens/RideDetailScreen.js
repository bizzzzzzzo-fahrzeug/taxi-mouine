import { useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, Linking, Platform,
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { colors } from '../../../shared/colors'
import { getToken } from '../../../shared/api'

const API_BASE = __DEV__
  ? 'http://192.168.0.100:6868/api'
  : 'https://taxi-mouine.de/api'

const statusActions = {
  accepted: 'arrived',
  arrived: 'in_progress',
  in_progress: 'completed',
}

const statusButtonLabels = {
  accepted: 'Ich bin da (Angekommen)',
  arrived: 'Fahrt starten',
  in_progress: 'Fahrt abschließen',
}

const statusLabels = {
  pending: 'Ausstehend',
  accepted: 'Angenommen',
  arrived: 'Vor Ort',
  in_progress: 'In Fahrt',
  completed: 'Abgeschlossen',
  cancelled: 'Storniert',
}

export default function RideDetailScreen({ route, navigation }) {
  const { ride: initialRide } = route.params
  const [ride, setRide] = useState(initialRide)
  const [loading, setLoading] = useState(false)

  async function updateStatus(newStatus) {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/rides/${ride._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setRide(data.ride)
        if (newStatus === 'completed') {
          Alert.alert('Fahrt abgeschlossen!', `€${data.ride.actualFare || data.ride.estimatedFare.toFixed(2)}`)
          navigation.goBack()
        }
      }
    } catch (err) {
      Alert.alert('Fehler', err.message)
    } finally {
      setLoading(false)
    }
  }

  function openNavigation() {
    const dest = `${ride.dropoff.lat},${ride.dropoff.lng}`
    const url = Platform.OS === 'ios'
      ? `maps://app?daddr=${dest}`
      : `geo:${dest}?q=${dest}`
    Linking.openURL(url)
  }

  function callCustomer() {
    if (ride.customer?.phone) {
      Linking.openURL(`tel:${ride.customer.phone}`)
    }
  }

  function whatsappCustomer() {
    if (ride.customer?.phone) {
      Linking.openURL(`https://wa.me/${ride.customer.phone.replace(/[^0-9]/g, '')}`)
    }
  }

  const nextAction = statusActions[ride.status]

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: ride.pickup.lat,
          longitude: ride.pickup.lng,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
      >
        <Marker
          coordinate={{ latitude: ride.pickup.lat, longitude: ride.pickup.lng }}
          title="Abholung"
          pinColor="#EAB308"
        />
        <Marker
          coordinate={{ latitude: ride.dropoff.lat, longitude: ride.dropoff.lng }}
          title="Ziel"
          pinColor="#2563EB"
        />
      </MapView>

      <View style={styles.card}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{statusLabels[ride.status]}</Text>
        </View>

        <View style={styles.route}>
          <Text style={styles.address}>
            📍 {ride.pickup.address || `${ride.pickup.lat.toFixed(4)}, ${ride.pickup.lng.toFixed(4)}`}
          </Text>
          <Text style={styles.arrow}>↓</Text>
          <Text style={styles.address}>
            🎯 {ride.dropoff.address || `${ride.dropoff.lat.toFixed(4)}, ${ride.dropoff.lng.toFixed(4)}`}
          </Text>
        </View>

        {ride.estimatedFare > 0 && (
          <Text style={styles.fare}>€{ride.estimatedFare.toFixed(2)} (Bar)</Text>
        )}

        {ride.customer && (
          <View style={styles.customerSection}>
            <Text style={styles.customerTitle}>Kunde</Text>
            <Text style={styles.customerName}>{ride.customer.name}</Text>
            <Text style={styles.customerPhone}>{ride.customer.phone}</Text>
            <View style={styles.contactRow}>
              <TouchableOpacity style={styles.contactBtn} onPress={callCustomer}>
                <Text style={styles.contactBtnText}>📞 Anrufen</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactBtn} onPress={whatsappCustomer}>
                <Text style={styles.contactBtnText}>💬 WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.navButton} onPress={openNavigation}>
          <Text style={styles.navButtonText}>🗺️ Navigation starten</Text>
        </TouchableOpacity>

        {nextAction && (
          <TouchableOpacity
            style={[styles.actionButton, loading && styles.buttonDisabled]}
            onPress={() => updateStatus(nextAction)}
            disabled={loading}
          >
            <Text style={styles.actionButtonText}>
              {loading ? 'Wird aktualisiert...' : statusButtonLabels[ride.status]}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  map: { height: 250 },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 20,
  },
  statusBadge: {
    backgroundColor: colors.primary + '20',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusText: { fontSize: 14, fontWeight: '600', color: colors.primaryDark },
  route: { marginBottom: 12 },
  address: { fontSize: 15, color: colors.black, marginVertical: 2 },
  arrow: { textAlign: 'center', fontSize: 16, marginVertical: 4 },
  fare: { fontSize: 22, fontWeight: 'bold', color: colors.primaryDark, marginBottom: 16 },
  customerSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  customerTitle: { fontSize: 12, fontWeight: '600', color: colors.gray, marginBottom: 4 },
  customerName: { fontSize: 16, fontWeight: '500', color: colors.black },
  customerPhone: { fontSize: 14, color: colors.gray, marginBottom: 8 },
  contactRow: { flexDirection: 'row', gap: 8 },
  contactBtn: {
    flex: 1,
    backgroundColor: colors.lightGray,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  contactBtnText: { fontSize: 13, fontWeight: '600' },
  navButton: {
    backgroundColor: colors.blue,
    padding: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 10,
  },
  navButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  actionButton: {
    backgroundColor: colors.green,
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  actionButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
})
