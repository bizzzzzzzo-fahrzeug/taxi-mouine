import { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native'
import { colors } from '../../../shared/colors'
import { getMyRides } from '../../../shared/api'

const statusLabels = {
  completed: 'Abgeschlossen',
  cancelled: 'Storniert',
  pending: 'Ausstehend',
  accepted: 'Unterwegs',
  in_progress: 'In Fahrt',
}

export default function HistoryScreen({ navigation }) {
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getMyRides()
        setRides(res.rides || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function statusColor(status) {
    switch (status) {
      case 'completed': return colors.green
      case 'cancelled': return colors.red
      default: return colors.primary
    }
  }

  return (
    <View style={styles.container}>
      {rides.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Noch keine Fahrten</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BookRide')}>
            <Text style={styles.buttonText}>Erste Fahrt buchen</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.addresses}>
                  <Text style={styles.address} numberOfLines={1}>
                    {item.pickup.address || `${item.pickup.lat.toFixed(4)}, ${item.pickup.lng.toFixed(4)}`}
                  </Text>
                  <Text style={styles.arrow}>→</Text>
                  <Text style={styles.address} numberOfLines={1}>
                    {item.dropoff.address || `${item.dropoff.lat.toFixed(4)}, ${item.dropoff.lng.toFixed(4)}`}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: statusColor(item.status) + '20' }]}>
                  <Text style={[styles.badgeText, { color: statusColor(item.status) }]}>
                    {statusLabels[item.status] || item.status}
                  </Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.date}>
                  {new Date(item.bookedAt).toLocaleDateString('de-DE')}
                </Text>
                {item.estimatedFare > 0 && (
                  <Text style={styles.fare}>€{item.estimatedFare.toFixed(2)}</Text>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: colors.gray, marginBottom: 16 },
  list: { padding: 16 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  addresses: { flex: 1, marginRight: 8 },
  address: { fontSize: 13, color: colors.black },
  arrow: { textAlign: 'center', fontSize: 12, color: colors.gray, marginVertical: 2 },
  badge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  date: { fontSize: 12, color: colors.gray },
  fare: { fontSize: 14, fontWeight: 'bold', color: colors.black },
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 24,
    paddingHorizontal: 24,
  },
  buttonText: { fontSize: 14, fontWeight: 'bold', color: colors.black },
})
