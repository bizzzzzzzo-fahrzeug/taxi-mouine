import { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, TextInput,
  ScrollView, Platform,
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { colors } from '../../../shared/colors'
import { estimateFare, createRide, getToken } from '../../../shared/api'

export default function BookRideScreen({ navigation }) {
  const [region, setRegion] = useState({
    latitude: 51.1947,
    longitude: 6.4354,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  })
  const [pickup, setPickup] = useState(null)
  const [dropoff, setDropoff] = useState(null)
  const [step, setStep] = useState('pickup')
  const [fare, setFare] = useState(null)
  const [loading, setLoading] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({})
        setRegion(prev => ({
          ...prev,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        }))
      }
    })()
  }, [])

  function handleMapPress(e) {
    const coord = e.nativeEvent.coordinate
    if (step === 'pickup') {
      setPickup(coord)
      setStep('dropoff')
    } else if (step === 'dropoff') {
      setDropoff(coord)
    }
  }

  async function handleEstimate() {
    if (!pickup || !dropoff) return
    setLoading(true)
    try {
      const res = await estimateFare(pickup, dropoff)
      setFare(res.estimate)
    } catch (err) {
      Alert.alert('Fehler', err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleBook() {
    if (!getToken()) {
      navigation.navigate('Login')
      return
    }
    setLoading(true)
    try {
      let scheduledAt = null
      if (scheduledDate && scheduledTime) {
        scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
      }
      const res = await createRide(pickup, dropoff, scheduledAt)
      navigation.replace('Tracking', { rideId: res.ride._id })
    } catch (err) {
      Alert.alert('Fehler', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={region}
          onPress={handleMapPress}
        >
          {pickup && (
            <Marker coordinate={pickup} title="Abholung" pinColor="#EAB308" />
          )}
          {dropoff && (
            <Marker coordinate={dropoff} title="Ziel" pinColor="#2563EB" />
          )}
        </MapView>
        <View style={styles.mapHint}>
          <Text style={styles.mapHintText}>
            {step === 'pickup'
              ? 'Tippen Sie auf die Karte für den Abholort'
              : 'Tippen Sie für das Ziel'}
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        {pickup && (
          <View style={styles.infoBox}>
            <Text style={styles.label}>Abholung: {pickup.latitude.toFixed(4)}, {pickup.longitude.toFixed(4)}</Text>
          </View>
        )}
        {dropoff && (
          <View style={styles.infoBox}>
            <Text style={styles.label}>Ziel: {dropoff.latitude.toFixed(4)}, {dropoff.longitude.toFixed(4)}</Text>
          </View>
        )}

        {pickup && dropoff && !fare && (
          <TouchableOpacity style={styles.button} onPress={handleEstimate} disabled={loading}>
            <Text style={styles.buttonText}>Preis berechnen</Text>
          </TouchableOpacity>
        )}

        {fare && (
          <View style={styles.fareCard}>
            <Text style={styles.fareTitle}>Fahrtübersicht</Text>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Strecke</Text>
              <Text style={styles.fareValue}>{fare.distance} km</Text>
            </View>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Dauer</Text>
              <Text style={styles.fareValue}>{fare.duration} min</Text>
            </View>
            <View style={[styles.fareRow, styles.fareTotal]}>
              <Text style={styles.fareLabel}>Preis</Text>
              <Text style={styles.fareTotalValue}>{fare.fareFormatted}</Text>
            </View>

            <Text style={styles.scheduleLabel}>Für später planen (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Datum (YYYY-MM-DD)"
              value={scheduledDate}
              onChangeText={setScheduledDate}
            />
            <TextInput
              style={styles.input}
              placeholder="Uhrzeit (HH:MM)"
              value={scheduledTime}
              onChangeText={setScheduledTime}
            />

            <TouchableOpacity style={styles.button} onPress={handleBook} disabled={loading}>
              <Text style={styles.buttonText}>Fahrt buchen</Text>
            </TouchableOpacity>
            <Text style={styles.cashNote}>Nur Barzahlung</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.historyText}>Fahrtenverlauf</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  mapContainer: { height: 350 },
  map: { flex: 1 },
  mapHint: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 8,
  },
  mapHintText: { color: '#fff', textAlign: 'center', fontSize: 13 },
  form: { padding: 16 },
  infoBox: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  label: { fontSize: 14, color: colors.black },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: colors.black },
  fareCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    marginTop: 8,
  },
  fareTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  fareLabel: { fontSize: 14, color: colors.gray },
  fareValue: { fontSize: 14, fontWeight: '500' },
  fareTotal: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 8, marginTop: 8 },
  fareTotalValue: { fontSize: 18, fontWeight: 'bold', color: colors.primaryDark },
  scheduleLabel: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 8 },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 8,
  },
  cashNote: { textAlign: 'center', color: colors.gray, fontSize: 12, marginTop: 8 },
  historyButton: { alignItems: 'center', padding: 16, marginTop: 8 },
  historyText: { color: colors.primaryDark, fontWeight: '600', fontSize: 14 },
})
