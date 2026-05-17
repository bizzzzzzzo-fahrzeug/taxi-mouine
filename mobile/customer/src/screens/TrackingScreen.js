import { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { colors } from '../../../shared/colors'
import { getRide } from '../../../shared/api'

const statusLabels = {
  pending: 'Wartet auf Annahme',
  accepted: 'Fahrer unterwegs',
  arrived: 'Fahrer ist da',
  in_progress: 'Fahrt gestartet',
  completed: 'Abgeschlossen',
  cancelled: 'Storniert',
}

export default function TrackingScreen({ route, navigation }) {
  const { rideId } = route.params
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getRide(rideId)
        setRide(res.ride)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()

    // TODO: Socket.io for real-time updates
    const interval = setInterval(async () => {
      try {
        const res = await getRide(rideId)
        setRide(res.ride)
      } catch {}
    }, 5000)

    return () => clearInterval(interval)
  }, [rideId])

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Lade Fahrt...</Text>
      </View>
    )
  }

  if (!ride) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Fahrt nicht gefunden</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BookRide')}>
          <Text style={styles.buttonText}>Neue Fahrt</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusCard}>
        <Text style={styles.emoji}>
          {ride.status === 'pending' ? '⏳' :
           ride.status === 'accepted' ? '🚕' :
           ride.status === 'arrived' ? '✅' :
           ride.status === 'in_progress' ? '🚗' :
           ride.status === 'completed' ? '🎉' : '❌'}
        </Text>
        <Text style={styles.statusText}>{statusLabels[ride.status]}</Text>
        {ride.estimatedFare > 0 && (
          <Text style={styles.fare}>€{ride.estimatedFare.toFixed(2)}</Text>
        )}
      </View>

      {ride.status !== 'completed' && ride.status !== 'cancelled' && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: ride.pickup.lat,
            longitude: ride.pickup.lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
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
      )}

      <View style={styles.details}>
        <Text style={styles.addressText}>
          {ride.pickup.address || `${ride.pickup.lat.toFixed(4)}, ${ride.pickup.lng.toFixed(4)}`}
        </Text>
        <Text style={styles.arrow}>↓</Text>
        <Text style={styles.addressText}>
          {ride.dropoff.address || `${ride.dropoff.lat.toFixed(4)}, ${ride.dropoff.lng.toFixed(4)}`}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BookRide')}>
        <Text style={styles.buttonText}>Neue Fahrt</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: colors.gray },
  statusCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    elevation: 2,
  },
  emoji: { fontSize: 40 },
  statusText: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  fare: { fontSize: 20, fontWeight: 'bold', color: colors.primaryDark, marginTop: 4 },
  map: { height: 250, marginHorizontal: 16, marginTop: 16, borderRadius: 12 },
  details: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  addressText: { fontSize: 14, color: colors.black },
  arrow: { textAlign: 'center', fontSize: 18, marginVertical: 4 },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: colors.black },
})
